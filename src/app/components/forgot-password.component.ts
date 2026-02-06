import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="forgot-container">
      <div class="forgot-card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link</p>
        
        <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="email" 
              required 
              class="form-control"
              placeholder="Enter your email"
            >
          </div>

          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="loading || !forgotForm.valid"
          >
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="back-link">
          <button type="button" class="btn-link" (click)="goBack()">
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
      background-color: #f5f5f5;
    }

    .forgot-card {
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

    .btn-link {
      background: none;
      border: none;
      color: #007bff;
      cursor: pointer;
      text-decoration: underline;
      font-size: 0.9rem;
    }

    .btn-link:hover {
      color: #0056b3;
    }

    .back-link {
      margin-top: 1rem;
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
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: SupabaseAuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.authService.sendPasswordResetEmail(this.email);
      
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.successMessage = 'Password reset link sent to your email!';
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to send reset email. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/supabase-login']);
  }
}