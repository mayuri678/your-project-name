import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AdminUser, ResumeTemplate, SubscriptionPlan, Analytics, Feedback, DashboardStats, ActivityLog } from '../models/admin.models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  // Mock data for demonstration
  private mockUsers: AdminUser[] = [
    { id: '1', email: 'admin@example.com', name: 'Admin User', role: 'admin', isActive: true, createdAt: new Date() },
    { id: '2', email: 'editor@example.com', name: 'Editor User', role: 'editor', isActive: true, createdAt: new Date() },
    { id: '3', email: 'user@example.com', name: 'Regular User', role: 'user', isActive: true, createdAt: new Date() }
  ];

  private mockTemplates: ResumeTemplate[] = [
    { id: '1', name: 'Professional Template', description: 'Clean professional design', category: 'Professional', isPremium: true, price: 9.99, isActive: true, downloadCount: 150, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Creative Template', description: 'Modern creative layout', category: 'Creative', isPremium: false, price: 0, isActive: true, downloadCount: 89, createdAt: new Date(), updatedAt: new Date() }
  ];

  private mockPlans: SubscriptionPlan[] = [
    { id: '1', name: 'Basic', description: 'Basic features', price: 9.99, duration: 30, features: ['5 Templates', 'Basic Support'], isActive: true, createdAt: new Date() },
    { id: '2', name: 'Premium', description: 'All features included', price: 19.99, duration: 30, features: ['Unlimited Templates', 'Priority Support', 'Custom Designs'], isActive: true, createdAt: new Date() }
  ];

  private mockFeedback: Feedback[] = [
    { id: '1', userId: '1', userEmail: 'user@example.com', subject: 'Template Issue', message: 'Having trouble with template download', status: 'pending', createdAt: new Date() },
    { id: '2', userId: '2', userEmail: 'user2@example.com', subject: 'Feature Request', message: 'Would like more color options', status: 'reviewed', createdAt: new Date() }
  ];

  constructor(private supabaseService: SupabaseService) {
    this.loadCurrentAdmin();
  }

  // Authentication
  adminLogin(email: string, password: string): Observable<boolean> {
    // Simple mock authentication
    if (email === 'admin' && password === 'admin') {
      const admin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date()
      };
      this.setCurrentAdmin(admin);
      return of(true);
    }
    return of(false);
  }

  adminLogout(): void {
    this.currentAdminSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentAdmin');
    }
  }

  isAdminLoggedIn(): boolean {
    return this.currentAdminSubject.value !== null;
  }

  getCurrentAdmin(): AdminUser | null {
    return this.currentAdminSubject.value;
  }

  isAdmin(): Promise<boolean> {
    // Check if current user has admin privileges
    const currentUser = this.getCurrentAdmin();
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor')) {
      return Promise.resolve(true);
    }
    
    // Also check if regular user is admin (for demo purposes)
    if (typeof window !== 'undefined') {
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (currentUserEmail === 'admin') {
        return Promise.resolve(true);
      }
    }
    
    return Promise.resolve(false);
  }

  private setCurrentAdmin(admin: AdminUser): void {
    this.currentAdminSubject.next(admin);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
    }
  }

  private loadCurrentAdmin(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentAdmin');
      if (stored) {
        try {
          const admin = JSON.parse(stored);
          this.currentAdminSubject.next(admin);
        } catch (error) {
          console.error('Error loading admin from storage:', error);
        }
      }
    }
  }

  // Dashboard Analytics
  getDashboardStats(): Observable<DashboardStats> {
    return from(Promise.all([
      this.supabaseService.getUsers(),
      this.supabaseService.getAllTemplates()
    ])).pipe(
      map(([usersResult, templatesResult]) => {
        const userCount = usersResult.data?.length || 0;
        const templateCount = templatesResult.data?.length || 0;
        
        const stats: DashboardStats = {
          users: {
            total: userCount,
            active: userCount,
            new: Math.floor(userCount * 0.1) || 1
          },
          templates: {
            total: templateCount,
            premium: Math.floor(templateCount * 0.3),
            downloads: templateCount * 15
          },
          revenue: {
            total: templateCount * 25,
            monthly: templateCount * 8,
            subscriptions: Math.floor(userCount * 0.2)
          },
          feedback: {
            pending: 2,
            resolved: 8,
            total: 10
          }
        };
        return stats;
      }),
      catchError(() => {
        const fallbackStats: DashboardStats = {
          users: { total: 0, active: 0, new: 0 },
          templates: { total: 0, premium: 0, downloads: 0 },
          revenue: { total: 0, monthly: 0, subscriptions: 0 },
          feedback: { pending: 0, resolved: 0, total: 0 }
        };
        return of(fallbackStats);
      })
    );
  }

  // User Management
  getUsers(): Observable<AdminUser[]> {
    return from(this.supabaseService.getUsers()).pipe(
      map(result => {
        if (result.data) {
          return result.data.map(user => ({
            id: user.id,
            email: user.email,
            name: user.full_name || user.email.split('@')[0],
            role: 'user' as AdminUser['role'],
            isActive: true,
            createdAt: new Date(user.created_at),
            lastLogin: user.updated_at ? new Date(user.updated_at) : undefined
          }));
        }
        return this.mockUsers;
      }),
      catchError(() => of(this.mockUsers))
    );
  }

  updateUserRole(userId: string, role: AdminUser['role']): Observable<boolean> {
    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.mockUsers[userIndex].role = role;
      return of(true);
    }
    return of(false);
  }

  toggleUserStatus(userId: string): Observable<boolean> {
    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.mockUsers[userIndex].isActive = !this.mockUsers[userIndex].isActive;
      return of(true);
    }
    return of(false);
  }

  // Template Management
  getTemplates(): Observable<ResumeTemplate[]> {
    return from(this.supabaseService.getAllTemplates()).pipe(
      map(result => {
        if (result.data) {
          return result.data.map(template => {
            let resumeData: any = {};
            let templateName = template.title || 'Untitled Resume';
            
            // Parse JSON description to get resume data
            try {
              if (template.description) {
                resumeData = JSON.parse(template.description);
                templateName = resumeData.name || resumeData.title || templateName;
              }
            } catch (e) {
              // If parsing fails, use description as is
            }
            
            return {
              id: template.id,
              name: templateName,
              description: resumeData.email ? `Resume for ${resumeData.name || 'User'} (${resumeData.email})` : 'Resume Template',
              category: template.category || 'Professional',
              isPremium: false,
              price: 0,
              isActive: true,
              downloadCount: Math.floor(Math.random() * 50) + 1,
              createdAt: new Date(template.created_at),
              updatedAt: new Date(template.updated_at || template.created_at),
              previewUrl: resumeData.profilePhoto || undefined,
              thumbnailUrl: resumeData.profilePhoto || undefined
            };
          });
        }
        return this.mockTemplates;
      }),
      catchError(() => of(this.mockTemplates))
    );
  }

  createTemplate(template: Omit<ResumeTemplate, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>): Observable<ResumeTemplate> {
    const newTemplate: ResumeTemplate = {
      ...template,
      id: Date.now().toString(),
      downloadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockTemplates.push(newTemplate);
    return of(newTemplate);
  }

  updateTemplate(id: string, updates: Partial<ResumeTemplate>): Observable<boolean> {
    const templateIndex = this.mockTemplates.findIndex(t => t.id === id);
    if (templateIndex !== -1) {
      this.mockTemplates[templateIndex] = { ...this.mockTemplates[templateIndex], ...updates, updatedAt: new Date() };
      return of(true);
    }
    return of(false);
  }

  deleteTemplate(id: string): Observable<boolean> {
    const templateIndex = this.mockTemplates.findIndex(t => t.id === id);
    if (templateIndex !== -1) {
      this.mockTemplates.splice(templateIndex, 1);
      return of(true);
    }
    return of(false);
  }

  // Subscription Plans
  getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return of([...this.mockPlans]);
  }

  createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id' | 'createdAt'>): Observable<SubscriptionPlan> {
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.mockPlans.push(newPlan);
    return of(newPlan);
  }

  updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Observable<boolean> {
    const planIndex = this.mockPlans.findIndex(p => p.id === id);
    if (planIndex !== -1) {
      this.mockPlans[planIndex] = { ...this.mockPlans[planIndex], ...updates };
      return of(true);
    }
    return of(false);
  }

  deleteSubscriptionPlan(id: string): Observable<boolean> {
    const planIndex = this.mockPlans.findIndex(p => p.id === id);
    if (planIndex !== -1) {
      this.mockPlans.splice(planIndex, 1);
      return of(true);
    }
    return of(false);
  }

  // Feedback Management
  getFeedback(): Observable<Feedback[]> {
    return of([...this.mockFeedback]);
  }

  updateFeedbackStatus(id: string, status: Feedback['status'], adminResponse?: string): Observable<boolean> {
    const feedbackIndex = this.mockFeedback.findIndex(f => f.id === id);
    if (feedbackIndex !== -1) {
      this.mockFeedback[feedbackIndex].status = status;
      if (adminResponse) {
        this.mockFeedback[feedbackIndex].adminResponse = adminResponse;
      }
      if (status === 'resolved') {
        this.mockFeedback[feedbackIndex].resolvedAt = new Date();
      }
      return of(true);
    }
    return of(false);
  }

  // Analytics
  getAnalytics(): Observable<Analytics> {
    const analytics: Analytics = {
      totalUsers: this.mockUsers.length,
      totalTemplates: this.mockTemplates.length,
      totalDownloads: this.mockTemplates.reduce((sum, t) => sum + t.downloadCount, 0),
      totalRevenue: 2500,
      activeSubscriptions: 45,
      recentActivity: [
        { id: '1', userId: '1', userEmail: 'user@example.com', action: 'Downloaded Template', resource: 'Template', timestamp: new Date() },
        { id: '2', userId: '2', userEmail: 'user2@example.com', action: 'Subscribed to Premium', resource: 'Subscription', timestamp: new Date() }
      ]
    };
    return of(analytics);
  }
}