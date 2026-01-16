import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthError, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    // Setup error handling FIRST before creating client
    this.setupErrorHandling();

    // Configure Supabase client with options to handle lock manager issues
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'x-client-info': 'angular-app'
        }
      }
    });
  }
  private isLockManagerError(error: any): boolean {
    return error?.name === 'NavigatorLockAcquireTimeoutError' ||
           error?.message?.includes('NavigatorLockAcquireTimeoutError') ||
           error?.message?.includes('lock:sb-');
  }

  private setupErrorHandling(): void {
    // Handle unhandled promise rejections related to Navigator Lock
    if (typeof window !== 'undefined') {
      // Remove any existing listener to avoid duplicates
      const handler = (event: PromiseRejectionEvent) => {
        const error = event.reason;
        if (error && this.isLockManagerError(error)) {
          // Suppress this specific error as it's handled internally by Supabase
          event.preventDefault();
          event.stopPropagation();
          // Don't log to console to avoid noise
          return false;
        }
        return true;
      };

      window.addEventListener('unhandledrejection', handler, { capture: true });

      // Also handle console errors
      const originalError = console.error;
      console.error = (...args: any[]) => {
        const errorString = args.join(' ');
        if (errorString.includes('NavigatorLockAcquireTimeoutError') ||
            errorString.includes('lock:sb-')) {
          // Suppress lock manager errors
          return;
        }
        originalError.apply(console, args);
      };
    }
  }

  async login(email: string, password: string): Promise<{ data: { session: Session | null }; error: AuthError | null }> {
    try {
    const result = await this.supabase.auth.signInWithPassword({ email, password });

      // Log the full result for debugging (ignore lock manager errors)
      if (result.error && !this.isLockManagerError(result.error)) {
        console.error('Supabase login error details:', {
          message: result.error.message,
          status: result.error.status,
          name: result.error.name
        });
      }

    if (result.data && result.data.session) {
      try {
        const nameFromEmail = email.includes('@') ? email.split('@')[0] : email;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserEmail', email);
        localStorage.setItem('currentUserName', nameFromEmail);

        // Add user to logged-in users list
        this.authService.addLoggedInUser(email, nameFromEmail);

          // Ensure user exists in custom users table
          await this.ensureUserInTable(result.data.session.user.id, email, nameFromEmail);
      } catch {}
    }
    return result;
    } catch (error: any) {
      // Ignore NavigatorLockAcquireTimeoutError as it's handled internally
      if (this.isLockManagerError(error)) {
        // Retry login after a short delay
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
          const retryResult = await this.supabase.auth.signInWithPassword({ email, password });
          return retryResult;
        } catch (retryError: any) {
          if (!this.isLockManagerError(retryError)) {
            console.error('Supabase login exception:', retryError);
          }
        }
      } else {
        console.error('Supabase login exception:', error);
      }

      return {
        data: { session: null },
        error: {
          message: error?.message || 'An unexpected error occurred',
          status: error?.status || 500,
          name: error?.name || 'AuthError'
        } as AuthError
      };
    }
  }

  async signUp(email: string, password: string) {
    try {
      const nameFromEmail = email.includes('@') ? email.split('@')[0] : email;

      // Sign up with metadata (full_name)
      const result = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nameFromEmail,
            name: nameFromEmail
          }
        }
      });

      // If user is created, ensure they exist in custom users table
      if (result.data?.user) {
        await this.ensureUserInTable(result.data.user.id, email, nameFromEmail);

        // If no session (email confirmation required), try to auto-login
        if (!result.data.session && result.data.user) {
          // Wait a moment for user to be fully created
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Try to sign in (this might work if email confirmation is disabled)
          try {
            const loginResult = await this.supabase.auth.signInWithPassword({ email, password });
            if (loginResult.data?.session) {
              // Successfully logged in - return session
              return {
                data: {
                  user: loginResult.data.user,
                  session: loginResult.data.session
                },
                error: null
              };
            }
          } catch (loginErr) {
            // Login failed, return original signup result
            console.debug('Auto-login after signup failed (email confirmation may be required)');
          }
        }
      }

      return result;
    } catch (error: any) {
      // Ignore lock manager errors
      if (!this.isLockManagerError(error)) {
        console.error('Supabase signup error:', error);
      }
      return {
        data: { user: null, session: null },
        error: error as AuthError
      };
    }
  }

  // 🔹 Ensure user exists in custom users table
  private async ensureUserInTable(userId: string, email: string, fullName: string): Promise<void> {
    try {
      console.log('🔍 Checking user in table:', { userId, email, fullName });
      
      // Check if user exists
      const { data: existingUser, error: selectError } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      console.log('🔍 User check result:', { existingUser, selectError });

      if (selectError) {
        console.error('❌ Error checking user:', selectError);
        return;
      }

      if (!existingUser) {
        console.log('➕ User not found, creating new user...');
        const { data: newUser, error: insertError } = await this.supabase
          .from('users')
          .insert([{
            id: userId,
            email: email,
            full_name: fullName,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating user:', insertError);
          
          // If insert fails due to conflict, try update
          if (insertError.code === '23505') {
            console.log('🔄 User already exists (conflict), updating...');
            const { error: updateError } = await this.supabase
              .from('users')
              .update({ 
                full_name: fullName
              })
              .eq('id', userId);
            
            if (updateError) {
              console.error('❌ Error updating user:', updateError);
            } else {
              console.log('✅ User updated in table:', email);
            }
          }
        } else {
          console.log('✅ User created successfully:', newUser);
        }
      } else {
        console.log('ℹ️ User already exists, updating if needed...');
        // User exists, update full_name if needed
        const { error: updateError } = await this.supabase
          .from('users')
          .update({ 
            full_name: fullName
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('❌ Error updating user:', updateError);
        } else {
          console.log('✅ User updated in table:', email);
        }
      }
    } catch (error) {
      console.error('❌ Unexpected error in ensureUserInTable:', error);
    }
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  get supabaseClient() {
    return this.supabase;
  }

  // 🔹 Reset password functionality
  async resetPassword(email: string) {
    try {
      console.log('Sending password reset email to:', email);
      const result = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      console.log('Password reset result:', result);
      
      if (result.error) {
        console.error('Password reset error:', result.error);
      } else {
        console.log('Password reset email sent successfully');
      }
      
      return result;
    } catch (error: any) {
      console.error('Password reset exception:', error);
      return { 
        data: null,
        error: {
          message: error?.message || 'Failed to send password reset email',
          status: error?.status || 500
        }
      };
    }
  }

  // 🔹 Admin update user password in database
  async updateUserPassword(userId: string, newPassword: string) {
    try {
      console.log('Admin updating password for user:', userId);
      
      // Update password in users table (custom field)
      const { data, error } = await this.supabase
        .from('users')
        .update({ 
          password: newPassword
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error updating user password:', error);
        return { success: false, error: error.message };
      }

      console.log('Password updated successfully:', data);
      return { success: true, data };
    } catch (error: any) {
      console.error('Exception updating user password:', error);
      return { success: false, error: error.message };
    }
  }

  // 🔹 Update user password by email
  async updateUserPasswordByEmail(email: string, newPassword: string) {
    try {
      console.log('Admin updating password for email:', email);
      
      const { data, error } = await this.supabase
        .from('users')
        .update({ 
          password: newPassword
        })
        .eq('email', email)
        .select();

      if (error) {
        console.error('Error updating password by email:', error);
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'User not found' };
      }

      console.log('Password updated successfully for email:', data);
      return { success: true, data: data[0] };
    } catch (error: any) {
      console.error('Exception updating password by email:', error);
      return { success: false, error: error.message };
    }
  }

  // 🔹 Admin password reset functionality
  async adminResetPassword(email: string, newPassword: string) {
    try {
      console.log('Admin resetting password for:', email);
      
      // First, send a password reset email
      const resetResult = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (resetResult.error) {
        console.error('Admin password reset error:', resetResult.error);
        return { success: false, error: resetResult.error.message };
      }
      
      console.log('Password reset email sent successfully by admin');
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error: any) {
      console.error('Admin password reset exception:', error);
      return { 
        success: false, 
        error: error?.message || 'Failed to reset password'
      };
    }
  }

  // 🔹 Fetch all users from the users table
  async getUsers() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
      }

      return { data, error };
    } catch (error: any) {
      console.error('Exception fetching users:', error);
      return { data: null, error };
    }
  }

  // 🔹 Fetch a single user by ID
  async getUserById(id: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user by ID:', error);
      }

      return { data, error };
    } catch (error: any) {
      console.error('Exception fetching user by ID:', error);
      return { data: null, error };
    }
  }

  // 🔹 Fetch a single user by email
  async getUserByEmail(email: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle(); // Use maybeSingle instead of single to handle 406 errors

      if (error) {
        // Don't log 406 errors (Not Acceptable) or PGRST116 (no rows) - usually means RLS policy or user doesn't exist
        const errorStatus = (error as any).status;
        if (error.code !== 'PGRST116' && errorStatus !== 406) {
          console.error('Error fetching user by email:', error);
        }
      }

      return { data, error };
    } catch (error: any) {
      // Ignore 406 errors
      if (error?.status !== 406 && error?.code !== 'PGRST116') {
        console.error('Exception fetching user by email:', error);
      }
      return { data: null, error };
    }
  }

  // 🔹 Update user data
  async updateUser(id: string, updates: { full_name?: string; email?: string }) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
      }

      return { data, error };
    } catch (error: any) {
      console.error('Exception updating user:', error);
      return { data: null, error };
    }
  }

  // 🔹 Create a user in the users table (for manual insertion)
  async createUser(userData: { full_name?: string; email: string; password?: string }) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
      }

      return { data, error };
    } catch (error: any) {
      console.error('Exception creating user:', error);
      return { data: null, error };
    }
  }

  // 🔹 Save template data (insert or update)
  async saveTemplate(templateData: any) {
    try {
      // Check if user is logged in via localStorage first
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userEmail = localStorage.getItem('currentUserEmail');
      
      if (!isLoggedIn || !userEmail) {
        throw new Error('User not authenticated');
      }

      // Try to get current session
      const { data: { session } } = await this.supabase.auth.getSession();
      
      // Use session user ID if available, otherwise create a simple ID from email
      const userId = session?.user?.id || userEmail;

      const templatePayload = {
        title: templateData.content.name || 'Untitled Resume',
        description: JSON.stringify(templateData.content),
        category: templateData.templateId,
        image_url: userEmail
      };

      // If existingId is provided, update the existing template
      if (templateData.existingId) {
        const { data, error } = await this.supabase
          .from('templates')
          .update(templatePayload)
          .eq('id', templateData.existingId)
          .select()
          .single();
        return { data, error };
      } else {
        // Otherwise, insert a new template
        const { data, error } = await this.supabase
          .from('templates')
          .insert(templatePayload)
          .select()
          .single();
        return { data, error };
      }
    } catch (error: any) {
      console.error('Error saving template:', error);
      return { data: null, error };
    }
  }

  // 🔹 Get template by ID
  async getTemplateById(templateId: string) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      return { data, error };
    } catch (error: any) {
      console.error('Error fetching template:', error);
      return { data: null, error };
    }
  }

  // 🔹 Get user templates
  async getUserTemplates() {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userEmail = localStorage.getItem('currentUserEmail');
      
      if (!isLoggedIn || !userEmail) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .eq('image_url', userEmail)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      return { data: null, error };
    }
  }

  // 🔹 Get all templates (for admin)
  async getAllTemplates() {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error: any) {
      console.error('Error fetching all templates:', error);
      return { data: null, error };
    }
  }

  // 🔹 Create template from Admin Panel (only meta info, not full resume)
  async createAdminTemplate(template: {
    name: string;
    category: string;
    description?: string;
    color?: string;
    layout?: string;
    templateFeatures?: string[];
    isPremium?: boolean;
    price?: number;
    isActive?: boolean;
  }) {
    try {
      // Check for authenticated session
      let { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      
      // If no session, try to create one with mock admin credentials
      if (!session || !session.user?.id) {
        console.log('No session found, attempting admin login...');
        const loginResult = await this.login('admin@example.com', 'admin123');
        
        if (loginResult.data?.session) {
          session = loginResult.data.session;
          console.log('Admin session created successfully');
        } else {
          // Create a mock session for template creation
          console.log('Creating template with mock admin credentials');
          const mockUserId = 'admin-mock-' + Date.now();
          
          const resumeMeta = {
            name: template.name,
            description: template.description || '',
            templateColor: template.color || 'Blue',
            templateLayout: template.layout || '1 Column',
            templateFeatures: template.templateFeatures || ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio'],
            isPremium: template.isPremium ?? false,
            price: template.price ?? 0,
            isActive: template.isActive ?? true
          };

          const basePayload = {
            user_id: mockUserId,
            category: template.category || 'Professional',
            title: template.name,
            description: JSON.stringify(resumeMeta)
          };

          console.log('Inserting template with payload:', basePayload);

          const { data, error } = await this.supabase
            .from('templates')
            .insert(basePayload)
            .select()
            .single();

          if (error) {
            console.error('Template creation failed:', error);
            // Try without user_id if RLS is blocking
            const fallbackPayload = {
              category: template.category || 'Professional',
              title: template.name,
              description: JSON.stringify(resumeMeta)
            };
            
            const fallbackResult = await this.supabase
              .from('templates')
              .insert(fallbackPayload)
              .select()
              .single();
              
            if (fallbackResult.error) {
              console.error('Fallback template creation also failed:', fallbackResult.error);
              return { data: null, error: fallbackResult.error };
            }
            
            console.log('Template created with fallback method:', fallbackResult.data);
            return { data: fallbackResult.data, error: null };
          }

          console.log('Template created successfully:', data);
          return { data, error: null };
        }
      }

      if (!session || !session.user?.id) {
        const authError = { message: 'User not authenticated for template insert' };
        console.error(authError.message);
        return { data: null, error: authError };
      }

      // Store visual/template information inside description JSON
      const resumeMeta = {
        name: template.name,
        description: template.description || '',
        templateColor: template.color || 'Blue',
        templateLayout: template.layout || '1 Column',
        templateFeatures: template.templateFeatures || [],
        isPremium: template.isPremium ?? false,
        price: template.price ?? 0,
        isActive: template.isActive ?? true
      };

      // Minimal payload to match your live Supabase schema
      const category = template.category || 'my-template';
      const slug = template.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 60) || 'template';
      const templateId = `${slug}-${Date.now()}`;

      const basePayload = {
        user_id: session.user.id,
        category,
        title: template.name,
        description: JSON.stringify(resumeMeta)
      };

      // First attempt with template_id
      const payloadWithTemplateId: Record<string, any> = {
        ...basePayload,
        template_id: templateId
      };

      let { data, error } = await this.supabase
        .from('templates')
        .insert(payloadWithTemplateId)
        .select()
        .single();

      // If column missing, retry without template_id
      if (error && `${error.message}`.toLowerCase().includes("template_id")) {
        console.warn('template_id column missing, retrying without it');
        const payloadWithoutTemplateId = { ...basePayload };
        const retry = await this.supabase
          .from('templates')
          .insert(payloadWithoutTemplateId)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error('Error creating admin template:', error);
      }

      return { data, error };
    } catch (error: any) {
      console.error('Exception creating admin template:', error);
      return { data: null, error };
    }
  }

  // 🔹 Update template HTML content
  async updateTemplateContent(templateId: string, htmlContent: string) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .update({ html_content: htmlContent })
        .eq('id', templateId)
        .select()
        .single();

      return { data, error };
    } catch (error: any) {
      console.error('Error updating template content:', error);
      return { data: null, error };
    }
  }

  // 🔹 Update template (admin)
  async updateTemplate(templateId: string, updates: any) {
    try {
      // Get existing template first
      const { data: existingTemplate } = await this.supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (!existingTemplate) {
        return { data: null, error: { message: 'Template not found' } };
      }

      let resumeData = {};
      try {
        if (existingTemplate.description) {
          resumeData = JSON.parse(existingTemplate.description);
        }
      } catch (e) {
        // If parsing fails, use existing description as is
        resumeData = { originalDescription: existingTemplate.description };
      }

      // Update resume data with new template properties
      const updatedResumeData = {
        ...resumeData,
        name: updates.name || (resumeData as any).name,
        templateColor: updates.color || (resumeData as any).templateColor,
        templateLayout: updates.layout || (resumeData as any).templateLayout,
        templateFeatures: updates.templateFeatures || (resumeData as any).templateFeatures,
        isActive: updates.isActive !== undefined ? updates.isActive : (resumeData as any).isActive
      };

      // Update the template in database
      const { data, error } = await this.supabase
        .from('templates')
        .update({
          title: updates.name || existingTemplate.title,
          category: updates.category || existingTemplate.category,
          description: updates.description || JSON.stringify(updatedResumeData),
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId)
        .select()
        .single();

      console.log('Template updated in Supabase:', { templateId, updates, result: data });
      return { data, error };
    } catch (error: any) {
      console.error('Error updating template:', error);
      return { data: null, error };
    }
  }

  // 🔹 Delete template
  async deleteTemplate(templateId: string) {
    try {
      const { data, error } = await this.supabase
        .from('templates')
        .delete()
        .eq('id', templateId)
        .select();

      return { data, error };
    } catch (error: any) {
      console.error('Error deleting template:', error);
      return { data: null, error };
    }
  }

  // 🔹 Fetch password reset requests
  async getPasswordResetRequests() {
    try {
      const { data, error } = await this.supabase
        .from('password_reset_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      return { data, error };
    } catch (error: any) {
      console.error('Error fetching password reset requests:', error);
      return { data: null, error };
    }
  }

  // 🔹 Log password change request
  async logPasswordChange(email: string, username?: string) {
    try {
      const { data, error } = await this.supabase
        .from('password_reset_requests')
        .insert([{
          email,
          username: username || null
        }])
        .select()
        .single();

      return { data, error };
    } catch (error: any) {
      console.error('Error logging password change:', error);
      return { data: null, error };
    }
  }
}
