import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reset-container">
      <div class="reset-card">
        <h2>Reset Password</h2>
        <p>Enter your new password</p>
        
        <form (ngSubmit)="onSubmit()" #resetForm="ngForm" *ngIf="!isExpired">
          <div class="form-group">
            <label for="password">New Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="password" 
              required 
              minlength="6"
              class="form-control"
              placeholder="Enter new password"
            >
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              [(ngModel)]="confirmPassword" 
              required 
              class="form-control"
              placeholder="Confirm new password"
            >
          </div>

          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="loading || !resetForm.valid || password !== confirmPassword"
          >
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>

          <div class="error-message" *ngIf="password !== confirmPassword && confirmPassword">
            Passwords do not match
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="expired-message" *ngIf="isExpired">
          <p>This reset link has expired or is invalid.</p>
          <button class="btn-primary" (click)="goToForgotPassword()">
            Request New Link
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .reset-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    h2 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }

    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .success-message {
      color: #155724;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }

    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }

    .expired-message {
      text-align: center;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isExpired = false;

  constructor(
    private authService: SupabaseAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if user has valid session from reset link
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.isExpired = true;
      }
    });
  }

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.authService.updatePassword(this.password);
      
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.successMessage = 'Password updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/supabase-profile']);
        }, 2000);
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to update password. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/supabase-forgot-password']);
  }
}