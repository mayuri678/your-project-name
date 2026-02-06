import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private router: Router, private supabaseAuth: SupabaseAuthService) {}

  ngOnInit() {
    if (!this.supabaseAuth.isAuthenticated()) {
      this.errorMessage = 'Invalid or expired reset link';
    }
  }

  async onResetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    try {
      const { error } = await this.supabaseAuth.updatePassword(this.newPassword);

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.successMessage = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to reset password. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
