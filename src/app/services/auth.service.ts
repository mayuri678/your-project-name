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
      redirectTo: 'http://localhost:4200/reset-password'
    });
  }

  async getPasswordResetRequests() {
    return await this.supabase
      .from('password_reset_requests')
      .select('*')
      .order('requested_at', { ascending: false });
  }

  async resetPassword(newPassword: string) {
    return await this.supabase.auth.updateUser({
      password: newPassword
    });
  }
}