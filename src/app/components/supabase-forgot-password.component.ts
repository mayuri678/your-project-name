import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-supabase-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="forgot-container">
      <div class="background-overlay"></div>
      
      <div class="form-container">
        <div class="logo-container">
          <img src="assets/images/logo.png" alt="Logo" class="logo" />
        </div>
        
        <h2>Forgot Password</h2>
        <p class="subtitle">Enter your email to receive an OTP</p>
        
        <!-- Success Message -->
        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <!-- Error Message -->
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="sendOtp()" #forgotForm="ngForm">
          
          <!-- Email Input -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              class="form-input"
              placeholder="Enter your email address"
              [disabled]="isLoading"
            />
          </div>
          
          <!-- Send OTP Button -->
          <button
            type="submit"
            class="action-btn primary"
            [disabled]="isLoading || !email || forgotForm.invalid"
          >
            {{ isLoading ? 'Sending OTP...' : 'Send OTP' }}
          </button>
          
        </form>
        
        <!-- Back to Login -->
        <div class="back-link">
          <button type="button" class="link-btn" (click)="goToLogin()">
            ← Back to Login
          </button>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .background-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
    }

    .form-container {
      position: relative;
      z-index: 10;
      background: white;
      border-radius: 24px;
      padding: 30px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    .logo {
      height: 80px;
      width: auto;
      margin-bottom: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 12px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    .form-input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .action-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 20px;
    }

    .action-btn.primary {
      background: #4CAF50;
      color: white;
    }

    .action-btn.primary:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-1px);
    }

    .action-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #c3e6cb;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
    }

    .back-link {
      margin-top: 20px;
    }

    .link-btn {
      background: none;
      border: none;
      color: #4CAF50;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }

    .link-btn:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .form-container {
        margin: 20px;
        padding: 20px;
      }
    }
  `]
})
export class SupabaseForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  async sendOtp(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.passwordResetService.sendPasswordResetOtp(this.email);
      
      if (result.success) {
        this.successMessage = result.message;
        // Navigate to OTP verification after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/supabase-otp-verification'], {
            queryParams: { email: this.email }
          });
        }, 2000);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}