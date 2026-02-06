import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-change-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="change-password-container">
      <div class="change-password-card">
        <h2>🔐 Reset Password</h2>
        <p>Enter your new password</p>
        
        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>
        
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        
        <form (ngSubmit)="updatePassword()" *ngIf="!passwordUpdated">
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              [(ngModel)]="newPassword"
              name="newPassword"
              required
              minlength="6"
              placeholder="Enter new password"
              class="form-input"
              [disabled]="isLoading"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Confirm new password"
              class="form-input"
              [disabled]="isLoading"
            />
          </div>
          
          <div class="password-match" *ngIf="newPassword && confirmPassword">
            <span [class]="newPassword === confirmPassword ? 'match' : 'no-match'">
              {{ newPassword === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match' }}
            </span>
          </div>
          
          <button
            type="submit"
            class="btn-primary"
            [disabled]="isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword"
          >
            {{ isLoading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
        
        <div *ngIf="passwordUpdated" class="success-container">
          <p>Password updated successfully!</p>
          <button type="button" class="btn-primary" (click)="goToLogin()">
            Go to Login
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .change-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    .change-password-card {
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
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    
    .form-input:disabled {
      background: #f5f5f5;
    }
    
    .password-match {
      margin-bottom: 1rem;
      text-align: center;
    }
    
    .match {
      color: #059669;
    }
    
    .no-match {
      color: #dc2626;
    }
    
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #5856eb;
    }
    
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
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
    
    .success-container {
      text-align: center;
    }
    
    .success-container p {
      color: #059669;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }
  `]
})
export class ChangePasswordResetComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  passwordUpdated: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Handle the magic link authentication
    this.route.fragment.subscribe(fragment => {
      if (fragment && (fragment.includes('access_token') || fragment.includes('type=recovery'))) {
        this.handleMagicLink();
      } else {
        // If no magic link parameters, redirect to forgot password
        this.router.navigate(['/forgot-password-magic']);
      }
    });
  }

  private async handleMagicLink(): Promise<void> {
    try {
      const { data, error } = await this.supabaseAuth.supabase.auth.getSession();
      if (error || !data.session) {
        this.errorMessage = 'Invalid or expired reset link';
        setTimeout(() => this.router.navigate(['/forgot-password-magic']), 3000);
      } else {
        this.successMessage = 'Please enter your new password below.';
      }
    } catch (error) {
      this.errorMessage = 'Error processing reset link';
    }
  }

  async updatePassword(): Promise<void> {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in both password fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { error } = await this.supabaseAuth.supabase.auth.updateUser({
        password: this.newPassword
      });

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.passwordUpdated = true;
        this.successMessage = 'Password updated successfully!';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin(): void {
    // Sign out and redirect to login
    this.supabaseAuth.supabase.auth.signOut();
    this.router.navigate(['/login']);
  }
}