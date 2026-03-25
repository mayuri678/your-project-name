import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css']
})
export class ForgotPasswordModalComponent {
  @Output() close = new EventEmitter<void>();

  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  step: 'email' | 'success' = 'email';

  constructor(private supabaseAuth: SupabaseAuthService) {}

  async sendResetLink(): Promise<void> {
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { error } = await this.supabaseAuth.sendPasswordResetEmail(this.email);

      if (error) {
        this.errorMessage = error.message || 'Failed to send reset email';
      } else {
        this.successMessage = '✅ Password reset link sent to your email!';
        this.step = 'success';
        
        setTimeout(() => {
          this.closeModal();
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      this.errorMessage = 'Error sending reset email. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  resetForm(): void {
    this.email = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.step = 'email';
  }
}
