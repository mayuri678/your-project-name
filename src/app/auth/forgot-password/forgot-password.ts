import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  email = '';
  message = '';
  errorMessage = '';
  loading = false;

  constructor(private router: Router, private supabaseAuth: SupabaseAuthService) {}

  async onResetPassword() {
    this.errorMessage = '';
    this.message = '';

    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.loading = true;

    try {
      const { error } = await this.supabaseAuth.sendPasswordResetEmail(this.email);

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.message = 'Password reset link sent to your email';
      }
    } catch (error: any) {
      this.errorMessage = 'Failed to send reset email. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
