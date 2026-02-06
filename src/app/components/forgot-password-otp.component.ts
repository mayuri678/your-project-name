import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseOtpService } from '../services/supabase-otp.service';

@Component({
  selector: 'app-forgot-password-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="form-card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive OTP</p>
        
        <div class="success" *ngIf="successMessage">{{ successMessage }}</div>
        <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
        
        <form (ngSubmit)="sendOtp()" *ngIf="!otpSent">
          <input
            type="email"
            [(ngModel)]="email"
            name="email"
            placeholder="Enter your email"
            required
            class="input"
          />
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Sending...' : 'Send OTP' }}
          </button>
        </form>
        
        <div *ngIf="otpSent" class="otp-sent">
          <p>OTP sent to {{ email }}</p>
          <button (click)="goToVerification()" class="btn-primary">
            Enter OTP
          </button>
        </div>
        
        <button (click)="goBack()" class="btn-secondary">Back to Login</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .input {
      width: 100%;
      padding: 12px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .btn-primary {
      width: 100%;
      padding: 12px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
    }
    .btn-primary:disabled {
      background: #ccc;
    }
    .btn-secondary {
      width: 100%;
      padding: 12px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
    }
    .success {
      background: #d4edda;
      color: #155724;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
    }
    .otp-sent {
      text-align: center;
      margin: 20px 0;
    }
  `]
})
export class ForgotPasswordOtpComponent {
  email = '';
  loading = false;
  otpSent = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private supabaseOtpService: SupabaseOtpService,
    private router: Router
  ) {}

  async sendOtp() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const { error } = await this.supabaseOtpService.sendPasswordResetOtp(this.email);
    
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.otpSent = true;
      this.successMessage = 'OTP sent to your email';
    }
    
    this.loading = false;
  }

  goToVerification() {
    this.router.navigate(['/verify-otp'], { queryParams: { email: this.email } });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}