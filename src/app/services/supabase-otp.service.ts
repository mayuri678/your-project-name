import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseOtpService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://kwlaqovlzhxghwtilxxu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bGFxb3Zsemh4Z2h3dGlseHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjQ0MzMsImV4cCI6MjA3ODUwMDQzM30.L2jcB8zc2sN1GH3F9CNhKLbaD2jAFs_iGmcFSYA6vQA'
    );
  }

  async sendPasswordResetOtp(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: undefined
    });
    return { data, error };
  }

  async verifyOtp(email: string, token: string) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });
    return { data, error };
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  }
}