import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Feedback } from '../../models/admin.models';

@Component({
  selector: 'app-feedback-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feedback-management">
      <div class="page-header">
        <h1>Feedback & Messages</h1>
        <p>Manage user feedback and support messages</p>
      </div>

      <div class="feedback-stats">
        <div class="stat-card pending">
          <h3>{{ pendingCount }}</h3>
          <p>Pending</p>
        </div>
        <div class="stat-card reviewed">
          <h3>{{ reviewedCount }}</h3>
          <p>Reviewed</p>
        </div>
        <div class="stat-card resolved">
          <h3>{{ resolvedCount }}</h3>
          <p>Resolved</p>
        </div>
      </div>

      <div class="feedback-list">
        <div *ngFor="let feedback of feedbackList" class="feedback-item">
          <div class="feedback-header">
            <h4>{{ feedback.subject }}</h4>
            <span class="status-badge" [ngClass]="feedback.status">{{ feedback.status | titlecase }}</span>
          </div>
          <div class="feedback-meta">
            <span>From: {{ feedback.userEmail }}</span>
            <span>{{ formatDate(feedback.createdAt) }}</span>
          </div>
          <p class="feedback-message">{{ feedback.message }}</p>
          <div class="feedback-actions" *ngIf="feedback.status === 'pending'">
            <button (click)="updateStatus(feedback.id, 'reviewed')" class="btn-review">Mark as Reviewed</button>
            <button (click)="updateStatus(feedback.id, 'resolved')" class="btn-resolve">Resolve</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feedback-management { padding: 24px; }
    .page-header h1 { font-size: 28px; margin: 0 0 8px 0; }
    .feedback-stats { display: flex; gap: 20px; margin: 24px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; }
    .feedback-list { display: flex; flex-direction: column; gap: 16px; }
    .feedback-item { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .feedback-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; }
    .status-badge.pending { background: #fed7d7; color: #c53030; }
    .status-badge.reviewed { background: #fef5e7; color: #c05621; }
    .status-badge.resolved { background: #c6f6d5; color: #22543d; }
    .feedback-actions { margin-top: 16px; display: flex; gap: 12px; }
    .btn-review, .btn-resolve { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-review { background: #3182ce; color: white; }
    .btn-resolve { background: #38a169; color: white; }
  `]
})
export class FeedbackManagementComponent implements OnInit {
  feedbackList: Feedback[] = [];
  pendingCount = 0;
  reviewedCount = 0;
  resolvedCount = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.adminService.getFeedback().subscribe({
      next: (feedback) => {
        this.feedbackList = feedback;
        this.updateCounts();
      }
    });
  }

  updateCounts(): void {
    this.pendingCount = this.feedbackList.filter(f => f.status === 'pending').length;
    this.reviewedCount = this.feedbackList.filter(f => f.status === 'reviewed').length;
    this.resolvedCount = this.feedbackList.filter(f => f.status === 'resolved').length;
  }

  updateStatus(id: string, status: Feedback['status']): void {
    this.adminService.updateFeedbackStatus(id, status).subscribe({
      next: (success) => {
        if (success) {
          const feedback = this.feedbackList.find(f => f.id === id);
          if (feedback) {
            feedback.status = status;
            this.updateCounts();
          }
        }
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}