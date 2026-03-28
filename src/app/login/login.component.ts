import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';

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
  showForgotPopup: boolean = false;
  forgotEmail: string = '';
  isLoading: boolean = false;

  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private supabaseAuth: SupabaseAuthService
  ) {}

  ngOnInit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';  // CLEAR EMAIL FIELD
    this.password = '';
    this.name = '';
    console.log('Login component initialized');
  }

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
    const nameTrimmed = this.name.trim() || emailTrimmed.split('@')[0];

    try {
      const { data, error } = await this.supabaseAuth.signUp(emailTrimmed, passwordTrimmed);

      if (error) {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.isLoading = false;
        return;
      }

      if (data?.session) {
        // Auto-logged in (email confirmation disabled)
        this.authService.setCurrentUser(emailTrimmed, nameTrimmed, 'user');
        this.authService.addLoggedInUser(emailTrimmed, nameTrimmed);
        this.successMessage = 'Account created! Redirecting...';
        setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 800);
      } else {
        // Email confirmation required
        this.successMessage = 'Account created! Please check your email to confirm your account.';
        this.isLoading = false;
      }
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
      this.isLoading = false;
    }
  }

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

    // Admin shortcut
    if (emailTrimmed === 'admin' && passwordTrimmed === 'admin') {
      this.authService.setCurrentUser('admin@example.com', 'Admin User', 'admin');
      this.successMessage = 'Admin login successful!';
      setTimeout(() => this.router.navigate(['/admin/dashboard'], { replaceUrl: true }), 500);
      return;
    }

    try {
      // Step 1: Try Supabase signIn
      const { data, error } = await this.supabaseAuth.signIn(emailTrimmed, passwordTrimmed);

      if (!error && data?.user) {
        const name = data.user.user_metadata?.['full_name'] || emailTrimmed.split('@')[0];
        this.authService.setCurrentUser(emailTrimmed, name, 'user');
        this.authService.addLoggedInUser(emailTrimmed, name);
        this.successMessage = 'Login successful!';
        setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 500);
        return;
      }

      // Step 2: signIn failed → try signUp (auto-create account)
      const { data: signUpData, error: signUpError } = await this.supabaseAuth.signUp(emailTrimmed, passwordTrimmed);

      if (!signUpError && signUpData?.user) {
        const name = emailTrimmed.split('@')[0];
        this.authService.setCurrentUser(emailTrimmed, name, 'user');
        this.authService.addLoggedInUser(emailTrimmed, name);

        if (signUpData.session) {
          // Email confirmation OFF → session ready
          this.successMessage = 'Login successful!';
          setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 500);
        } else {
          // Email confirmation ON → still navigate (local session set)
          this.successMessage = 'Login successful!';
          setTimeout(() => this.router.navigate(['/home'], { replaceUrl: true }), 500);
        }
        return;
      }

      // Step 3: signUp also failed → user exists but wrong password
      const errMsg = (error?.message || '').toLowerCase();
      if (errMsg.includes('email not confirmed')) {
        this.errorMessage = 'Please confirm your email. Check your inbox.';
      } else if ((signUpError?.message || '').toLowerCase().includes('already registered')) {
        this.errorMessage = 'Incorrect password. Use Forgot Password to reset.';
      } else {
        this.errorMessage = 'Invalid email or password.';
      }
      this.isLoading = false;

    } catch (err: any) {
      this.errorMessage = 'Login failed. Please try again.';
      this.isLoading = false;
    }
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.name = '';
  }

  onClose(): void {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  showForgotPasswordPopup(): void {
    this.showForgotPopup = true;
    this.forgotEmail = '';
  }

  closeForgotPopup(): void {
    this.showForgotPopup = false;
    this.forgotEmail = '';
  }

  async sendOTP(): Promise<void> {
    if (!this.forgotEmail.trim()) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    try {
      const { error } = await this.supabaseAuth.sendPasswordResetEmail(this.forgotEmail.trim());

      if (error) {
        this.errorMessage = error.message || 'Failed to send reset email.';
      } else {
        this.successMessage = 'Password reset link sent! Check your email.';
        setTimeout(() => this.closeForgotPopup(), 2500);
      }
    } catch {
      this.errorMessage = 'Failed to send reset email. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
