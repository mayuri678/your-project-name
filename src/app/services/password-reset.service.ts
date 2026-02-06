import { Injectable } from '@angular/core';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private otpVerificationStatus = new Map<string, boolean>();

  constructor(private supabaseAuth: SupabaseAuthService) {}

  async sendPasswordResetOtp(email: string): Promise<{success: boolean, message: string}> {
    try {
      const { data, error } = await this.supabaseAuth.supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to send OTP'
        };
      }

      return {
        success: true,
        message: 'OTP sent to your email! Check your inbox.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async verifyOtp(email: string, token: string, type: 'email'): Promise<{success: boolean, message: string}> {
    try {
      const { data, error } = await this.supabaseAuth.supabase.auth.verifyOtp({
        email,
        token,
        type
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Invalid or expired OTP'
        };
      }

      // Mark OTP as verified for this email
      this.otpVerificationStatus.set(email, true);

      return {
        success: true,
        message: 'OTP verified successfully!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred during OTP verification.'
      };
    }
  }

  async updatePassword(newPassword: string): Promise<{success: boolean, message: string}> {
    try {
      const { data, error } = await this.supabaseAuth.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to update password'
        };
      }

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred while updating password.'
      };
    }
  }

  isOtpVerified(email: string): boolean {
    return this.otpVerificationStatus.get(email) || false;
  }

  clearOtpVerification(email: string): void {
    this.otpVerificationStatus.delete(email);
  }
}