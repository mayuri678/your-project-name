import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { DashboardStats, AdminUser } from '../../models/admin.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  currentAdmin: AdminUser | null = null;
  activeSection = 'dashboard';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentAdmin = this.adminService.getCurrentAdmin();
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  logout(): void {
    this.adminService.adminLogout();
    this.router.navigate(['/admin/login']);
  }
}