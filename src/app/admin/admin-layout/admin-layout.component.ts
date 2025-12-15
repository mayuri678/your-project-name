import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/admin.models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  currentAdmin: AdminUser | null = null;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAdmin = this.adminService.getCurrentAdmin();
    if (!this.currentAdmin) {
      // Set default admin for demo purposes
      const defaultAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      };
      this.currentAdmin = defaultAdmin;
    }
  }

  logout(): void {
    this.adminService.adminLogout();
    this.router.navigate(['/home']);
  }
}