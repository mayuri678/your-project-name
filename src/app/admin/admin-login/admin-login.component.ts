import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {
    // Check if already logged in
    if (this.adminService.isAdminLoggedIn()) {
      console.log('Admin already logged in, redirecting to dashboard');
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'कृपया email और password दोनों दर्ज करें';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Attempting admin login with:', this.email);

    this.adminService.adminLogin(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          console.log('✅ Login successful, redirecting to dashboard');
          this.router.navigate(['/admin/dashboard']);
        } else {
          console.log('❌ Login failed: Invalid credentials');
          this.errorMessage = 'गलत email या password';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Login error:', error);
        this.errorMessage = 'Login विफल रहा। कृपया पुनः प्रयास करें।';
      }
    });
  }
}