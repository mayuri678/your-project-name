import { Component, EventEmitter, Output, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
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

  // 👉 popup stop event emitter
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

  ngOnInit(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // 🔹 Register new user - registers only in Supabase
  async onRegister(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    const emailTrimmed = this.email.trim();
    const passwordTrimmed = this.password.trim();
    const nameTrimmed = this.name.trim() || (emailTrimmed.includes('@') ? emailTrimmed.split('@')[0] : emailTrimmed);

    try {
      // Register in Supabase only
      const { data, error } = await this.supabaseAuthService.signUp(emailTrimmed, passwordTrimmed);
      
      if (error) {
        console.log('❌ Supabase registration error:', error.message);
        this.errorMessage = error.message || 'Registration failed';
        this.isLoading = false;
        return;
      }
      
      if (data.user) {
        console.log('✅ Supabase registration successful:', data.user.id);
        
        // Create user profile in Supabase
        const uniqueId = emailTrimmed.replace(/[@.]/g, '_').toLowerCase();
        await this.supabaseAuthService.upsertUserProfile({
          id: uniqueId,
          email: emailTrimmed,
          full_name: nameTrimmed,
          username: nameTrimmed,
          role: 'user',
          is_dark_mode: false,
          language: 'en'
        });
        
        this.successMessage = 'Account created successfully! Logging you in...';
        console.log('✅ Registration completed');
        
        setTimeout(async () => {
          // Set current user in localStorage for session
          this.authService.setCurrentUser(emailTrimmed, nameTrimmed, 'user');
          this.authService.addLoggedInUser(emailTrimmed, nameTrimmed);
          await this.supabaseAuthService.saveLoginHistory(emailTrimmed, 'supabase_auth');
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      this.errorMessage = 'Registration failed. Please try again.';
      this.isLoading = false;
    }
  }

  // 🔹 Login - uses Supabase authentication only
  async onLogin(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter email and password';
      this.isLoading = false;
      return;
    }

    const emailTrimmed = this.email.trim();
    const passwordTrimmed = this.password.trim();

    console.log('🔐 Login attempt:', emailTrimmed);

    // Admin login
    if (emailTrimmed === 'admin' && passwordTrimmed === 'admin') {
      this.authService.setCurrentUser('admin@example.com', 'Admin User', 'admin');
      this.successMessage = 'Admin login successful!';
      setTimeout(() => this.router.navigate(['/admin/dashboard'], { replaceUrl: true }), 500);
      return;
    }

    try {
      // Login via Supabase
      const { data, error } = await this.supabaseAuthService.signIn(emailTrimmed, passwordTrimmed);
      
      if (error) {
        console.log('❌ Supabase login failed:', error.message);
        this.errorMessage = 'Invalid email or password';
        this.isLoading = false;
        return;
      }
      
      if (data.user) {
        console.log('✅ Supabase login successful');
        // Set current user in localStorage for session
        this.authService.setCurrentUser(emailTrimmed, emailTrimmed.split('@')[0], 'user');
        this.authService.addLoggedInUser(emailTrimmed, emailTrimmed.split('@')[0]);
        await this.supabaseAuthService.saveLoginHistory(emailTrimmed, 'supabase_auth');
        this.successMessage = 'Login successful!';
        setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 500);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      this.errorMessage = 'Invalid email or password';
    } finally {
      this.isLoading = false;
    }
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
    this.router.navigate(['/home']);
  }

  // 👉 Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // 🔹 Navigate to Forgot Password page
  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
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
      this.router.navigate(['/forgot-password']);
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = 'Navigation failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
