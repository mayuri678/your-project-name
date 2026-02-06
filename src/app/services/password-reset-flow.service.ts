import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseAuthService } from './supabase-auth.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetFlowService {
  constructor(
    private supabaseAuthService: SupabaseAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Send password reset email using Supabase Auth
   */
  async sendPasswordResetEmail(email: string): Promise<{success: boolean, message: string}> {
    try {
      console.log('📧 Initiating password reset for:', email);
      
      const { data, error } = await this.supabaseAuthService.sendPasswordResetEmail(email);
      
      if (error) {
        console.error('❌ Password reset email failed:', error);
        return {
          success: false,
          message: error.message || 'Failed to send reset email'
        };
      }
      
      console.log('✅ Password reset email sent successfully');
      return {
        success: true,
        message: 'Password reset email sent! Check your inbox and click the link to reset your password.'
      };
      
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Reset password using Supabase Auth
   */
  async resetPassword(newPassword: string): Promise<{success: boolean, message: string}> {
    try {
      console.log('🔄 Resetting password via Supabase');
      
      const { data, error } = await this.supabaseAuthService.updatePasswordWithSupabase(newPassword);
      
      if (error) {
        console.error('❌ Password reset failed:', error);
        return {
          success: false,
          message: error.message || 'Failed to reset password'
        };
      }
      
      console.log('✅ Password reset successful');
      
      // Get current user and update local auth state
      const currentUser = this.supabaseAuthService.getCurrentUser();
      if (currentUser?.email) {
        const userName = currentUser.email.split('@')[0];
        this.authService.addLoggedInUser(currentUser.email, userName);
        this.authService.setCurrentUser(currentUser.email, userName, 'user');
      }
      
      return {
        success: true,
        message: 'Password reset successfully! You are now logged in.'
      };
      
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  /**
   * Check if user has valid reset session
   */
  async hasValidResetSession(): Promise<boolean> {
    try {
      const { data } = await this.supabaseAuthService.getSessionFromUrl();
      return !!data.session;
    } catch (error) {
      console.error('Error checking reset session:', error);
      return false;
    }
  }

  /**
   * Navigate to forgot password page
   */
  navigateToForgotPassword(): void {
    this.router.navigate(['/supabase-forgot-password']);
  }

  /**
   * Navigate to reset password page
   */
  navigateToResetPassword(): void {
    this.router.navigate(['/supabase-reset-password']);
  }

  /**
   * Navigate to login page
   */
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}