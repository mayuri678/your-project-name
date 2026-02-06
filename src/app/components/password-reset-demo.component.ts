import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordResetFlowService } from '../services/password-reset-flow.service';

@Component({
  selector: 'app-password-reset-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="demo-card">
        <h2>Password Reset Flow Demo</h2>
        <p>This demonstrates how to integrate Supabase Auth password reset into your login form.</p>
        
        <!-- Login Form with Forgot Password Link -->
        <div class="login-section">
          <h3>Login Form Integration</h3>
          <form class="demo-form">
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-input" placeholder="Enter your email" />
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-input" placeholder="Enter your password" />
            </div>
            <button type="button" class="btn primary">Login</button>
            <button 
              type="button" 
              class="btn link" 
              (click)="goToForgotPassword()"
            >
              Forgot Password?
            </button>
          </form>
        </div>

        <!-- Quick Reset Section -->
        <div class="reset-section">
          <h3>Quick Password Reset</h3>
          <p>Enter your email to receive a password reset link:</p>
          
          <div class="success-message" *ngIf="successMessage">{{ successMessage }}</div>
          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>
          
          <form (ngSubmit)="sendQuickReset()" class="demo-form">
            <div class="form-group">
              <input
                type="email"
                [(ngModel)]="resetEmail"
                name="resetEmail"
                class="form-input"
                placeholder="Enter your email address"
                [disabled]="isLoading"
                required
              />
            </div>
            <button 
              type="submit" 
              class="btn primary"
              [disabled]="isLoading || !resetEmail.trim()"
            >
              {{ isLoading ? 'Sending...' : 'Send Reset Email' }}
            </button>
          </form>
        </div>

        <!-- Flow Information -->
        <div class="info-section">
          <h3>How It Works</h3>
          <div class="flow-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>User Requests Reset</h4>
                <p>User enters email and clicks "Forgot Password"</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Supabase Sends Email</h4>
                <p>Supabase Auth sends secure reset link to user's email</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>User Clicks Link</h4>
                <p>User clicks link and is redirected to reset password page</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>Password Updated</h4>
                <p>User sets new password and is automatically logged in</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="navigation">
          <button type="button" class="btn secondary" (click)="goToForgotPassword()">
            Go to Forgot Password Page
          </button>
          <button type="button" class="btn secondary" (click)="goToLogin()">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .demo-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin-bottom: 16px;
      font-size: 28px;
    }

    h3 {
      color: #444;
      margin: 32px 0 16px 0;
      font-size: 20px;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 8px;
    }

    .login-section, .reset-section, .info-section {
      margin-bottom: 32px;
    }

    .demo-form {
      max-width: 400px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #555;
      font-weight: 500;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      margin-right: 12px;
      margin-bottom: 8px;
    }

    .btn.primary {
      background: #4CAF50;
      color: white;
    }

    .btn.primary:hover:not(:disabled) {
      background: #45a049;
    }

    .btn.secondary {
      background: #6c757d;
      color: white;
    }

    .btn.secondary:hover {
      background: #5a6268;
    }

    .btn.link {
      background: none;
      color: #4CAF50;
      text-decoration: underline;
      padding: 8px 0;
    }

    .btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #c3e6cb;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #f5c6cb;
    }

    .flow-steps {
      display: grid;
      gap: 20px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .step-number {
      background: #4CAF50;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-content h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 16px;
    }

    .step-content p {
      margin: 0;
      color: #666;
      line-height: 1.4;
    }

    .navigation {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }
  `]
})
export class PasswordResetDemoComponent {
  resetEmail: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private passwordResetFlowService: PasswordResetFlowService,
    private router: Router
  ) {}

  async sendQuickReset(): Promise<void> {
    if (!this.resetEmail.trim()) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.passwordResetFlowService.sendPasswordResetEmail(this.resetEmail);
      
      if (result.success) {
        this.successMessage = result.message;
        this.resetEmail = '';
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goToForgotPassword(): void {
    this.passwordResetFlowService.navigateToForgotPassword();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}