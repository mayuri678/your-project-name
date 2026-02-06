import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-auth-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h2>Supabase Auth Demo</h2>
      
      <div class="auth-status">
        <h3>Current Status:</h3>
        <p><strong>Logged In:</strong> {{ isLoggedIn ? 'Yes' : 'No' }}</p>
        <p><strong>User Email:</strong> {{ currentUser?.email || 'None' }}</p>
        <p><strong>User ID:</strong> {{ currentUser?.id || 'None' }}</p>
      </div>

      <div class="actions">
        <button class="btn" (click)="goToLogin()" *ngIf="!isLoggedIn">
          Go to Login
        </button>
        <button class="btn" (click)="goToProfile()" *ngIf="isLoggedIn">
          Go to Profile
        </button>
        <button class="btn logout" (click)="logout()" *ngIf="isLoggedIn">
          Logout
        </button>
      </div>

      <div class="info">
        <h3>How it works:</h3>
        <ol>
          <li><strong>First time:</strong> Register with email/password</li>
          <li><strong>Account created:</strong> Stored permanently in Supabase</li>
          <li><strong>Future logins:</strong> Use same email/password</li>
          <li><strong>Session persists:</strong> Stay logged in across browser sessions</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .auth-status {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: #007bff;
      color: white;
    }

    .btn:hover {
      background: #0056b3;
    }

    .btn.logout {
      background: #dc3545;
    }

    .btn.logout:hover {
      background: #c82333;
    }

    .info {
      background: #e9ecef;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 2rem;
    }

    .info ol {
      margin: 0.5rem 0;
    }
  `]
})
export class AuthDemoComponent implements OnInit {
  currentUser: any = null;
  isLoggedIn = false;

  constructor(
    private authService: SupabaseAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      console.log('Auth demo - User state:', { user: user?.email, loggedIn: this.isLoggedIn });
    });
  }

  goToLogin() {
    this.router.navigate(['/supabase-login']);
  }

  goToProfile() {
    this.router.navigate(['/supabase-profile']);
  }

  async logout() {
    await this.authService.signOut();
    console.log('User logged out');
  }
}