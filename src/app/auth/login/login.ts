import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseAuthService } from '../../services/supabase-auth.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private supabaseAuth: SupabaseAuthService,
    private authService: AuthService
  ) {}

  async onLogin() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;

    try {
      const { data, error } = await this.supabaseAuth.signIn(this.email, this.password);

      if (error) {
        console.log('Login error:', error.message);
        if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials')) {
          this.errorMessage = 'Account not found. Please register first.';
        } else {
          this.errorMessage = error.message;
        }
      } else if (data?.user) {
        this.authService.setCurrentUser(data.user.email!, data.user.email!.split('@')[0], 'user');
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      this.errorMessage = 'Login failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}
