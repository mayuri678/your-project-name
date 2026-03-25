import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-debug',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 40px; max-width: 500px; margin: 50px auto; background: #f5f5f5; border-radius: 8px;">
      <h1>🧪 Login Debug Test</h1>
      
      <div style="margin: 20px 0; background: white; padding: 20px; border-radius: 4px;">
        <h3>Test Credentials:</h3>
        <ul>
          <li><strong>user1</strong> / <strong>user1</strong></li>
          <li><strong>admin</strong> / <strong>admin</strong></li>
          <li><strong>john@example.com</strong> / <strong>john123</strong></li>
        </ul>
      </div>

      <div style="margin: 20px 0;">
        <label>Email:</label>
        <input [(ngModel)]="email" type="text" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>

      <div style="margin: 20px 0;">
        <label>Password:</label>
        <input [(ngModel)]="password" type="password" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px;">
      </div>

      <button (click)="testLogin()" style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
        Test Login
      </button>

      <div *ngIf="result" style="margin: 20px 0; padding: 15px; background: #e8f5e9; border-radius: 4px; border-left: 4px solid #4caf50;">
        <strong>Result:</strong>
        <pre>{{ result }}</pre>
      </div>

      <div *ngIf="error" style="margin: 20px 0; padding: 15px; background: #ffebee; border-radius: 4px; border-left: 4px solid #f44336;">
        <strong>Error:</strong>
        <pre>{{ error }}</pre>
      </div>

      <div style="margin: 20px 0; padding: 15px; background: #fff3e0; border-radius: 4px;">
        <strong>Current Status:</strong>
        <p>Logged In: {{ authService.isLoggedIn() }}</p>
        <p>Current User: {{ (authService.getCurrentUser())?.email || 'None' }}</p>
      </div>

      <button (click)="goToLogin()" style="width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
        Go to Login Page
      </button>
    </div>
  `
})
export class LoginDebugComponent {
  email: string = 'user1';
  password: string = 'user1';
  result: string = '';
  error: string = '';

  constructor(public authService: AuthService, private router: Router) {}

  testLogin(): void {
    this.result = '';
    this.error = '';

    console.log('🔐 Testing login with:', this.email, this.password);

    try {
      const success = this.authService.login(this.email, this.password);
      
      if (success) {
        this.result = `✅ Login successful!\n\nUser: ${this.authService.getCurrentUser()?.email}\nRole: ${this.authService.getCurrentUserRole()}\n\nNavigating to /home in 2 seconds...`;
        
        setTimeout(() => {
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 2000);
      } else {
        this.error = '❌ Login failed - Invalid credentials';
      }
    } catch (err) {
      this.error = `❌ Error: ${err}`;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
