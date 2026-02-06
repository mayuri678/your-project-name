import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-flow-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <div class="demo-card">
        <h2>Supabase Password Reset Flow Demo</h2>
        <p>This demo showcases the complete forgot password flow with email OTP verification using Supabase.</p>
        
        <div class="flow-steps">
          <h3>Flow Steps:</h3>
          <ol>
            <li><strong>Forgot Password:</strong> User enters email and receives OTP via email</li>
            <li><strong>OTP Verification:</strong> User enters 6-digit OTP from email</li>
            <li><strong>Reset Password:</strong> User creates new password (only after OTP verification)</li>
          </ol>
        </div>
        
        <div class="demo-buttons">
          <button class="demo-btn primary" (click)="startFlow()">
            Start Password Reset Flow
          </button>
          
          <button class="demo-btn secondary" (click)="goToLogin()">
            Go to Login
          </button>
        </div>
        
        <div class="security-note">
          <h4>Security Features:</h4>
          <ul>
            <li>✅ Email OTP verification required</li>
            <li>✅ Reset password screen protected by guard</li>
            <li>✅ No magic link flow - OTP only</li>
            <li>✅ OTP verification status tracked</li>
            <li>✅ Automatic redirect after successful reset</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .demo-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    h2 {
      color: #333;
      margin-bottom: 15px;
      text-align: center;
    }

    p {
      color: #666;
      margin-bottom: 25px;
      text-align: center;
      line-height: 1.6;
    }

    .flow-steps {
      margin-bottom: 30px;
    }

    .flow-steps h3 {
      color: #333;
      margin-bottom: 15px;
    }

    .flow-steps ol {
      color: #555;
      line-height: 1.8;
    }

    .flow-steps li {
      margin-bottom: 8px;
    }

    .demo-buttons {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      justify-content: center;
    }

    .demo-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .demo-btn.primary {
      background: #4CAF50;
      color: white;
    }

    .demo-btn.primary:hover {
      background: #45a049;
      transform: translateY(-1px);
    }

    .demo-btn.secondary {
      background: #f5f5f5;
      color: #666;
      border: 1px solid #ddd;
    }

    .demo-btn.secondary:hover {
      background: #e9e9e9;
    }

    .security-note {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid #4CAF50;
    }

    .security-note h4 {
      color: #333;
      margin-bottom: 15px;
    }

    .security-note ul {
      color: #555;
      line-height: 1.6;
    }

    .security-note li {
      margin-bottom: 5px;
    }

    @media (max-width: 768px) {
      .demo-buttons {
        flex-direction: column;
      }
      
      .demo-btn {
        width: 100%;
      }
    }
  `]
})
export class PasswordResetFlowDemoComponent {
  constructor(private router: Router) {}

  startFlow(): void {
    this.router.navigate(['/supabase-forgot-password']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}