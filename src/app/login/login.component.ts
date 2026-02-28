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

  ngOnInit(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // 🔹 Register new user - registers in Supabase
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

    // Register in Supabase
    const { data, error } = await this.supabaseAuthService.signUp(emailTrimmed, passwordTrimmed);
    
    if (error) {
      this.errorMessage = error.message || 'Registration failed. Please try again.';
      return;
    }
    
    if (data.user) {
      this.successMessage = 'Account created successfully! Logging you in...';
      console.log('✅ Registration completed in Supabase');
      
      // Auto-login
      setTimeout(async () => {
        const loginResult = await this.supabaseAuthService.signIn(emailTrimmed, passwordTrimmed);
        if (loginResult.data.user) {
          this.authService.setCurrentUser(emailTrimmed, nameTrimmed, 'user');
          this.router.navigate(['/home'], { replaceUrl: true });
        }
      }, 1000);
    }
  }

  // 🔹 Login - uses Supabase authentication
  async onLogin(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter email and password';
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

    // Supabase login (primary)
    const { data, error } = await this.supabaseAuthService.signIn(emailTrimmed, passwordTrimmed);
    
    if (!error && data.user) {
      console.log('✅ Supabase login successful');
      const userName = data.user.user_metadata?.['full_name'] || emailTrimmed.split('@')[0];
      const userRole = data.user.user_metadata?.['role'] || 'user';
      this.authService.setCurrentUser(emailTrimmed, userName, userRole);
      this.successMessage = 'Login successful!';
      setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 500);
      return;
    }

    // Local fallback
    const localLoginSuccess = this.authService.login(emailTrimmed, passwordTrimmed);
    if (localLoginSuccess) {
      console.log('✅ Local login successful');
      this.successMessage = 'Login successful!';
      setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 500);
      return;
    }

    // Failed
    this.errorMessage = 'Invalid email or password';
    console.log('❌ Login failed:', error?.message || 'Invalid credentials');
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
