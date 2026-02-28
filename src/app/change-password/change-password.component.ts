import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { SupabaseService } from '../services/supabase.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { PasswordHistoryService } from '../services/password-history.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isPasswordReset: boolean = false;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private passwordHistory: PasswordHistoryService
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment && (fragment.includes('access_token') || fragment.includes('type=recovery'))) {
        this.isPasswordReset = true;
        this.handlePasswordResetFromEmail();
      }
    });
  }

  private async handlePasswordResetFromEmail(): Promise<void> {
    try {
      const { data, error } = await this.supabaseAuth.supabase.auth.getSession();
      if (error) {
        this.errorMessage = 'Invalid or expired reset link';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      } else if (data.session) {
        this.message = 'Please enter your new password below.';
      }
    } catch (error) {
      this.errorMessage = 'Error processing reset link';
    }
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.message = '';

    if (this.isPasswordReset) {
      return this.handlePasswordReset();
    }

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters long';
      return;
    }

    if (this.currentPassword === this.newPassword) {
      this.errorMessage = 'New password must be different from current password';
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.authService.changePassword(this.currentPassword, this.newPassword);
      if (result.success) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.email) {
          await this.supabaseService.logPasswordChangeActivity(currentUser.email, 'change');
          this.passwordHistory.logPasswordChange({
            userId: '',
            userEmail: currentUser.email,
            userName: currentUser.name || currentUser.email,
            changeType: 'change',
            changedBy: currentUser.email
          });
        }
        
        this.message = 'Password changed successfully! You will be redirected to login.';
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.errorMessage = result.message || 'Failed to change password';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private async handlePasswordReset(): Promise<void> {
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

    try {
      const { error } = await this.supabaseAuth.supabase.auth.updateUser({
        password: this.newPassword
      });

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.message = 'Password updated successfully! Redirecting to login...';
        setTimeout(() => {
          this.supabaseAuth.supabase.auth.signOut();
          this.router.navigate(['/login']);
        }, 2000);
      }
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility(field: string): void {
    switch(field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}