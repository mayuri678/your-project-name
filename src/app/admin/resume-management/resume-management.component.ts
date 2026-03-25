import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Resume } from '../../models/admin.models';

@Component({
  selector: 'app-resume-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-management.component.html',
  styleUrls: ['./resume-management.component.css']
})
export class ResumeManagementComponent implements OnInit, OnDestroy {
  resumes: Resume[] = [];
  filteredResumes: Resume[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  filterStatus = 'all';
  confirmDeleteId: string | null = null;
  private refreshInterval: any;

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    console.log('[ResumeManagement] Component initialized');
    this.loadResumes();
    
    // Auto-refresh every 3 seconds
    this.refreshInterval = setInterval(() => {
      console.log('[ResumeManagement] Auto-refreshing resumes...');
      this.loadResumes();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      console.log('[ResumeManagement] Auto-refresh stopped');
    }
  }

  async loadResumes(): Promise<void> {
    if (this.loading && this.resumes.length > 0) return;
    
    this.loading = true;
    this.error = '';
    console.log('[ResumeManagement] Loading resumes...');
    
    const { data, error } = await this.supabase.getAllResumes();
    if (error) {
      console.error('[ResumeManagement] Error loading resumes:', error);
      this.error = 'Could not connect to Supabase. Check your connection.';
    } else {
      console.log('[ResumeManagement] Resumes loaded:', data?.length || 0);
      this.resumes = (data || []).map((r: any) => ({
        ...r,
        user_email: r.users?.email || 'Unknown',
        user_name: r.users?.full_name || r.users?.email?.split('@')[0] || 'Unknown'
      }));
      this.applyFilters();
    }
    this.loading = false;
  }

  applyFilters(): void {
    let result = [...this.resumes];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.user_email || '').toLowerCase().includes(q) ||
        (r.user_name || '').toLowerCase().includes(q)
      );
    }
    if (this.filterStatus !== 'all') {
      result = result.filter(r => r.status === this.filterStatus);
    }
    this.filteredResumes = result;
  }

  async toggleFeatured(resume: Resume): Promise<void> {
    const { error } = await this.supabase.toggleResumeFeatured(resume.id, !resume.is_featured);
    if (!error) {
      resume.is_featured = !resume.is_featured;
    }
  }

  async updateAtsScore(resume: Resume, score: number): Promise<void> {
    if (score < 0 || score > 100) return;
    const { error } = await this.supabase.updateResumeAtsScore(resume.id, score);
    if (!error) resume.ats_score = score;
  }

  confirmDelete(id: string): void {
    this.confirmDeleteId = id;
  }

  async deleteResume(): Promise<void> {
    if (!this.confirmDeleteId) return;
    const { error } = await this.supabase.deleteResume(this.confirmDeleteId);
    if (!error) {
      this.resumes = this.resumes.filter(r => r.id !== this.confirmDeleteId);
      this.applyFilters();
    }
    this.confirmDeleteId = null;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  getStatusClass(status: string): string {
    return { draft: 'badge-warning', published: 'badge-success', archived: 'badge-secondary' }[status] || 'badge-secondary';
  }

  getAtsClass(score: number): string {
    if (score >= 80) return 'ats-high';
    if (score >= 50) return 'ats-medium';
    return 'ats-low';
  }
}
