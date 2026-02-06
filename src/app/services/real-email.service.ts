import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RealEmailService {
  private emailJSConfig = {
    serviceId: 'service_gmail', // Replace with your EmailJS service ID
    templateId: 'template_otp', // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
  };

  constructor(private http: HttpClient) {}

  async sendOTPEmail(email: string, otp: string, username?: string): Promise<any> {
    try {
      // Try EmailJS first
      const emailJSResult = await this.sendViaEmailJS(email, otp, username);
      if (emailJSResult.success) {
        return emailJSResult;
      }
    } catch (error) {
      console.log('EmailJS failed, trying alternative method');
    }

    // Fallback: Use a simple email service
    return this.sendViaSimpleAPI(email, otp, username);
  }

  private async sendViaEmailJS(email: string, otp: string, username?: string): Promise<any> {
    const emailData = {
      service_id: this.emailJSConfig.serviceId,
      template_id: this.emailJSConfig.templateId,
      user_id: this.emailJSConfig.publicKey,
      template_params: {
        to_email: email,
        to_name: username || 'User',
        otp_code: otp,
        subject: 'Your OTP Code'
      }
    };

    const response = await this.http.post('https://api.emailjs.com/api/v1.0/email/send', emailData).toPromise();
    return { success: true, method: 'EmailJS' };
  }

  private async sendViaSimpleAPI(email: string, otp: string, username?: string): Promise<any> {
    // Using a free email service like Formspree or similar
    const emailData = {
      to: email,
      subject: 'Your OTP Code',
      message: `Hello ${username || 'User'},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nYour App Team`
    };

    try {
      // Replace with your actual email service endpoint
      const response = await this.http.post('https://formspree.io/f/YOUR_FORM_ID', emailData).toPromise();
      return { success: true, method: 'Formspree' };
    } catch (error) {
      // Final fallback: mailto link
      this.openEmailClient(email, otp, username);
      return { success: false, method: 'mailto', otp };
    }
  }

  openEmailClient(email: string, otp: string, username?: string): void {
    const subject = encodeURIComponent('Your OTP Code');
    const body = encodeURIComponent(`Hello ${username || 'User'},

Your OTP code is: ${otp}

This code will expire in 10 minutes.

Best regards,
Your App Team`);
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  }
}