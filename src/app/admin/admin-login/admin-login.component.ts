import { Component, OnInit } from '@angular/core';
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
export class AdminLoginComponent implements OnInit {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    public adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.adminService.isAdminLoggedIn()) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'कृपया email और password दोनों दर्ज करें';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.adminLogin(this.email, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'गलत email या password';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login विफल रहा। कृपया पुनः प्रयास करें।';
      }
    });
  }
}
