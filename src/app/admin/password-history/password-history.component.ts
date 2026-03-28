import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { PasswordHistoryService, PasswordChangeLog } from '../../services/password-history.service';

@Component({
  selector: 'app-password-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './password-history.component.html',
  styleUrls: ['./password-history.component.css']
})
export class PasswordHistoryComponent implements OnInit {
  history: PasswordChangeLog[] = [];
  filteredHistory: PasswordChangeLog[] = [];
  emailFilter = '';
  typeFilter = '';

  totalChanges = 0;
  userChanges = 0;
  adminResets = 0;

  constructor(
    private supabaseService: SupabaseService,
    private passwordHistoryService: PasswordHistoryService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  async loadHistory(): Promise<void> {
    const result = await this.supabaseService.getPasswordChangeHistory();
    const supabaseLogs: PasswordChangeLog[] = (result.data || []).map((r: any) => ({
      id: r.id?.toString(),
      userId: r.user_id || '',
      userEmail: r.email,
      userName: r.email?.split('@')[0] || '',
      changeType: r.change_type as 'change' | 'reset' | 'admin_reset',
      changedBy: r.admin_email || r.email,
      timestamp: new Date(r.changed_at),
      ipAddress: r.ip_address
    }));

    const localLogs = this.passwordHistoryService.getHistory();
    const allIds = new Set(supabaseLogs.map(l => l.id));
    const merged = [
      ...supabaseLogs,
      ...localLogs.filter(l => !allIds.has(l.id))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    this.history = merged;
    this.applyFilter();
    this.calculateStats();
  }

  applyFilter(): void {
    this.filteredHistory = this.history.filter(log => {
      const emailMatch = !this.emailFilter || log.userEmail.toLowerCase().includes(this.emailFilter.toLowerCase());
      const typeMatch = !this.typeFilter || log.changeType === this.typeFilter;
      return emailMatch && typeMatch;
    });
  }

  calculateStats(): void {
    this.totalChanges = this.history.length;
    this.userChanges = this.history.filter(l => l.changeType === 'change').length;
    this.adminResets = this.history.filter(l => l.changeType === 'admin_reset').length;
  }

  getChangeTypeLabel(type: string): string {
    switch (type) {
      case 'change': return 'User Change';
      case 'reset': return 'Password Reset';
      case 'admin_reset': return 'Admin Reset';
      default: return type;
    }
  }
}
