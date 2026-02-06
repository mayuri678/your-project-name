import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SupabaseAuthService, UserProfile } from '../services/supabase-auth.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-supabase-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

        <div class="success-message" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <div class="profile-content" *ngIf="!loading">
          <div class="auth-info">
            <h3>Authentication Info</h3>
            <div class="profile-field">
              <label>User ID:</label>
              <span>{{ currentUser?.id }}</span>
            </div>
            <div class="profile-field">
              <label>Email:</label>
              <span>{{ currentUser?.email }}</span>
            </div>
            <div class="profile-field">
              <label>Email Verified:</label>
              <span>{{ currentUser?.email_confirmed_at ? 'Yes' : 'No' }}</span>
            </div>
          </div>

          <div class="profile-info">
            <h3>Profile Information</h3>
            <form (ngSubmit)="saveProfile()" #profileForm="ngForm">
              <div class="form-group">
                <label for="full_name">Full Name</label>
                <input 
                  type="text" 
                  id="full_name" 
                  name="full_name"
                  [(ngModel)]="profile.full_name" 
                  [readonly]="!isEditing"
                  class="form-control"
                  placeholder="Enter your full name"
                >
              </div>

              <div class="form-group">
                <label for="phone">Phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  [(ngModel)]="profile.phone" 
                  [readonly]="!isEditing"
                  class="form-control"
                  placeholder="Enter your phone number"
                >
              </div>

              <div class="form-group">
                <label for="address">Address</label>
                <textarea 
                  id="address" 
                  name="address"
                  [(ngModel)]="profile.address" 
                  [readonly]="!isEditing"
                  class="form-control"
                  placeholder="Enter your address"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label for="avatar_url">Avatar URL</label>
                <input 
                  type="url" 
                  id="avatar_url" 
                  name="avatar_url"
                  [(ngModel)]="profile.avatar_url" 
                  [readonly]="!isEditing"
                  class="form-control"
                  placeholder="Enter avatar URL"
                >
              </div>

              <div class="profile-actions">
                <button 
                  type="button" 
                  class="btn-secondary" 
                  (click)="toggleEdit()"
                  *ngIf="!isEditing"
                >
                  Edit Profile
                </button>
                
                <div *ngIf="isEditing">
                  <button 
                    type="submit" 
                    class="btn-primary"
                    [disabled]="saving"
                  >
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button 
                    type="button" 
                    class="btn-secondary" 
                    (click)="cancelEdit()"
                    [disabled]="saving"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div class="avatar-preview" *ngIf="profile.avatar_url">
            <h3>Avatar Preview</h3>
            <img [src]="profile.avatar_url" alt="Avatar" class="avatar">
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
      align-items: flex-start;
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
      max-width: 600px;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2, h3 {
      margin: 0 0 1rem 0;
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

    .success-message {
      color: #155724;
      padding: 1rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .auth-info, .profile-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .profile-field {
      display: flex;
      margin-bottom: 0.5rem;
    }

    .profile-field label {
      font-weight: 600;
      min-width: 120px;
      color: #495057;
    }

    .profile-field span {
      color: #212529;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
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

    .form-control[readonly] {
      background-color: #f8f9fa;
    }

    .profile-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }

    .btn-primary:disabled, .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .avatar-preview {
      margin-top: 1rem;
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ddd;
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
      margin-top: 1rem;
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
export class SupabaseProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  profile: UserProfile = {
    id: '',
    email: '',
    full_name: '',
    phone: '',
    address: '',
    avatar_url: ''
  };
  originalProfile: UserProfile = { ...this.profile };
  
  loading = false;
  saving = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  
  private subscription = new Subscription();

  constructor(
    private authService: SupabaseAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadProfile();
        } else {
          this.router.navigate(['/supabase-login']);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async loadProfile() {
    if (!this.currentUser) return;

    this.loading = true;
    this.errorMessage = '';

    try {
      const { data, error } = await this.authService.getUserProfile(this.currentUser.id);
      
      if (error) {
        this.errorMessage = error.message;
      } else if (data) {
        this.profile = { ...data };
        this.originalProfile = { ...data };
      } else {
        // Create initial profile if doesn't exist
        const newProfile: UserProfile = {
          id: this.currentUser.id,
          email: this.currentUser.email!,
          full_name: '',
          phone: '',
          address: '',
          avatar_url: ''
        };
        
        const { data: createdProfile, error: createError } = await this.authService.upsertUserProfile(newProfile);
        
        if (createError) {
          this.errorMessage = createError.message;
        } else {
          this.profile = { ...newProfile };
          this.originalProfile = { ...newProfile };
        }
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to load profile';
    } finally {
      this.loading = false;
    }
  }

  toggleEdit() {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.profile = { ...this.originalProfile };
    this.errorMessage = '';
    this.successMessage = '';
  }

  async saveProfile() {
    if (!this.currentUser) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.authService.updateUserProfile(this.currentUser.id, this.profile);
      
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.successMessage = 'Profile updated successfully!';
        this.originalProfile = { ...this.profile };
        this.isEditing = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to save profile';
    } finally {
      this.saving = false;
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/supabase-login']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to logout';
    }
  }
}