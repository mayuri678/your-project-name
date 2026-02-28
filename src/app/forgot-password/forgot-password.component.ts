import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private supabaseAuth: SupabaseAuthService,
    private router: Router
  ) {}

  async sendOtp(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      // Send reset email via Supabase
      const { error } = await this.supabaseAuth.sendPasswordResetEmail(this.email);
      
      if (error) {
        this.errorMessage = error.message || 'Failed to send reset email';
      } else {
        // Log request in database
        await this.logResetRequest();
        
        this.successMessage = '✅ Password reset link sent to your email! Check your inbox.';
        console.log('📧 Reset email sent to:', this.email);
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Error sending reset email';
    } finally {
      this.isLoading = false;
    }
  }

  async logResetRequest(): Promise<void> {
    try {
      const userName = this.email.split('@')[0];
      
      const { data, error } = await this.supabaseAuth.supabase
        .from('password_reset_requests')
        .insert({
          email: this.email,
          user_name: userName,
          requested_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client',
          used: false
        })
        .select();
      
      if (error) {
        console.error('❌ Failed to log:', error);
      } else {
        console.log('✅ Reset request saved:', data);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}