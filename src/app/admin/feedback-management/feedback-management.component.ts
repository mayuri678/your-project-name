import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { SupabaseService } from '../../services/supabase.service';
import { Feedback } from '../../models/admin.models';

@Component({
  selector: 'app-feedback-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feedback-management">
      <div class="page-header">
        <div>
          <h1>💬 Feedback & Messages</h1>
          <p>Manage user feedback and support messages</p>
        </div>
        <button class="btn-refresh" (click)="loadFeedback()">🔄 Refresh</button>
      </div>

      <!-- Stats -->
      <div class="feedback-stats">
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div>
            <h3>{{ feedbackList.length }}</h3>
            <p>Total</p>
          </div>
        </div>
        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div>
            <h3>{{ pendingCount }}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div class="stat-card reviewed">
          <div class="stat-icon">👁️</div>
          <div>
            <h3>{{ reviewedCount }}</h3>
            <p>Reviewed</p>
          </div>
        </div>
        <div class="stat-card resolved">
          <div class="stat-icon">✅</div>
          <div>
            <h3>{{ resolvedCount }}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>

      <!-- Filter -->
      <div class="filter-bar">
        <button *ngFor="let f of filters" 
          class="filter-btn" 
          [class.active]="activeFilter === f.value"
          (click)="setFilter(f.value)">
          {{ f.label }}
        </button>
        <input type="text" placeholder="🔍 Search..." [(ngModel)]="searchTerm" (input)="applyFilter()" class="search-input" />
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading feedback...</p>
      </div>

      <!-- Feedback List -->
      <div class="feedback-list" *ngIf="!isLoading">
        <div *ngFor="let fb of filteredList" class="feedback-card">
          <div class="card-header">
            <div class="user-info">
              <div class="avatar">{{ fb.userEmail.charAt(0).toUpperCase() }}</div>
              <div>
                <strong>{{ fb.userEmail }}</strong>
                <span class="date">{{ formatDate(fb.createdAt) }}</span>
              </div>
            </div>
            <span class="status-badge" [ngClass]="fb.status">{{ fb.status | titlecase }}</span>
          </div>

          <h4 class="subject">{{ fb.subject }}</h4>
          <p class="message">{{ fb.message }}</p>

          <div *ngIf="fb.adminResponse" class="admin-reply">
            <strong>Admin Reply:</strong> {{ fb.adminResponse }}
          </div>

          <!-- Reply Box -->
          <div *ngIf="replyingId === fb.id" class="reply-box">
            <textarea [(ngModel)]="replyText" placeholder="Type your reply..." rows="3"></textarea>
            <div class="reply-actions">
              <button (click)="replyingId = null" class="btn-cancel">Cancel</button>
              <button (click)="submitReply(fb.id)" class="btn-send">Send Reply & Resolve</button>
            </div>
          </div>

          <div class="card-actions" *ngIf="fb.status !== 'resolved'">
            <button *ngIf="fb.status === 'pending'" (click)="updateStatus(fb.id, 'reviewed')" class="btn-review">👁️ Mark Reviewed</button>
            <button (click)="startReply(fb.id)" class="btn-reply">💬 Reply</button>
            <button (click)="updateStatus(fb.id, 'resolved')" class="btn-resolve">✅ Resolve</button>
            <button (click)="deleteFeedback(fb.id)" class="btn-delete">🗑️</button>
          </div>
          <div class="card-actions" *ngIf="fb.status === 'resolved'">
            <button (click)="deleteFeedback(fb.id)" class="btn-delete">🗑️ Delete</button>
          </div>
        </div>

        <div *ngIf="filteredList.length === 0" class="empty-state">
          <div style="font-size:48px">💬</div>
          <h3>No feedback found</h3>
          <p>No messages match your current filter.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-management { padding: 24px; background: #f0f4f8; min-height: 100vh; }

    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { font-size: 26px; margin: 0 0 4px; color: #1e2a38; }
    .page-header p { margin: 0; color: #64748b; }

    .btn-refresh { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; }

    .feedback-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: #1e2a38; color: white; padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 16px; }
    .stat-card.pending { border-left: 4px solid #f59e0b; }
    .stat-card.reviewed { border-left: 4px solid #3b82f6; }
    .stat-card.resolved { border-left: 4px solid #10b981; }
    .stat-card.total { border-left: 4px solid #8b5cf6; }
    .stat-icon { font-size: 32px; }
    .stat-card h3 { margin: 0; font-size: 28px; font-weight: 700; }
    .stat-card p { margin: 4px 0 0; font-size: 13px; color: #94a3b8; }

    .filter-bar { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap; }
    .filter-btn { padding: 8px 16px; border: 2px solid #e2e8f0; background: white; border-radius: 20px; cursor: pointer; font-size: 13px; color: #475569; transition: all 0.2s; }
    .filter-btn.active { background: #1e2a38; color: white; border-color: #1e2a38; }
    .search-input { margin-left: auto; padding: 8px 16px; border: 2px solid #e2e8f0; border-radius: 20px; font-size: 13px; outline: none; width: 220px; }

    .loading-state { text-align: center; padding: 60px; color: #64748b; }
    .spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .feedback-list { display: flex; flex-direction: column; gap: 16px; }
    .feedback-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; background: #1e2a38; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
    .user-info strong { display: block; color: #1e293b; font-size: 14px; }
    .date { font-size: 12px; color: #94a3b8; }

    .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.reviewed { background: #dbeafe; color: #1e40af; }
    .status-badge.resolved { background: #d1fae5; color: #065f46; }

    .subject { margin: 0 0 8px; color: #1e293b; font-size: 16px; }
    .message { margin: 0 0 12px; color: #475569; font-size: 14px; line-height: 1.6; }

    .admin-reply { background: #f0fdf4; border-left: 3px solid #10b981; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #065f46; margin-bottom: 12px; }

    .reply-box { background: #f8fafc; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
    .reply-box textarea { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; resize: vertical; box-sizing: border-box; }
    .reply-actions { display: flex; gap: 10px; margin-top: 10px; justify-content: flex-end; }

    .card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-review { background: #3b82f6; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-reply { background: #8b5cf6; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-resolve { background: #10b981; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-delete { background: #ef4444; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-cancel { background: #6b7280; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-send { background: #10b981; color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }

    .empty-state { text-align: center; padding: 60px; color: #94a3b8; }
    .empty-state h3 { color: #475569; }

    @media (max-width: 768px) {
      .feedback-stats { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class FeedbackManagementComponent implements OnInit {
  feedbackList: Feedback[] = [];
  filteredList: Feedback[] = [];
  isLoading = false;
  activeFilter = 'all';
  searchTerm = '';
  replyingId: string | null = null;
  replyText = '';

  pendingCount = 0;
  reviewedCount = 0;
  resolvedCount = 0;

  filters = [
    { label: 'All', value: 'all' },
    { label: '⏳ Pending', value: 'pending' },
    { label: '👁️ Reviewed', value: 'reviewed' },
    { label: '✅ Resolved', value: 'resolved' }
  ];

  constructor(
    private adminService: AdminService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.isLoading = true;
    this.adminService.getFeedback().subscribe({
      next: (feedback) => {
        this.feedbackList = feedback;
        this.updateCounts();
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  updateCounts(): void {
    this.pendingCount = this.feedbackList.filter(f => f.status === 'pending').length;
    this.reviewedCount = this.feedbackList.filter(f => f.status === 'reviewed').length;
    this.resolvedCount = this.feedbackList.filter(f => f.status === 'resolved').length;
  }

  setFilter(value: string): void {
    this.activeFilter = value;
    this.applyFilter();
  }

  applyFilter(): void {
    let list = this.feedbackList;
    if (this.activeFilter !== 'all') {
      list = list.filter(f => f.status === this.activeFilter);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(f =>
        f.userEmail.toLowerCase().includes(term) ||
        f.subject.toLowerCase().includes(term) ||
        f.message.toLowerCase().includes(term)
      );
    }
    this.filteredList = list;
  }

  updateStatus(id: string, status: Feedback['status']): void {
    this.adminService.updateFeedbackStatus(id, status).subscribe({
      next: () => {
        const fb = this.feedbackList.find(f => f.id === id);
        if (fb) { fb.status = status; }
        this.updateCounts();
        this.applyFilter();
      }
    });
  }

  startReply(id: string): void {
    this.replyingId = id;
    this.replyText = '';
  }

  submitReply(id: string): void {
    if (!this.replyText.trim()) return;
    this.adminService.updateFeedbackStatus(id, 'resolved', this.replyText).subscribe({
      next: () => {
        const fb = this.feedbackList.find(f => f.id === id);
        if (fb) {
          fb.status = 'resolved';
          fb.adminResponse = this.replyText;
        }
        this.replyingId = null;
        this.replyText = '';
        this.updateCounts();
        this.applyFilter();
      }
    });
  }

  deleteFeedback(id: string): void {
    if (!confirm('Delete this feedback?')) return;
    this.supabaseService.deleteFeedback(id).then(() => {
      this.feedbackList = this.feedbackList.filter(f => f.id !== id);
      this.updateCounts();
      this.applyFilter();
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
