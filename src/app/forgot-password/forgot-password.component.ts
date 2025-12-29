import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input 
        type="email" 
        [(ngModel)]="email" 
        placeholder="Enter your email"
        required>
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';

  constructor(private authService: AuthService) {}

  async onSubmit() {
    this.loading = true;
    const { error } = await this.authService.forgotPassword(this.email);
    
    if (error) {
      this.message = error.message;
    } else {
      this.message = 'Reset link sent to your email';
    }
    this.loading = false;
  }
}