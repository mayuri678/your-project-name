import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { EmailService } from '../services/email.service';
import { SimpleEmailService } from '../services/simple-email.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isRegisterMode: boolean = false;
  isForgotPasswordMode: boolean = false;
  showForgotPopup: boolean = false;
  forgotEmail: string = '';
  otpSent: boolean = false;
  isLoading: boolean = false;

  // 👉 popup बंद करण्यासाठी event emitter
  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private supabaseAuthService: SupabaseAuthService,
    private emailService: EmailService,
    private simpleEmailService: SimpleEmailService,
    private router: Router,
    private location: Location
  ) {
  }

  // 🔹 Register new user - registers directly in AuthService
  async onRegister(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    const emailTrimmed = this.email.trim();
    const passwordTrimmed = this.password.trim();
    const nameTrimmed = this.name.trim() || (emailTrimmed.includes('@') ? emailTrimmed.split('@')[0] : emailTrimmed);

    // Register in AuthService
    const success = this.authService.register(emailTrimmed, passwordTrimmed, nameTrimmed, 'user');
    
    if (success) {
      this.successMessage = 'Account created successfully!';
      
      // Save to Supabase
      try {
        const uniqueId = emailTrimmed.replace(/[@.]/g, '_').toLowerCase();
        const profileData = {
          id: uniqueId,
          email: emailTrimmed,
          full_name: nameTrimmed,
          username: nameTrimmed,
          role: 'user',
          is_dark_mode: false,
          language: 'en'
        };
        
        await this.supabaseAuthService.upsertUserProfile(profileData);
        console.log('✅ Registration saved to Supabase');
      } catch (error) {
        console.error('❌ Supabase save failed:', error);
      }
      
      // Auto-login
      setTimeout(() => {
        const loginSuccess = this.authService.login(emailTrimmed, passwordTrimmed);
        if (loginSuccess) {
          this.close.emit();
          this.router.navigate([{ outlets: { modal: null } }]).then(() => {
            this.router.navigate(['/loading'], { replaceUrl: true });
          });
        }
      }, 1000);
    } else {
      this.errorMessage = 'This email is already registered. Please login instead.';
    }
  }

  // 🔹 Login - simplified login logic
  async onLogin(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    const emailTrimmed = this.email.trim();
    const passwordTrimmed = this.password.trim();

    console.log('🔐 Login attempt:', { email: emailTrimmed });

    this.authService.clearUserSession();

    const loginSuccess = this.authService.login(emailTrimmed, passwordTrimmed);
    
    if (loginSuccess) {
      console.log('✅ Login successful');
      
      const currentUser = this.authService.getCurrentUser();
      const userRole = this.authService.getCurrentUserRole();
      
      // Save to Supabase
      try {
        const uniqueId = emailTrimmed.replace(/[@.]/g, '_').toLowerCase();
        const userName = currentUser?.name || emailTrimmed.split('@')[0];
        
        const profileData = {
          id: uniqueId,
          email: emailTrimmed,
          full_name: userName,
          username: userName,
          role: userRole || 'user',
          is_dark_mode: false,
          language: 'en'
        };
        
        await this.supabaseAuthService.upsertUserProfile(profileData);
        console.log('✅ Login info saved to Supabase');
      } catch (error) {
        console.error('❌ Supabase save failed:', error);
      }
      
      this.successMessage = 'Login successful!';
      this.close.emit();
      
      setTimeout(() => {
        this.router.navigate([{ outlets: { modal: null } }]).then(() => {
          if (userRole === 'admin') {
            this.router.navigate(['/admin'], { replaceUrl: true });
          } else {
            this.router.navigate(['/loading'], { replaceUrl: true });
          }
        });
      }, 1000);
      return;
    }

    this.errorMessage = 'Invalid email or password. Please check your credentials.';
    console.log('❌ Login failed for:', emailTrimmed);
  }

  // 🔹 Toggle between login and register modes
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.name = '';
  }

  // 👉 Close the modal
  onClose(): void {
    this.close.emit();
    // Clear modal outlet and navigate to home
    this.router.navigate([{ outlets: { modal: null } }]).then(() => {
      this.router.navigate(['/home']);
    });
  }

  // 👉 Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔹 Navigate to Forgot Password page
  navigateToForgotPassword(): void {
    this.close.emit();
    this.router.navigate([{ outlets: { modal: null } }]).then(() => {
      this.router.navigate(['/forgot-password']);
    });
  }

  // 🔹 Show forgot password popup
  showForgotPasswordPopup(): void {
    this.showForgotPopup = true;
    this.forgotEmail = '';
    this.otpSent = false;
  }

  // 🔹 Close forgot password popup
  closeForgotPopup(): void {
    this.showForgotPopup = false;
    this.forgotEmail = '';
    this.otpSent = false;
  }

  // 🔹 Send OTP to email using Supabase
  async sendOTP(): Promise<void> {
    if (!this.forgotEmail.trim()) {
      this.errorMessage = 'Please enter your email';
      return;
    }
    
    this.errorMessage = '';
    this.isLoading = true;
    
    try {
      console.log('📧 Sending OTP via Supabase to:', this.forgotEmail);
      
      // Navigate directly to OTP-based forgot password flow
      this.close.emit();
      this.router.navigate([{ outlets: { modal: null } }]).then(() => {
        this.router.navigate(['/forgot-password-otp']);
      });
      
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = 'Navigation failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
