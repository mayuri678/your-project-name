import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-password-change',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-container">
      <div class="confirm-card">
        <div class="icon-container">
          <span class="icon" [ngClass]="{'success': isSuccess, 'error': isError, 'loading': isLoading}">
            {{ isLoading ? '⏳' : (isSuccess ? '✅' : '❌') }}
          </span>
        </div>
        
        <h2>{{ title }}</h2>
        <p class="message">{{ message }}</p>
        
        <div class="button-group" *ngIf="!isLoading">
          <button class="btn-primary" (click)="goToLogin()" *ngIf="isSuccess">
            Go to Login
          </button>
          <button class="btn-secondary" (click)="goHome()" *ngIf="!isSuccess">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .confirm-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .icon {
      font-size: 4rem;
      display: inline-block;
      padding: 20px;
      border-radius: 50%;
      margin-bottom: 20px;
    }

    .icon.success { background: #d4edda; color: #155724; }
    .icon.error { background: #f8d7da; color: #721c24; }
    .icon.loading { background: #e2e3e5; color: #495057; animation: pulse 1.5s infinite; }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    h2 { color: #333; margin-bottom: 15px; font-size: 24px; }
    .message { color: #666; line-height: 1.6; margin-bottom: 30px; font-size: 16px; }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 0 10px;
    }

    .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-primary:hover, .btn-secondary:hover { transform: translateY(-2px); }
  `]
})
export class ConfirmPasswordChangeComponent implements OnInit {
  title: string = 'Processing...';
  message: string = 'Please wait while we process your request.';
  isLoading: boolean = true;
  isSuccess: boolean = false;
  isError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.showError('Feature Disabled', 'Password change confirmation is no longer required. Password changes are now instant.');
  }

  private showSuccess(title: string, message: string): void {
    this.title = title;
    this.message = message;
    this.isLoading = false;
    this.isSuccess = true;
  }

  private showError(title: string, message: string): void {
    this.title = title;
    this.message = message;
    this.isLoading = false;
    this.isError = true;
  }

  goToLogin(): void { this.router.navigate(['/login']); }
  goHome(): void { this.router.navigate(['/home']); }
}