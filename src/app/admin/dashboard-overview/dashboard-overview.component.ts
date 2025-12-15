import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { DashboardStats, AdminUser } from '../../models/admin.models';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-overview">
      <header class="content-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, {{ currentAdmin?.name }}! Here's what's happening with your platform.</p>
      </header>

      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <div *ngIf="error" class="error-state">
        <p>{{ error }}</p>
        <button (click)="loadDashboardStats()" class="retry-btn">Retry</button>
      </div>

      <div class="stats-grid" *ngIf="stats && !isLoading">
        <div class="stat-card users">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.users.total }}</h3>
            <p>Total Users</p>
            <span class="stat-change positive">+{{ stats.users.new }} new</span>
          </div>
        </div>

        <div class="stat-card templates">
          <div class="stat-icon">📄</div>
          <div class="stat-content">
            <h3>{{ stats.templates.total }}</h3>
            <p>Resume Templates</p>
            <span class="stat-detail">{{ stats.templates.premium }} premium</span>
          </div>
        </div>

        <div class="stat-card revenue">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>\${{ stats.revenue.total }}</h3>
            <p>Total Revenue</p>
            <span class="stat-change positive">\${{ stats.revenue.monthly }} this month</span>
          </div>
        </div>

        <div class="stat-card downloads">
          <div class="stat-icon">⬇️</div>
          <div class="stat-content">
            <h3>{{ stats.templates.downloads }}</h3>
            <p>Total Downloads</p>
            <span class="stat-detail">{{ stats.revenue.subscriptions }} active subscriptions</span>
          </div>
        </div>
      </div>


    </div>
  `,
  styles: [`
    .dashboard-overview { padding: 16px; height: 100vh; overflow-y: auto; }
    .content-header { margin-bottom: 20px; }
    .content-header h1 { font-size: 28px; font-weight: 600; color: #1a202c; margin: 0 0 8px 0; }
    .content-header p { color: #4a5568; font-size: 16px; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .stat-card { background: white; border-radius: 8px; padding: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; transition: transform 0.2s ease; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); }
    .stat-icon { font-size: 24px; width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .stat-card.users .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.templates .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .stat-card.revenue .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .stat-card.downloads .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
    .stat-content h3 { font-size: 20px; font-weight: 600; color: #1a202c; margin: 0 0 2px 0; }
    .stat-content p { color: #4a5568; font-size: 14px; margin: 0 0 8px 0; }
    .stat-change { font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; }
    .stat-change.positive { background-color: #c6f6d5; color: #22543d; }
    .stat-detail { font-size: 12px; color: #718096; }
    .quick-actions h2 { font-size: 20px; font-weight: 600; color: #1a202c; margin: 0 0 16px 0; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .action-btn { background: white; border: 2px solid #e2e8f0; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; color: #4a5568; position: relative; }
    .action-btn:hover { border-color: #667eea; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15); }
    .action-btn .icon { font-size: 24px; }
    .action-btn span { font-weight: 500; font-size: 14px; }
    .badge { position: absolute; top: 8px; right: 8px; background: #e53e3e; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; }
    .loading-state, .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; }
    .spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .retry-btn { background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 8px; }
    .error-state p { color: #e53e3e; margin: 0 0 8px 0; }
  `]
})
export class DashboardOverviewComponent implements OnInit {
  stats: DashboardStats | null = null;
  currentAdmin: AdminUser | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Check if admin is logged in, if not set a default admin
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
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.error = null;
    
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
        // Set fallback stats
        this.stats = {
          users: { total: 0, active: 0, new: 0 },
          templates: { total: 0, premium: 0, downloads: 0 },
          revenue: { total: 0, monthly: 0, subscriptions: 0 },
          feedback: { pending: 0, resolved: 0, total: 0 }
        };
      }
    });
  }
}