import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Download, DownloadStat, TemplateUsageStat } from '../../models/admin.models';

@Component({
  selector: 'app-download-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './download-tracking.component.html',
  styleUrls: ['./download-tracking.component.css']
})
export class DownloadTrackingComponent implements OnInit {
  downloads: Download[] = [];
  filteredDownloads: Download[] = [];
  userStats: DownloadStat[] = [];
  templateStats: TemplateUsageStat[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  activeTab: 'all' | 'users' | 'templates' = 'all';

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadDownloads();
  }

  async loadDownloads(): Promise<void> {
    this.loading = true;
    this.error = '';
    const { data, error } = await this.supabase.getAllDownloads();
    if (error) {
      this.error = 'Could not connect to Supabase. Check your connection.';
    } else {
      this.downloads = (data || []).map((d: any) => ({
        ...d,
        user_email: d.users?.email || 'Unknown'
      }));
      this.applyFilters();
      this.buildUserStats();
      this.buildTemplateStats();
    }
    this.loading = false;
  }

  applyFilters(): void {
    if (!this.searchQuery.trim()) {
      this.filteredDownloads = [...this.downloads];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredDownloads = this.downloads.filter(d =>
      (d.user_email || '').toLowerCase().includes(q) ||
      (d.template_id || '').toLowerCase().includes(q) ||
      d.format.toLowerCase().includes(q)
    );
  }

  buildUserStats(): void {
    const map = new Map<string, { count: number; last: string }>();
    for (const d of this.downloads) {
      const email = d.user_email || 'Unknown';
      const existing = map.get(email);
      if (!existing || d.downloaded_at > existing.last) {
        map.set(email, {
          count: (existing?.count || 0) + 1,
          last: d.downloaded_at
        });
      } else {
        map.set(email, { count: existing.count + 1, last: existing.last });
      }
    }
    this.userStats = Array.from(map.entries())
      .map(([email, v]) => ({ user_email: email, download_count: v.count, last_download: v.last }))
      .sort((a, b) => b.download_count - a.download_count);
  }

  buildTemplateStats(): void {
    const map = new Map<string, number>();
    for (const d of this.downloads) {
      if (d.template_id) {
        map.set(d.template_id, (map.get(d.template_id) || 0) + 1);
      }
    }
    this.templateStats = Array.from(map.entries())
      .map(([id, count]) => ({ template_id: id, template_name: id, usage_count: count }))
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 10);
  }

  get totalDownloads(): number { return this.downloads.length; }
  get monthlyDownloads(): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return this.downloads.filter(d => new Date(d.downloaded_at) >= cutoff).length;
  }
  get uniqueUsers(): number { return new Set(this.downloads.map(d => d.user_email)).size; }
}
