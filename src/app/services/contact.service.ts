import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ContactMessage {
  full_name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private supabaseService: SupabaseService) {}

  async submitContactForm(data: ContactMessage): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Insert into contact_messages table
      const { data: insertData, error: insertError } = await this.supabaseService.supabaseClient
        .from('contact_messages')
        .insert([data])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 2. Trigger Edge Function to send email
      const { data: emailData, error: emailError } = await this.supabaseService.supabaseClient
        .functions
        .invoke('send-contact-email', {
          body: data
        });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw error - message is already saved
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
