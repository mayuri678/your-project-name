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
      <div class="background-overlay"></div>
      
      <div class="form-container">
        <div class="logo-container">
          <img src="assets/images/logo.png" alt="Logo" class="logo" />
        </div>
        
        <h2>Reset Password</h2>
        <p class="subtitle">Create a new password for {{ email }}</p>
        
        <!-- Success Message -->
        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <!-- Error Message -->
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="resetPassword()" #resetForm="ngForm">
          
          <!-- New Password -->
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              [(ngModel)]="newPassword"
              required
              minlength="6"
              class="form-input"
              placeholder="Enter new password"
            />
          </div>
          
          <!-- Confirm Password -->
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="confirmPassword"
              required
              class="form-input"
              placeholder="Confirm new password"
            />
          </div>
          
          <!-- Password Requirements -->
          <div class="password-requirements">
            <small>
              • Password must be at least 6 characters<br>
              • Both passwords must match
            </small>
          </div>
          
          <!-- Reset Button -->
          <button
            type="submit"
            class="action-btn primary"
            [disabled]="isLoading || !isFormValid()"
          >
            {{ isLoading ? 'Updating Password...' : 'Reset Password' }}
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
    .reset-container {
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

    .password-requirements {
      margin-bottom: 20px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: left;
    }

    .password-requirements small {
      color: #666;
      line-height: 1.4;
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
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Handle both hash and query params from Supabase
    this.handleSupabaseCallback();
  }

  async handleSupabaseCallback(): Promise<void> {
    try {
      // Supabase sends token in URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        console.log('✅ Valid reset token found');
        const { data } = await this.supabaseAuth.getSessionFromUrl();
        if (data.session) {
          this.email = data.session.user.email || '';
          console.log('📧 Email:', this.email);
        }
      } else {
        this.errorMessage = 'Invalid or expired reset link';
        setTimeout(() => this.router.navigate(['/forgot-password']), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Error loading reset page';
    }
  }

  isFormValid(): boolean {
    return this.newPassword.length >= 6 && 
           this.newPassword === this.confirmPassword;
  }

  async resetPassword(): Promise<void> {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please check password requirements';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const { error } = await this.supabaseAuth.updatePasswordWithSupabase(this.newPassword);
      
      if (error) {
        this.errorMessage = error.message || 'Failed to reset password';
      } else {
        // Log password reset in database
        await this.logPasswordReset();
        
        this.successMessage = '✅ Password reset successfully! Redirecting to login...';
        console.log('✅ Password updated in Supabase for:', this.email);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Error updating password';
    } finally {
      this.isLoading = false;
    }
  }

  async logPasswordReset(): Promise<void> {
    try {
      const userName = this.email.split('@')[0];
      
      const { data, error } = await this.supabaseAuth.supabase
        .from('password_reset_requests')
        .insert({
          email: this.email,
          user_name: userName,
          requested_at: new Date().toISOString(),
          reset_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client',
          used: true
        })
        .select();
      
      if (error) {
        console.error('❌ Failed to log reset:', error);
      } else {
        console.log('✅ Password reset logged:', data);
      }
    } catch (error) {
      console.error('❌ Error logging reset:', error);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}