import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JwtAuthService, UserProfile } from '../services/jwt-auth.service';

@Component({
  selector: 'app-jwt-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <h2>User Profile</h2>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>

        <div class="loading" *ngIf="loading">
          Loading profile...
        </div>

        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="profile-content" *ngIf="profile && !loading">
          <div class="profile-field">
            <label>ID:</label>
            <span>{{ profile.id }}</span>
          </div>

          <div class="profile-field">
            <label>Name:</label>
            <span>{{ profile.name }}</span>
          </div>

          <div class="profile-field">
            <label>Email:</label>
            <span>{{ profile.email }}</span>
          </div>

          <div class="profile-field" *ngIf="profile.phone">
            <label>Phone:</label>
            <span>{{ profile.phone }}</span>
          </div>

          <div class="profile-field" *ngIf="profile.address">
            <label>Address:</label>
            <span>{{ profile.address }}</span>
          </div>

          <div class="profile-field" *ngIf="profile.avatar">
            <label>Avatar:</label>
            <img [src]="profile.avatar" alt="Avatar" class="avatar">
          </div>
        </div>

        <button class="refresh-btn" (click)="loadProfile()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Refresh Profile' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 1rem;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 500px;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background-color: #c82333;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .error-message {
      color: #dc3545;
      padding: 1rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .profile-content {
      margin-bottom: 2rem;
    }

    .profile-field {
      display: flex;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .profile-field label {
      font-weight: 600;
      min-width: 80px;
      color: #495057;
    }

    .profile-field span {
      color: #212529;
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .refresh-btn {
      width: 100%;
      padding: 0.75rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    .refresh-btn:hover:not(:disabled) {
      background-color: #218838;
    }

    .refresh-btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
  `]
})
export class JwtProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: JwtAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        console.log('Profile loaded:', profile);
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
        this.errorMessage = error.error?.message || 'Failed to load profile. Please try again.';
        
        // If unauthorized, redirect to login
        if (error.status === 401) {
          this.logout();
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/jwt-login']);
  }
}