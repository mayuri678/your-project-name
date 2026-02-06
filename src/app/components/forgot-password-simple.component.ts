import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-forgot-password-simple',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="forgot-container">
      <div class="form-container">
        <h2>Reset Password</h2>
        <p>Enter your email to receive OTP</p>
        
        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="sendResetEmail()" *ngIf="!emailSent">
          <div class="form-group">
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="Enter your email"
              required
              class="form-input"
            />
          </div>
          
          <div class="button-group">
            <button type="submit" class="btn-primary" [disabled]="isLoading">
              {{ isLoading ? 'Sending...' : 'Send OTP' }}
            </button>
            <button type="button" class="btn-secondary" (click)="cancel()">
              Cancel
            </button>
          </div>
        </form>
        
        <div *ngIf="emailSent" class="email-sent">
          <p>Check your email and click the reset link to continue.</p>
          <button type="button" class="btn-secondary" (click)="goBack()">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    p {
      text-align: center;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    
    .button-group {
      display: flex;
      gap: 0.5rem;
    }
    
    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background: #6366f1;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #5856eb;
    }
    
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    
    .btn-secondary:hover {
      background: #e5e7eb;
    }
    
    .success-message {
      background: #d1fae5;
      color: #065f46;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .email-sent {
      text-align: center;
    }
    
    .email-sent p {
      margin-bottom: 1.5rem;
      color: #059669;
    }
  `]
})
export class ForgotPasswordSimpleComponent {
  email: string = '';
  isLoading: boolean = false;
  emailSent: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private supabaseAuth: SupabaseAuthService,
    private router: Router
  ) {}

  async sendResetEmail(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { error } = await this.supabaseAuth.supabase.auth.resetPasswordForEmail(this.email, {
        redirectTo: `${window.location.origin}/change-password`
      });

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.emailSent = true;
        this.successMessage = 'Password reset email sent! Check your inbox.';
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}