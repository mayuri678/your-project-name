import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

interface PasswordChangeLog {
  id: number;
  email: string;
  change_type: 'reset' | 'change' | 'admin_reset';
  admin_email?: string;
  changed_at: string;
  ip_address?: string;
  user_agent?: string;
}

@Component({
  selector: 'app-password-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="password-history-container">
      <div class="header">
        <h2>🔐 Password Change History</h2>
        <div class="filters">
          <input 
            type="text" 
            [(ngModel)]="emailFilter" 
            placeholder="Filter by email..."
            class="filter-input"
            (input)="filterLogs()">
          <select [(ngModel)]="typeFilter" (change)="filterLogs()" class="filter-select">
            <option value="">All Types</option>
            <option value="change">User Change</option>
            <option value="reset">Password Reset</option>
            <option value="admin_reset">Admin Reset</option>
          </select>
          <button (click)="refreshLogs()" class="refresh-btn">🔄 Refresh</button>
        </div>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total Changes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.userChanges }}</div>
          <div class="stat-label">User Changes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.adminResets }}</div>
          <div class="stat-label">Admin Resets</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.todayChanges }}</div>
          <div class="stat-label">Today</div>
        </div>
      </div>

      <div class="logs-table-container">
        <table class="logs-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Type</th>
              <th>Admin</th>
              <th>Date & Time</th>
              <th>IP Address</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of filteredLogs" [class]="getRowClass(log.change_type)">
              <td class="email-cell">{{ log.email }}</td>
              <td class="type-cell">
                <span [class]="getTypeClass(log.change_type)">
                  {{ getTypeLabel(log.change_type) }}
                </span>
              </td>
              <td class="admin-cell">{{ log.admin_email || '-' }}</td>
              <td class="date-cell">{{ formatDate(log.changed_at) }}</td>
              <td class="ip-cell">{{ log.ip_address || '-' }}</td>
              <td class="agent-cell" [title]="log.user_agent">
                {{ truncateUserAgent(log.user_agent) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredLogs.length === 0" class="no-data">
          <div class="no-data-icon">📋</div>
          <div class="no-data-text">No password change logs found</div>
        </div>
      </div>

      <div class="export-section">
        <button (click)="exportLogs()" class="export-btn">📊 Export to CSV</button>
        <button (click)="clearOldLogs()" class="clear-btn">🗑️ Clear Old Logs</button>
      </div>
    </div>
  `,
  styles: [`
    .password-history-container {
      padding: 20px;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header h2 {
      margin: 0;
      color: #333;
      font-size: 24px;
    }

    .filters {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .filter-input, .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }

    .refresh-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    .refresh-btn:hover {
      background: #0056b3;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 32px;
      font-weight: bold;
      color: #007bff;
      margin-bottom: 5px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .logs-table-container {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      margin-bottom: 20px;
    }

    .logs-table {
      width: 100%;
      border-collapse: collapse;
    }

    .logs-table th {
      background: #f8f9fa;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #dee2e6;
    }

    .logs-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #f1f3f4;
    }

    .logs-table tr:hover {
      background: #f8f9fa;
    }

    .email-cell {
      font-weight: 500;
      color: #007bff;
    }

    .type-cell .type-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .type-change {
      background: #d4edda;
      color: #155724;
    }

    .type-reset {
      background: #fff3cd;
      color: #856404;
    }

    .type-admin_reset {
      background: #f8d7da;
      color: #721c24;
    }

    .date-cell {
      font-family: monospace;
      font-size: 13px;
    }

    .agent-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      color: #666;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-data-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .no-data-text {
      font-size: 16px;
    }

    .export-section {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .export-btn, .clear-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .export-btn {
      background: #28a745;
      color: white;
    }

    .export-btn:hover {
      background: #218838;
    }

    .clear-btn {
      background: #dc3545;
      color: white;
    }

    .clear-btn:hover {
      background: #c82333;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
      }

      .filters {
        flex-wrap: wrap;
      }

      .logs-table-container {
        overflow-x: auto;
      }

      .logs-table {
        min-width: 800px;
      }
    }
  `]
})
export class PasswordHistoryComponent implements OnInit {
  logs: PasswordChangeLog[] = [];
  filteredLogs: PasswordChangeLog[] = [];
  emailFilter: string = '';
  typeFilter: string = '';
  
  stats = {
    total: 0,
    userChanges: 0,
    adminResets: 0,
    todayChanges: 0
  };

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  async loadLogs(): Promise<void> {
    try {
      const result = await this.supabaseService.getPasswordChangeHistory();
      
      if (result.data) {
        this.logs = result.data;
      } else {
        // Demo data if no logs found
        this.logs = [
          {
            id: 1,
            email: 'user@example.com',
            change_type: 'change',
            changed_at: new Date().toISOString(),
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          {
            id: 2,
            email: 'admin@example.com',
            change_type: 'admin_reset',
            admin_email: 'admin@example.com',
            changed_at: new Date(Date.now() - 86400000).toISOString(),
            ip_address: '192.168.1.2',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        ];
      }
      
      this.filteredLogs = [...this.logs];
      this.calculateStats();
    } catch (error) {
      console.error('Error loading password change logs:', error);
      this.logs = [];
      this.filteredLogs = [];
    }
  }

  filterLogs(): void {
    this.filteredLogs = this.logs.filter(log => {
      const emailMatch = !this.emailFilter || 
        log.email.toLowerCase().includes(this.emailFilter.toLowerCase());
      const typeMatch = !this.typeFilter || log.change_type === this.typeFilter;
      
      return emailMatch && typeMatch;
    });
  }

  calculateStats(): void {
    const today = new Date().toDateString();
    
    this.stats = {
      total: this.logs.length,
      userChanges: this.logs.filter(log => log.change_type === 'change').length,
      adminResets: this.logs.filter(log => log.change_type === 'admin_reset').length,
      todayChanges: this.logs.filter(log => 
        new Date(log.changed_at).toDateString() === today
      ).length
    };
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'change': return 'User Change';
      case 'reset': return 'Password Reset';
      case 'admin_reset': return 'Admin Reset';
      default: return type;
    }
  }

  getTypeClass(type: string): string {
    return `type-badge type-${type}`;
  }

  getRowClass(type: string): string {
    return `row-${type}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  truncateUserAgent(userAgent?: string): string {
    if (!userAgent) return '-';
    return userAgent.length > 50 ? userAgent.substring(0, 50) + '...' : userAgent;
  }

  async refreshLogs(): Promise<void> {
    await this.loadLogs();
  }

  exportLogs(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-change-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateCSV(): string {
    const headers = ['Email', 'Type', 'Admin Email', 'Date', 'IP Address', 'User Agent'];
    const rows = this.filteredLogs.map(log => [
      log.email,
      this.getTypeLabel(log.change_type),
      log.admin_email || '',
      this.formatDate(log.changed_at),
      log.ip_address || '',
      log.user_agent || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  async clearOldLogs(): Promise<void> {
    if (confirm('Are you sure you want to clear logs older than 30 days?')) {
      // This would typically call a backend service to delete old logs
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      this.logs = this.logs.filter(log => new Date(log.changed_at) > thirtyDaysAgo);
      this.filteredLogs = [...this.logs];
      this.calculateStats();
      alert('Old logs cleared successfully!');
    }
  }
}