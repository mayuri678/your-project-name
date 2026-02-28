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
      console.log('ContactService: Starting submission...', data);
      
      // 1. Insert into contact_messages table
      console.log('ContactService: Inserting into database...');
      const { data: insertData, error: insertError } = await this.supabaseService.supabaseClient
        .from('contact_messages')
        .insert([data])
        .select()
        .single();

      if (insertError) {
        console.error('ContactService: Database error:', insertError);
        throw new Error(insertError.message);
      }
      
      console.log('ContactService: Database insert successful');

      // 2. Trigger Edge Function to send email
      console.log('ContactService: Calling email function...');
      const { data: emailData, error: emailError } = await this.supabaseService.supabaseClient
        .functions
        .invoke('send-contact-email', {
          body: data
        });

      if (emailError) {
        console.error('ContactService: Email error:', emailError);
      } else {
        console.log('ContactService: Email sent successfully');
      }

      return { success: true };
    } catch (error: any) {
      console.error('ContactService: Error:', error);
      return { success: false, error: error.message };
    }
  }
}
