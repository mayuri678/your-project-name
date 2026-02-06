import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private router: Router, private supabaseAuth: SupabaseAuthService) {}

  async onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    try {
      const { data, error } = await this.supabaseAuth.signUp(this.email, this.password);

      if (error) {
        console.log('Registration error:', error.message);
        if (error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('exist')) {
          this.errorMessage = 'This email is already registered. Please login instead.';
        } else {
          this.errorMessage = error.message;
        }
      } else {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      }
    } catch (error: any) {
      this.errorMessage = 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
