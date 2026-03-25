import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
    private router: Router
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
    const nameTrimmed = this.name.trim() || (emailTrimmed.includes('@') ? emailTrimmed.split('@')[0] : emailTrimmed);

    try {
      const success = await this.authService.register(emailTrimmed, passwordTrimmed, nameTrimmed, 'user');
      
      if (!success) {
        this.errorMessage = 'Email already registered';
        this.isLoading = false;
        return;
      }

      this.successMessage = 'Account created successfully! Logging you in...';
      
      setTimeout(() => {
        this.authService.setCurrentUser(emailTrimmed, nameTrimmed, 'user');
        this.authService.addLoggedInUser(emailTrimmed, nameTrimmed);
        this.router.navigate(['/home'], { replaceUrl: true });
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      this.errorMessage = 'Registration failed. Please try again.';
      this.isLoading = false;
    }
  }

  async onLogin(): Promise<void> {
    console.log('🔐 Login button clicked');
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

    console.log('Attempting login with:', emailTrimmed);

    // Admin login
    if (emailTrimmed === 'admin' && passwordTrimmed === 'admin') {
      console.log('Admin login');
      this.authService.setCurrentUser('admin@example.com', 'Admin User', 'admin');
      this.successMessage = 'Admin login successful!';
      setTimeout(() => this.router.navigate(['/admin/dashboard'], { replaceUrl: true }), 500);
      return;
    }

    // Local auth login
    const loginSuccess = this.authService.login(emailTrimmed, passwordTrimmed);
    console.log('Login result:', loginSuccess);

    if (!loginSuccess) {
      this.errorMessage = 'Invalid email or password';
      this.isLoading = false;
      return;
    }

    this.successMessage = 'Login successful!';
    console.log('Login successful, navigating to home');
    
    setTimeout(() => {
      this.router.navigate(['/home'], { replaceUrl: true });
    }, 500);
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
    this.isLoading = true;
    
    try {
      console.log('Sending OTP to:', this.forgotEmail);
      this.router.navigate(['/forgot-password']);
    } catch (error) {
      console.error('Navigation error:', error);
      this.errorMessage = 'Navigation failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
