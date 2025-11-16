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
      console.log('Ensuring user in table:', { userId, email, fullName });
      
      // Check if user already exists
      const { data: existingUser, error: selectError } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (selectError && selectError.code !== 'PGRST116') {
        console.warn('Error checking existing user:', selectError);
      }

      if (!existingUser) {
        // User doesn't exist, create them
        console.log('User not found, creating new user in table...');
        const { data: insertedData, error: insertError } = await this.supabase
          .from('users')
          .insert([{
            id: userId,
            email: email,
            full_name: fullName,
            created_at: new Date().toISOString()
          }])
          .select();

        if (insertError) {
          console.error('Error inserting user in table:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
          
          // If insert fails due to conflict, try update
          if (insertError.code === '23505') {
            console.log('User already exists (conflict), updating...');
            const { error: updateError } = await this.supabase
              .from('users')
              .update({ full_name: fullName })
              .eq('id', userId);
            
            if (updateError) {
              console.error('Error updating user:', updateError);
            } else {
              console.log('User updated in table:', email);
            }
          }
        } else {
          console.log('✅ User successfully created in users table:', email, insertedData);
        }
      } else {
        console.log('User already exists in table, updating if needed...');
        // User exists, update full_name if needed
        if (existingUser.id === userId) {
          const { error: updateError } = await this.supabase
            .from('users')
            .update({ full_name: fullName })
            .eq('id', userId);
          
          if (updateError) {
            console.error('Error updating user:', updateError);
          } else {
            console.log('User updated in table:', email);
          }
        }
      }
    } catch (error: any) {
      console.error('Exception in ensureUserInTable:', error);
    }
  }

  async signOut() {
    return await this.supabase.auth.signOut();
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
}
