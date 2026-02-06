import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SimpleEmailService {
  
  async sendOTPEmail(email: string, otp: string, username?: string): Promise<any> {
    // For demo purposes, we'll open the email client
    this.openEmailClient(email, otp, username);
    
    // Simulate successful sending
    console.log(`OTP ${otp} would be sent to ${email}`);
    return { success: true, method: 'email-client' };
  }

  openEmailClient(email: string, otp: string, username?: string): void {
    const subject = encodeURIComponent('Your OTP Code - Password Reset');
    const body = encodeURIComponent(`Hello ${username || 'User'},

Your OTP code for password reset is: ${otp}

Please enter this code to verify your email address.
This code will expire in 10 minutes for security reasons.

If you didn't request this code, please ignore this email.

Best regards,
Resume Builder Team`);
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    
    // Try to open email client
    try {
      window.open(mailtoLink, '_blank');
      console.log('Email client opened with OTP:', otp);
    } catch (error) {
      console.error('Failed to open email client:', error);
    }
  }

  // Method to send password reset emails
  sendPasswordResetEmail(email: string, resetLink: string, username?: string): void {
    const subject = encodeURIComponent('Password Reset Request');
    const body = encodeURIComponent(`Hello ${username || 'User'},

You have requested to reset your password. Click the link below to reset your password:

${resetLink}

If you didn't request this password reset, please ignore this email.
This link will expire in 1 hour for security reasons.

Best regards,
Resume Builder Team`);
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  }
}