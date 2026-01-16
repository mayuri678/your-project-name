import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://your-project-ref.supabase.co', // Replace with your actual URL
      'your-anon-key-here' // Replace with your actual anon key
    );
  }

  async forgotPassword(email: string) {
    const username = email.split('@')[0]; // Simple fallback

    console.log('Inserting request:', { email, username });
    
    // Log the request
    const { data, error } = await this.supabase.from('password_reset_requests').insert({
      email: email,
      username: username,
      requested_at: new Date().toISOString()
    });

    console.log('Insert result:', { data, error });

    return await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  }

  async getPasswordResetRequests() {
    return await this.supabase
      .from('password_reset_requests')
      .select('*')
      .order('requested_at', { ascending: false });
  }

  async setSession(accessToken: string, refreshToken: string) {
    const { data, error } = await this.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    
    if (error) {
      console.error('Error setting session:', error);
    }
    
    return { data, error };
  }

  async resetPassword(newPassword: string) {
    try {
      // Check if user is authenticated and has a valid session
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !user) {
        return { error: { message: 'No active session found. Please request a new password reset link.' } };
      }

      const { data, error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      return { error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  }
}