import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseEmailService {

  constructor(private supabaseService: SupabaseService) {}

  // Generate OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store OTP with expiry
  storeOTP(email: string, otp: string): void {
    const otpData = {
      otp: otp,
      timestamp: Date.now(),
      expiry: Date.now() + (5 * 60 * 1000) // 5 minutes
    };
    localStorage.setItem(`otp_${email}`, JSON.stringify(otpData));
  }

  // Verify OTP
  verifyOTP(email: string, enteredOTP: string): boolean {
    const storedData = localStorage.getItem(`otp_${email}`);
    if (!storedData) return false;

    const otpData = JSON.parse(storedData);
    const now = Date.now();

    if (now > otpData.expiry) {
      localStorage.removeItem(`otp_${email}`);
      return false;
    }

    if (otpData.otp === enteredOTP) {
      localStorage.removeItem(`otp_${email}`);
      return true;
    }

    return false;
  }

  // Send OTP email using Supabase Edge Function
  async sendOTPEmail(userEmail: string, userName?: string): Promise<{ success: boolean, otp?: string }> {
    try {
      const otp = this.generateOTP();
      this.storeOTP(userEmail, otp);
      
      const displayName = userName || userEmail.split('@')[0];

      // Call Supabase Edge Function to send email
      const { data, error } = await this.supabaseService.supabaseClient
        .functions
        .invoke('send-otp-email', {
          body: {
            to: userEmail,
            userName: displayName,
            otp: otp,
            subject: '🔐 Your OTP Code - Verification Required',
            message: `OTP sent to ${userEmail}: ${otp}`
          }
        });

      if (error) {
        console.error('Supabase email error:', error);
        return { success: false };
      }

      console.log('✅ Email sent via Supabase:', data);
      return { success: true, otp: otp };

    } catch (error) {
      console.error('❌ Failed to send email via Supabase:', error);
      return { success: false };
    }
  }

  // Send email using Supabase database trigger (alternative method)
  async sendOTPViaDatabase(userEmail: string, userName?: string): Promise<{ success: boolean, otp?: string }> {
    try {
      const otp = this.generateOTP();
      this.storeOTP(userEmail, otp);
      
      const displayName = userName || userEmail.split('@')[0];

      // Insert email request into database (triggers email sending)
      const { data, error } = await this.supabaseService.supabaseClient
        .from('email_queue')
        .insert([
          {
            to_email: userEmail,
            subject: '🔐 Your OTP Code - Verification Required',
            body: `Hello ${displayName},\n\nOTP sent to ${userEmail}: ${otp}\n\nYour One-Time Password (OTP) for account verification is: ${otp}\n\n⏰ This OTP will expire in 5 minutes\n\n🔒 Security Notice:\n• Do not share this OTP with anyone\n• Use this OTP only on the official website\n• If you didn't request this OTP, please ignore this email\n\nGenerated at: ${new Date().toLocaleString()}\n\nThis is an automated message from Your Project Name.\n© 2024 Your Project Name. All rights reserved.`,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Database email error:', error);
        return { success: false };
      }

      console.log('✅ Email queued in database:', data);
      return { success: true, otp: otp };

    } catch (error) {
      console.error('❌ Failed to queue email:', error);
      return { success: false };
    }
  }

  // Create email_queue table (run this once)
  async createEmailQueueTable(): Promise<void> {
    try {
      const { error } = await this.supabaseService.supabaseClient
        .from('email_queue')
        .select('*')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        console.log('Creating email_queue table...');
        // Table doesn't exist, create it
        // Note: This would need to be done via SQL in Supabase dashboard
        console.log(`
CREATE TABLE email_queue (
  id SERIAL PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP NULL
);
        `);
      }
    } catch (error) {
      console.error('Error checking/creating email_queue table:', error);
    }
  }

  // Get setup instructions
  getSupabaseEmailSetup(): string {
    return `
📧 Supabase Email Setup Instructions:

Method 1: Edge Functions (Recommended)
1. Create Edge Function in Supabase Dashboard:
   - Go to Edge Functions
   - Create new function: send-otp-email
   - Use Deno with email service (Resend, SendGrid, etc.)

Method 2: Database Trigger
1. Create email_queue table in SQL Editor:
   CREATE TABLE email_queue (
     id SERIAL PRIMARY KEY,
     to_email VARCHAR(255) NOT NULL,
     subject VARCHAR(500) NOT NULL,
     body TEXT NOT NULL,
     status VARCHAR(50) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW(),
     sent_at TIMESTAMP NULL
   );

2. Create database trigger to send emails
3. Use webhook or cron job to process queue

Method 3: Third-party Integration
1. Use Zapier/Make.com with Supabase webhooks
2. Connect to Gmail/SendGrid/Mailgun
3. Trigger on database insert

Current Status: Using Method 2 (Database Queue)
`;
  }
}