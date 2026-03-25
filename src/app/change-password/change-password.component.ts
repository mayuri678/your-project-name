import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ChangePasswordService } from '../services/change-password.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private changePasswordService: ChangePasswordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    // Validation
    if (!this.form.currentPassword || !this.form.newPassword || !this.form.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match';
      return;
    }

    if (this.form.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    if (!/\d/.test(this.form.newPassword)) {
      this.errorMessage = 'Password must contain at least 1 number';
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.form.newPassword)) {
      this.errorMessage = 'Password must contain at least 1 special character';
      return;
    }

    this.isLoading = true;
    const token = localStorage.getItem('authToken') || '';

    this.changePasswordService.changePassword(
      this.form.currentPassword,
      this.form.newPassword,
      token
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || 'Password changed successfully!';
          this.form = { currentPassword: '', newPassword: '', confirmPassword: '' };
          setTimeout(() => {
            this.router.navigate(['/settings']);
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Failed to change password';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred while changing password';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/settings']);
  }

  onLogout(): void {
    this.router.navigate(['/home']);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onAbout(): void {
    this.router.navigate(['/about']);
  }

  onResume(): void {
    this.router.navigate(['/resume']);
  }

  onTemplates(): void {
    this.router.navigate(['/templates']);
  }
}
