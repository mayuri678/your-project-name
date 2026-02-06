import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-supabase-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="otp-container">
      <div class="background-overlay"></div>
      
      <div class="form-container">
        <div class="logo-container">
          <img src="assets/images/logo.png" alt="Logo" class="logo" />
        </div>
        
        <h2>Verify OTP</h2>
        <p class="subtitle">Enter the 6-digit OTP sent to {{ email }}</p>
        
        <!-- Success Message -->
        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <!-- Error Message -->
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="verifyOtp()" #otpForm="ngForm">
          
          <!-- OTP Input -->
          <div class="form-group">
            <label for="otp">Enter 6-digit OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              [(ngModel)]="otp"
              maxlength="6"
              required
              class="form-input otp-input"
              placeholder="000000"
              (input)="onOtpInput($event)"
              [disabled]="isLoading"
            />
          </div>
          
          <!-- Verify Button -->
          <button
            type="submit"
            class="action-btn primary"
            [disabled]="isLoading || otp.length !== 6"
          >
            {{ isLoading ? 'Verifying...' : 'Verify OTP' }}
          </button>
          
          <!-- Resend OTP -->
          <button
            type="button"
            class="action-btn secondary"
            (click)="resendOtp()"
            [disabled]="isLoading || resendCooldown > 0"
          >
            {{ resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 'Resend OTP' }}
          </button>
          
        </form>
        
        <!-- Back to Forgot Password -->
        <div class="back-link">
          <button type="button" class="link-btn" (click)="goBack()">
            ← Back to Forgot Password
          </button>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .otp-container {
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

    .otp-input {
      width: 100%;
      padding: 16px;
      border: 2px solid #ddd;
      border-radius: 12px;
      font-size: 24px;
      text-align: center;
      letter-spacing: 8px;
      font-weight: bold;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    .otp-input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
    }

    .otp-input:disabled {
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
      margin-bottom: 12px;
    }

    .action-btn.primary {
      background: #4CAF50;
      color: white;
    }

    .action-btn.primary:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-1px);
    }

    .action-btn.secondary {
      background: #f5f5f5;
      color: #666;
      border: 1px solid #ddd;
    }

    .action-btn.secondary:hover:not(:disabled) {
      background: #e9e9e9;
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
export class SupabaseOtpVerificationComponent implements OnInit {
  email: string = '';
  otp: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  resendCooldown: number = 0;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      
      if (!this.email) {
        this.router.navigate(['/supabase-forgot-password']);
      }
    });
  }

  onOtpInput(event: any): void {
    // Only allow numbers
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.otp = value;
    event.target.value = value;
  }

  async verifyOtp(): Promise<void> {
    if (this.otp.length !== 6) {
      this.errorMessage = 'Please enter a 6-digit OTP';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.passwordResetService.verifyOtp(this.email, this.otp, 'email');
      
      if (result.success) {
        this.successMessage = result.message + ' Redirecting to reset password...';
        
        setTimeout(() => {
          this.router.navigate(['/supabase-reset-password'], {
            queryParams: { email: this.email, verified: 'true' }
          });
        }, 1500);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred during verification.';
    } finally {
      this.isLoading = false;
    }
  }

  async resendOtp(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const result = await this.passwordResetService.sendPasswordResetOtp(this.email);
      
      if (result.success) {
        this.successMessage = 'New OTP sent to your email!';
        
        // Start cooldown
        this.resendCooldown = 60;
        const interval = setInterval(() => {
          this.resendCooldown--;
          if (this.resendCooldown <= 0) {
            clearInterval(interval);
          }
        }, 1000);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'Error sending OTP. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/supabase-forgot-password']);
  }
}