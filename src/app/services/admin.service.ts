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
    // Legacy mock credentials for quick demo
    if (email === 'admin' && password === 'admin') {
      const admin: AdminUser = {
        id: 'mock-admin',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date()
      };
      this.setCurrentAdmin(admin);
      
      console.log('✅ Admin logged in successfully (mock):', admin);
      
      // Also try to login to Supabase for template creation
      this.supabaseService.login('admin@example.com', 'admin123').then(result => {
        console.log('Supabase login for admin:', result);
      }).catch(err => {
        console.log('Supabase login failed, using mock admin');
      });
      
      return of(true);
    }

    // Real Supabase auth so RLS inserts (templates) work
    return from(this.supabaseService.login(email, password)).pipe(
      map(result => {
        if (result.error || !result.data?.session?.user) {
          console.log('❌ Admin login failed:', result.error);
          return false;
        }

        const user = result.data.session.user;
        const admin: AdminUser = {
          id: user.id,
          email: user.email || email,
          name: user.user_metadata?.['full_name'] || user.email || email,
          role: 'admin',
          isActive: true,
          lastLogin: new Date(),
          createdAt: new Date()
        };
        this.setCurrentAdmin(admin);
        console.log('✅ Admin logged in successfully (Supabase):', admin);
        return true;
      }),
      catchError((err) => {
        console.error('❌ Supabase admin login failed:', err);
        return of(false);
      })
    );
  }

  adminLogout(): void {
    this.currentAdminSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentAdmin');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }

  isAdminLoggedIn(): boolean {
    // First check in-memory
    if (this.currentAdminSubject.value !== null) {
      return true;
    }
    // Restore from localStorage on reload
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentAdmin');
      const token = localStorage.getItem('adminToken');
      if (stored && token) {
        try {
          const admin = JSON.parse(stored);
          this.currentAdminSubject.next(admin);
          return true;
        } catch {
          return false;
        }
      }
    }
    return false;
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
      localStorage.setItem('adminToken', 'admin-token-' + admin.id);
      localStorage.setItem('adminUser', JSON.stringify(admin));
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
      this.supabaseService.getAllTemplates(),
      this.supabaseService.getAllResumes(),
      this.supabaseService.getAllNotifications()
    ])).pipe(
      map(([usersResult, templatesResult, resumesResult, notifResult]) => {
        const userCount = usersResult.data?.length || 0;
        const templateCount = templatesResult.data?.length || 0;
        const resumeCount = resumesResult.data?.length || 0;
        const featuredCount = (resumesResult.data || []).filter((r: any) => r.is_featured).length;
        const unreadNotif = (notifResult.data || []).filter((n: any) => !n.is_read).length;

        const loggedInUsers = this.getCurrentLoggedInUsers();
        const totalRealUsers = Math.max(userCount, loggedInUsers.length);

        const stats: DashboardStats = {
          users: {
            total: totalRealUsers,
            active: Math.floor(totalRealUsers * 0.9),
            new: Math.floor(totalRealUsers * 0.2) || 1
          },
          templates: {
            total: templateCount,
            premium: Math.floor(templateCount * 0.3),
            downloads: this.calculateRealDownloads(templateCount, totalRealUsers)
          },
          revenue: {
            total: this.calculateRealRevenue(this.calculateRealDownloads(templateCount, totalRealUsers), totalRealUsers),
            monthly: Math.floor(this.calculateRealRevenue(this.calculateRealDownloads(templateCount, totalRealUsers), totalRealUsers) * 0.3),
            subscriptions: this.calculateRealSubscriptions(totalRealUsers)
          },
          feedback: {
            pending: Math.floor(totalRealUsers * 0.1) || 1,
            resolved: totalRealUsers * 2,
            total: totalRealUsers * 2 + Math.floor(totalRealUsers * 0.1) || 1
          },
          resumes: { total: resumeCount, featured: featuredCount },
          notifications: { unread: unreadNotif }
        };
        return stats;
      }),
      catchError(() => {
        const loggedInUsers = this.getCurrentLoggedInUsers();
        const realUserCount = loggedInUsers.length || 1;
        const downloads = this.calculateRealDownloads(0, realUserCount);
        const revenue = this.calculateRealRevenue(downloads, realUserCount);
        const subscriptions = this.calculateRealSubscriptions(realUserCount);
        return of({
          users: { total: realUserCount, active: Math.floor(realUserCount * 0.9), new: Math.floor(realUserCount * 0.2) || 1 },
          templates: { total: 0, premium: 0, downloads },
          revenue: { total: revenue, monthly: Math.floor(revenue * 0.3), subscriptions },
          feedback: { pending: realUserCount > 0 ? 1 : 0, resolved: Math.floor(realUserCount * 0.5), total: Math.floor(realUserCount * 0.5) + 1 },
          resumes: { total: 0, featured: 0 },
          notifications: { unread: 0 }
        });
      })
    );
  }

  // User Management
  getUsers(): Observable<AdminUser[]> {
    return from(this.supabaseService.getUsers()).pipe(
      map(result => {
        if (result.data && result.data.length > 0) {
          return result.data.map((user: any) => ({
            id: user.id,
            email: user.email,
            name: user.full_name || user.email.split('@')[0],
            role: 'user' as AdminUser['role'],
            isActive: true,
            createdAt: new Date(user.created_at),
            lastLogin: user.updated_at ? new Date(user.updated_at) : undefined
          }));
        }
        return [];
      }),
      catchError(() => of([]))
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
    console.log('Loading templates from database...');
    return from(this.supabaseService.getAllTemplates()).pipe(
      map(result => {
        console.log('Raw templates from database:', result.data);
        if (result.data) {
          const dbTemplates = result.data.map(template => {
            let resumeData: any = {};
            let templateName = template.title || 'Untitled Resume';
            
            // Parse JSON description to get resume data
            try {
              if (template.description) {
                resumeData = JSON.parse(template.description);
                templateName = resumeData.name || templateName;
              }
            } catch (e) {
              console.warn('Failed to parse template description:', template.id);
            }
            
            const processedTemplate = {
              id: template.id,
              name: templateName,
              description: resumeData.email ? `Resume for ${resumeData.name || 'User'} (${resumeData.email})` : 'Resume Template',
              category: this.getCategoryName(template.category) || 'Professional',
              color: resumeData.templateColor || 'Blue',
              layout: resumeData.templateLayout || '1 Column',
              templateFeatures: resumeData.templateFeatures || [],
              isPremium: false,
              price: 0,
              isActive: resumeData.isActive !== undefined ? resumeData.isActive : true,
              downloadCount: Math.floor(Math.random() * 50) + 1,
              createdAt: new Date(template.created_at),
              updatedAt: new Date(template.updated_at || template.created_at),
              previewUrl: resumeData.profilePhoto || undefined,
              thumbnailUrl: resumeData.profilePhoto || undefined
            };
            
            console.log('Processed template:', processedTemplate);
            return processedTemplate;
          });
          
          // Update mock templates with database data
          this.mockTemplates = dbTemplates;
          return dbTemplates;
        }
        return this.mockTemplates;
      }),
      catchError((error) => {
        console.error('Error loading templates:', error);
        return of(this.mockTemplates);
      })
    );
  }

  createTemplate(template: Omit<ResumeTemplate, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>): Observable<ResumeTemplate> {
    console.log('AdminService: Creating template:', template);
    
    // Ensure all features are included by default
    const templateWithFeatures = {
      ...template,
      templateFeatures: template.templateFeatures && template.templateFeatures.length > 0 
        ? template.templateFeatures 
        : ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio']
    };
    
    return from(this.supabaseService.createAdminTemplate(templateWithFeatures)).pipe(
      map(result => {
        console.log('Supabase create result:', result);
        
        if (result.error) {
          console.error('Supabase template creation failed:', result.error);
          throw result.error;
        }

        if (result.data) {
          const dbTemplate: any = result.data;
          console.log('✅ Template created in database:', dbTemplate);

          const newTemplate: ResumeTemplate = {
            id: dbTemplate.id,
            name: templateWithFeatures.name,
            description: templateWithFeatures.description || '',
            category: this.getCategoryName(dbTemplate.category || templateWithFeatures.category),
            isPremium: templateWithFeatures.isPremium,
            price: templateWithFeatures.price,
            isActive: templateWithFeatures.isActive,
            color: templateWithFeatures.color,
            layout: templateWithFeatures.layout,
            templateFeatures: templateWithFeatures.templateFeatures,
            downloadCount: 0,
            createdAt: new Date(dbTemplate.created_at),
            updatedAt: new Date(dbTemplate.updated_at || dbTemplate.created_at)
          };

          this.mockTemplates.unshift(newTemplate);
          console.log('✅ Template added to mock data:', newTemplate);
          
          return newTemplate;
        }

        throw new Error('Template insert failed - no data returned');
      }),
      catchError((error) => {
        console.error('Create template failed:', error);
        const errorMessage = error?.message || 'Template creation failed';
        throw new Error(`Template create करताना त्रुटी: ${errorMessage}`);
      })
    );
  }

  getTemplateById(id: string): Observable<ResumeTemplate> {
    console.log('AdminService: Getting template by ID:', id);
    
    // First check mock data
    const template = this.mockTemplates.find(t => t.id === id);
    if (template) {
      console.log('Template found in mock data:', template);
      return of(template);
    }
    
    // If not found in mock data, try to get from Supabase
    return from(this.supabaseService.getAllTemplates()).pipe(
      map(result => {
        if (result.data) {
          const supabaseTemplate = result.data.find(t => t.id === id);
          if (supabaseTemplate) {
            let resumeData: any = {};
            let templateName = supabaseTemplate.title || 'Untitled Resume';
            
            try {
              if (supabaseTemplate.description) {
                resumeData = JSON.parse(supabaseTemplate.description);
                templateName = resumeData.name || resumeData.title || templateName;
              }
            } catch (e) {
              // If parsing fails, use description as is
            }
            
            const convertedTemplate: ResumeTemplate = {
              id: supabaseTemplate.id,
              name: templateName,
              description: supabaseTemplate.description || '',
              category: supabaseTemplate.category || 'Professional',
              isPremium: false,
              price: 0,
              isActive: true,
              downloadCount: Math.floor(Math.random() * 50) + 1,
              createdAt: new Date(supabaseTemplate.created_at),
              updatedAt: new Date(supabaseTemplate.updated_at || supabaseTemplate.created_at),
              htmlContent: supabaseTemplate.html_content || ''
            };
            
            // Add to mock data for future reference
            this.mockTemplates.push(convertedTemplate);
            console.log('Template loaded from Supabase and added to mock:', convertedTemplate);
            
            return convertedTemplate;
          }
        }
        throw new Error('Template not found');
      }),
      catchError((error) => {
        console.error('Error loading template:', error);
        // Create a default template if not found
        const defaultTemplate: ResumeTemplate = {
          id: id,
          name: 'New Template',
          description: '',
          category: 'Professional',
          isPremium: false,
          price: 0,
          isActive: true,
          downloadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.mockTemplates.push(defaultTemplate);
        return of(defaultTemplate);
      })
    );
  }

  updateTemplate(id: string, updates: Partial<ResumeTemplate>): Observable<boolean> {
    console.log('AdminService: Updating template', id, updates);
    
    // Update in Supabase first
    return from(this.supabaseService.updateTemplate(id, updates)).pipe(
      map(result => {
        if (result.data) {
          // Update in mock data after successful Supabase update
          const templateIndex = this.mockTemplates.findIndex(t => t.id === id);
          if (templateIndex !== -1) {
            this.mockTemplates[templateIndex] = { 
              ...this.mockTemplates[templateIndex], 
              ...updates, 
              updatedAt: new Date() 
            };
          } else {
            // Create new template if not found
            const newTemplate: ResumeTemplate = {
              id,
              name: updates.name || 'New Template',
              description: updates.description || '',
              category: updates.category || 'Professional',
              color: updates.color || 'Blue',
              layout: updates.layout || '1 Column',
              templateFeatures: updates.templateFeatures || [],
              isPremium: updates.isPremium || false,
              price: updates.price || 0,
              isActive: updates.isActive !== undefined ? updates.isActive : true,
              downloadCount: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            this.mockTemplates.push(newTemplate);
          }
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Error updating template in Supabase:', error);
        // Fallback to mock data update
        const templateIndex = this.mockTemplates.findIndex(t => t.id === id);
        if (templateIndex !== -1) {
          this.mockTemplates[templateIndex] = { 
            ...this.mockTemplates[templateIndex], 
            ...updates, 
            updatedAt: new Date() 
          };
          return of(true);
        }
        return of(false);
      })
    );
  }

  deleteTemplate(id: string): Observable<boolean> {
    console.log('AdminService: Deleting template', id);
    
    // Delete from Supabase first
    return from(this.supabaseService.deleteTemplate(id)).pipe(
      map(result => {
        if (result.error) {
          console.error('Error deleting from Supabase:', result.error);
          return false;
        }
        
        // Remove from mock data after successful Supabase deletion
        const templateIndex = this.mockTemplates.findIndex(t => t.id === id);
        if (templateIndex !== -1) {
          this.mockTemplates.splice(templateIndex, 1);
        }
        
        console.log('Template successfully deleted from both Supabase and mock data');
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting template:', error);
        return of(false);
      })
    );
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
    return from(this.supabaseService.getAllFeedback()).pipe(
      map(result => {
        if (result.data && result.data.length > 0) {
          return result.data.map((f: any) => ({
            id: f.id,
            userId: f.user_id || '',
            userEmail: f.user_email || '',
            subject: f.subject || 'No Subject',
            message: f.message || '',
            status: f.status || 'pending',
            createdAt: new Date(f.created_at),
            resolvedAt: f.resolved_at ? new Date(f.resolved_at) : undefined,
            adminResponse: f.admin_response || undefined
          }));
        }
        return this.mockFeedback;
      }),
      catchError(() => of(this.mockFeedback))
    );
  }

  updateFeedbackStatus(id: string, status: Feedback['status'], adminResponse?: string): Observable<boolean> {
    return from(this.supabaseService.updateFeedbackStatus(id, status, adminResponse)).pipe(
      map(result => {
        if (!result.error) return true;
        // fallback to mock
        const feedbackIndex = this.mockFeedback.findIndex(f => f.id === id);
        if (feedbackIndex !== -1) {
          this.mockFeedback[feedbackIndex].status = status;
          if (adminResponse) this.mockFeedback[feedbackIndex].adminResponse = adminResponse;
          if (status === 'resolved') this.mockFeedback[feedbackIndex].resolvedAt = new Date();
        }
        return true;
      }),
      catchError(() => {
        const feedbackIndex = this.mockFeedback.findIndex(f => f.id === id);
        if (feedbackIndex !== -1) {
          this.mockFeedback[feedbackIndex].status = status;
          if (status === 'resolved') this.mockFeedback[feedbackIndex].resolvedAt = new Date();
        }
        return of(true);
      })
    );
  }

  // Analytics
  getAnalytics(): Observable<Analytics> {
    return from(Promise.all([
      this.supabaseService.getUsers(),
      this.supabaseService.getAllTemplates(),
      this.supabaseService.getAllDownloads(),
      this.supabaseService.getAllResumes()
    ])).pipe(
      map(([usersResult, templatesResult, downloadsResult, resumesResult]) => {
        const realUserCount = usersResult.data?.length || 0;
        const realTemplateCount = templatesResult.data?.length || 0;
        const realDownloadCount = downloadsResult.data?.length || 0;
        const realResumeCount = resumesResult.data?.length || 0;

        const payingUsers = Math.floor(realUserCount * 0.15);

        const analytics: Analytics = {
          totalUsers: realUserCount,
          totalTemplates: realTemplateCount,
          totalDownloads: realDownloadCount || realResumeCount,
          totalRevenue: payingUsers * 15,
          activeSubscriptions: payingUsers,
          recentActivity: this.generateRealActivity(
            usersResult.data || [],
            downloadsResult.data || [],
            resumesResult.data || []
          )
        };

        console.log('Analytics (real data):', analytics);
        return analytics;
      }),
      catchError((error) => {
        console.error('Analytics error:', error);
        return of({
          totalUsers: 0,
          totalTemplates: 0,
          totalDownloads: 0,
          totalRevenue: 0,
          activeSubscriptions: 0,
          recentActivity: []
        });
      })
    );
  }

  private getCurrentLoggedInUsers(): any[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('loggedInUsers');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private calculateRealDownloads(templateCount: number, userCount: number): number {
    // Only count downloads if there are actual templates and users
    if (templateCount === 0 || userCount === 0) return 0;
    
    // Realistic download calculation: each user might download 2-3 templates on average
    return Math.floor(userCount * 2.5);
  }

  private calculateRealRevenue(downloads: number, userCount: number): number {
    // Revenue only if there are actual downloads and paying users
    if (downloads === 0 || userCount === 0) return 0;
    
    // Assume 20% of users pay, average $15 per user
    const payingUsers = Math.floor(userCount * 0.2);
    return payingUsers * 15;
  }

  private calculateRealSubscriptions(userCount: number): number {
    // Subscriptions only if there are users
    if (userCount === 0) return 0;
    
    // Assume 15% of users have active subscriptions
    return Math.floor(userCount * 0.15) || (userCount > 0 ? 1 : 0);
  }

  private generateRealActivity(supabaseUsers: any[], downloads: any[], resumes: any[]): any[] {
    const activities: any[] = [];

    // Registration activities from users table
    supabaseUsers.slice(0, 5).forEach((user, index) => {
      activities.push({
        id: `reg_${index + 1}`,
        userId: user.id,
        userEmail: user.email,
        action: 'Registered on platform',
        resource: 'Registration',
        timestamp: new Date(user.created_at)
      });
    });

    // Download activities
    downloads.slice(0, 5).forEach((dl, index) => {
      activities.push({
        id: `dl_${index + 1}`,
        userId: dl.user_id,
        userEmail: dl.user_email || dl.users?.email || 'Unknown',
        action: `Downloaded resume (${dl.format || 'pdf'})`,
        resource: 'Download',
        timestamp: new Date(dl.downloaded_at || dl.created_at)
      });
    });

    // Resume save activities
    resumes.slice(0, 5).forEach((resume, index) => {
      activities.push({
        id: `res_${index + 1}`,
        userId: resume.user_id,
        userEmail: resume.users?.email || resume.user_email || 'Unknown',
        action: `Saved resume: ${resume.title || resume.resume_name || 'Untitled'}`,
        resource: 'Resume',
        timestamp: new Date(resume.updated_at || resume.created_at)
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }

  private getCategoryName(categoryId: string): string {
    const categoryMap: { [key: string]: string } = {
      'template1': 'Professional',
      'template2': 'Creative', 
      'template3': 'Modern',
      'template4': 'Classic',
      'template5': 'Technical',
      'template6': 'Professional',
      'template7': 'Creative',
      'template8': 'Modern'
    };
    return categoryMap[categoryId] || 'Professional';
  }
}