import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordResetFlowService } from './password-reset-flow.service';

/**
 * Helper service for integrating forgot password functionality into existing login forms
 */
@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordHelperService {
  constructor(
    private passwordResetFlowService: PasswordResetFlowService,
    private router: Router
  ) {}

  /**
   * Add this method to your login component to handle "Forgot Password" clicks
   */
  handleForgotPasswordClick(): void {
    this.passwordResetFlowService.navigateToForgotPassword();
  }

  /**
   * Send password reset email directly from login form
   * Useful for inline forgot password functionality
   */
  async sendPasswordResetFromLogin(email: string): Promise<{success: boolean, message: string}> {
    if (!email || !email.trim()) {
      return {
        success: false,
        message: 'Please enter your email address first'
      };
    }

    return await this.passwordResetFlowService.sendPasswordResetEmail(email);
  }

  /**
   * Check if current route is a password reset route
   */
  isPasswordResetRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('forgot-password') || currentUrl.includes('reset-password');
  }

  /**
   * Get the appropriate forgot password URL for your app
   */
  getForgotPasswordUrl(): string {
    return '/supabase-forgot-password';
  }

  /**
   * Get the appropriate reset password URL for your app
   */
  getResetPasswordUrl(): string {
    return '/supabase-reset-password';
  }
}