import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { SubscriptionPlan } from '../../models/admin.models';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subscription-management">
      <div class="page-header">
        <div class="header-content">
          <h1>Subscription Plans</h1>
          <p>Manage subscription plans and pricing</p>
        </div>
        <button class="create-btn" (click)="toggleCreateForm()">
          {{ showCreateForm ? 'Cancel' : '+ Add Plan' }}
        </button>
      </div>

      <div class="create-form" *ngIf="showCreateForm">
        <h3>Create New Plan</h3>
        <form (ngSubmit)="createPlan()">
          <div class="form-row">
            <input type="text" [(ngModel)]="newPlan.name" name="name" placeholder="Plan Name" required>
            <input type="number" [(ngModel)]="newPlan.price" name="price" placeholder="Price" step="0.01" required>
          </div>
          <textarea [(ngModel)]="newPlan.description" name="description" placeholder="Description" rows="3"></textarea>
          <input type="number" [(ngModel)]="newPlan.duration" name="duration" placeholder="Duration (days)" required>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Create Plan</button>
            <button type="button" class="cancel-btn" (click)="toggleCreateForm()">Cancel</button>
          </div>
        </form>
      </div>

      <div class="plans-grid">
        <div *ngFor="let plan of plans" class="plan-card">
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="plan-price">\${{ plan.price }}/{{ plan.duration }}d</div>
          </div>
          <p class="plan-description">{{ plan.description }}</p>
          <ul class="plan-features">
            <li *ngFor="let feature of plan.features">{{ feature }}</li>
          </ul>
          <div class="plan-status">
            <span class="status-badge" [class.active]="plan.isActive">
              {{ plan.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="plan-actions">
            <button (click)="togglePlanStatus(plan.id)" class="toggle-btn">
              {{ plan.isActive ? 'Deactivate' : 'Activate' }}
            </button>
            <button (click)="deletePlan(plan.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subscription-management { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .page-header h1 { font-size: 28px; margin: 0; color: #1a202c; font-weight: 700; }
    .header-content p { color: #2d3748; font-weight: 500; margin: 4px 0 0 0; }
    .create-btn { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
    .create-form { background: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .create-form h3 { color: #1a202c; font-weight: 600; margin: 0 0 16px 0; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .form-row input, textarea { padding: 10px; border: 2px solid #e2e8f0; border-radius: 6px; color: #1a202c; font-weight: 500; }
    .form-row input::placeholder, textarea::placeholder { color: #4a5568; }
    .form-actions { display: flex; gap: 12px; margin-top: 16px; }
    .submit-btn { background: #38a169; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
    .cancel-btn { background: #e2e8f0; color: #2d3748; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .plan-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0; }
    .plan-card h3 { color: #1a202c; font-weight: 600; margin: 0; }
    .plan-description { color: #2d3748; font-weight: 500; margin: 12px 0; }
    .plan-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .plan-price { font-size: 24px; font-weight: 600; color: #667eea; }
    .plan-features { list-style: none; padding: 0; margin: 16px 0; }
    .plan-features li { padding: 4px 0; color: #2d3748; font-weight: 500; }
    .plan-features li:before { content: "✓ "; color: #38a169; font-weight: bold; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge:not(.active) { background: #fed7d7; color: #c53030; }
    .status-badge.active { background: #c6f6d5; color: #22543d; }
    .plan-actions { display: flex; gap: 12px; margin-top: 16px; }
    .toggle-btn { background: #3182ce; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
    .delete-btn { background: #e53e3e; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500; }
  `]
})
export class SubscriptionManagementComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  showCreateForm = false;
  newPlan: Partial<SubscriptionPlan> = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    features: ['Basic Support'],
    isActive: true
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.adminService.getSubscriptionPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  createPlan(): void {
    if (!this.newPlan.name || !this.newPlan.price) return;
    
    this.adminService.createSubscriptionPlan(this.newPlan as Omit<SubscriptionPlan, 'id' | 'createdAt'>).subscribe({
      next: (plan) => {
        this.plans.push(plan);
        this.toggleCreateForm();
        this.newPlan = { name: '', description: '', price: 0, duration: 30, features: ['Basic Support'], isActive: true };
      }
    });
  }

  togglePlanStatus(planId: string): void {
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      this.adminService.updateSubscriptionPlan(planId, { isActive: !plan.isActive }).subscribe({
        next: (success) => {
          if (success) {
            plan.isActive = !plan.isActive;
          }
        }
      });
    }
  }

  deletePlan(planId: string): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.adminService.deleteSubscriptionPlan(planId).subscribe({
        next: (success) => {
          if (success) {
            this.plans = this.plans.filter(p => p.id !== planId);
          }
        }
      });
    }
  }
}