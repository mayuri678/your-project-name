import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  currentAdmin: AdminUser | null = null;
  activeSection = 'dashboard';
  private refreshInterval: any;
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('[Dashboard] Component initialized');
    this.currentAdmin = this.adminService.getCurrentAdmin();
    console.log('[Dashboard] Current admin:', this.currentAdmin);
    this.loadDashboardStats();
    
    // Auto-refresh every 3 seconds
    this.refreshInterval = setInterval(() => {
      console.log('[Dashboard] Auto-refreshing stats...');
      this.loadDashboardStats();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      console.log('[Dashboard] Auto-refresh stopped');
    }
  }

  loadDashboardStats(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    console.log('[Dashboard] Loading dashboard stats...');
    
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        console.log('[Dashboard] Stats loaded successfully:', stats);
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[Dashboard] Error loading stats:', error);
        this.isLoading = false;
      }
    });
  }

  setActiveSection(section: string): void {
    console.log('[Dashboard] Setting active section:', section);
    this.activeSection = section;
  }

  logout(): void {
    console.log('[Dashboard] Logging out admin...');
    this.adminService.adminLogout();
    this.router.navigate(['/admin/login']);
  }

  navigateToSection(route: string): void {
    console.log('[Dashboard] Navigating to:', route);
    this.router.navigate([route]);
  }

  refreshStats(): void {
    console.log('[Dashboard] Manual refresh triggered');
    this.loadDashboardStats();
  }
}