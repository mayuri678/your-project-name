import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input 
        type="password" 
        [(ngModel)]="newPassword" 
        placeholder="New password"
        required>
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Updating...' : 'Update Password' }}
      </button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class ResetPasswordComponent {
  newPassword = '';
  loading = false;
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.loading = true;
    const { error } = await this.authService.resetPassword(this.newPassword);
    
    if (error) {
      this.message = error.message;
    } else {
      this.message = 'Password updated successfully';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    }
    this.loading = false;
  }
}