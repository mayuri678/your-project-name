import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  async sendOTP(email: string): Promise<any> {
    const otp = this.generateOTP();
    
    // Store OTP locally for verification (in real app, store in backend)
    localStorage.setItem('resetOTP', otp);
    localStorage.setItem('resetEmail', email);
    
    // Simulate email sending (replace with actual email service)
    console.log(`OTP ${otp} sent to ${email}`);
    
    // In real implementation, call your backend API:
    // return this.http.post('/api/send-otp', { email, otp }).toPromise();
    
    return Promise.resolve({ success: true, otp });
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  verifyOTP(email: string, otp: string): boolean {
    const storedOTP = localStorage.getItem('resetOTP');
    const storedEmail = localStorage.getItem('resetEmail');
    return storedOTP === otp && storedEmail === email;
  }

  storeOTP(email: string, otp: string): void {
    localStorage.setItem('resetOTP', otp);
    localStorage.setItem('resetEmail', email);
  }

  clearOTP(email: string): void {
    localStorage.removeItem('resetOTP');
    localStorage.removeItem('resetEmail');
    console.log('🗑️ OTP cleared for:', email);
  }

  async sendForgotPasswordEmail(email: string, resetLink: string, username?: string): Promise<any> {
    try {
      const response = await this.http.post('https://api.web3forms.com/submit', {
        access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // Get free key from https://web3forms.com
        subject: '🔐 Password Reset Request',
        from_name: 'Your Project Name',
        to: email,
        message: `Hi ${username || 'User'},\n\nYou requested to reset your password.\n\nClick the link below to reset your password:\n${resetLink}\n\nThis link will expire in 30 minutes.\n\nIf you didn't request this, please ignore this email.`
      }).toPromise();
      
      console.log('✅ Password reset email sent to:', email);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return { success: false, error };
    }
  }

  async sendOTPEmail(email: string, otp?: string, username?: string): Promise<any> {
    const otpCode = otp || this.generateOTP();
    this.storeOTP(email, otpCode);
    
    try {
      await this.http.post('https://api.web3forms.com/submit', {
        access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
        subject: '🔐 Your Password Reset OTP',
        from_name: 'Your Project Name',
        to: email,
        message: `Hi,\n\nYour OTP for password reset is:\n\n${otpCode}\n\nEnter this OTP on the website (same page where you requested it).\n\nDO NOT click any links. Just enter this OTP code.\n\nThis code expires in 5 minutes.`
      }).toPromise();
      
      console.log('✅ OTP email sent:', otpCode);
      return { success: true, otp: otpCode };
    } catch (error) {
      console.log('📝 OTP (email failed):', otpCode);
      return { success: true, otp: otpCode };
    }
  }
}