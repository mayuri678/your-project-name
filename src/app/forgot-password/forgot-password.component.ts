import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { EmailService } from '../services/email.service';
import { SimpleEmailService } from '../services/simple-email.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  isLoading: boolean = false;
  otpVerified: boolean = false;
  otpSent: boolean = false;
  generatedOtp: string = '';
  
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private simpleEmailService: SimpleEmailService,
    private router: Router
  ) {}

  async sendOtp(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    
    // Generate OTP
    this.generatedOtp = this.emailService.generateOTP();
    this.emailService.storeOTP(this.email, this.generatedOtp);
    
    // Show on page
    this.otpSent = true;
    this.successMessage = `Your OTP: ${this.generatedOtp}`;
    
    console.log('🔑 OTP:', this.generatedOtp);
  }

  async verifyOtp(): Promise<void> {
    if (!this.otp.trim()) {
      this.errorMessage = 'OTP is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify OTP using EmailService
      const isValidOtp = this.emailService.verifyOTP(this.email, this.otp);
      
      if (isValidOtp) {
        this.otpVerified = true;
        this.successMessage = 'OTP verified successfully! You can now reset your password.';
        console.log('✅ OTP verified for:', this.email);
      } else {
        this.errorMessage = 'Invalid or expired OTP';
        console.log('❌ Invalid OTP for:', this.email);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      this.errorMessage = 'Error verifying OTP';
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword(): Promise<void> {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      console.log('🔄 Resetting password for:', this.email);
      
      // Use AuthService changePassword method
      const result = await this.authService.changePassword('', this.newPassword);
      
      if (result.success) {
        this.successMessage = 'Password reset successfully! Redirecting to login...';
        console.log('✅ Password reset successful for:', this.email);
        
        // Clear OTP after successful reset
        this.emailService.clearOTP(this.email);
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        // Fallback: Direct password update
        const registeredUsers = this.authService.getAllUsers();
        const userIndex = registeredUsers.findIndex(u => u.email === this.email);
        
        if (userIndex !== -1) {
          registeredUsers[userIndex].password = this.newPassword;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          this.successMessage = 'Password updated successfully! Redirecting to login...';
        } else {
          const newUser = {
            email: this.email,
            password: this.newPassword,
            name: this.email.split('@')[0],
            role: 'user' as 'user'
          };
          registeredUsers.push(newUser);
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          this.successMessage = 'Account created with new password! Redirecting to login...';
        }
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error resetting password:', error);
      this.errorMessage = 'Error updating password';
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return false;
    }
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    
    if (!this.otpVerified) {
      this.errorMessage = 'Please verify OTP first';
      return false;
    }
    
    return true;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}