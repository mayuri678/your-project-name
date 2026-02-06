import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseOtpService } from '../services/supabase-otp.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="form-card">
        <h2>{{ otpVerified ? 'Set New Password' : 'Verify OTP' }}</h2>
        <p *ngIf="!otpVerified">Enter the OTP sent to {{ email }}</p>
        
        <div class="success" *ngIf="successMessage">{{ successMessage }}</div>
        <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
        
        <!-- OTP Verification Form -->
        <form (ngSubmit)="verifyOtp()" *ngIf="!otpVerified">
          <input
            type="text"
            [(ngModel)]="otp"
            name="otp"
            placeholder="Enter 6-digit OTP"
            maxlength="6"
            required
            class="input otp-input"
          />
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Verifying...' : 'Verify OTP' }}
          </button>
        </form>
        
        <!-- Password Reset Form -->
        <form (ngSubmit)="updatePassword()" *ngIf="otpVerified">
          <input
            type="password"
            [(ngModel)]="newPassword"
            name="newPassword"
            placeholder="New Password"
            required
            class="input"
          />
          <input
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            class="input"
          />
          <button type="submit" [disabled]="loading" class="btn-primary">
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
        
        <button (click)="goBack()" class="btn-secondary">Back</button>
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
    .otp-input {
      text-align: center;
      font-size: 18px;
      letter-spacing: 2px;
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
  `]
})
export class VerifyOtpComponent implements OnInit {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  otpVerified = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private supabaseOtpService: SupabaseOtpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  async verifyOtp() {
    if (!this.otp || this.otp.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const { error } = await this.supabaseOtpService.verifyOtp(this.email, this.otp);
    
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.otpVerified = true;
      this.successMessage = 'OTP verified! Now set your new password.';
    }
    
    this.loading = false;
  }

  async updatePassword() {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    const { error } = await this.supabaseOtpService.updatePassword(this.newPassword);
    
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.successMessage = 'Password updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
    
    this.loading = false;
  }

  goBack() {
    if (this.otpVerified) {
      this.otpVerified = false;
    } else {
      this.router.navigate(['/forgot-password-otp']);
    }
  }
}