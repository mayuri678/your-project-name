import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoggedInUser } from '../auth.service';
import { UserDataService } from '../services/user-data.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() loggedIn: boolean = false;
  @Input() showTemplates: boolean = false;

  @Output() about = new EventEmitter<void>();
  @Output() resume = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() templates = new EventEmitter<void>();

  isAccountOpen: boolean = false;
  isTemplatesOpen: boolean = false;
  loggedInUsers: LoggedInUser[] = [];
  currentUserEmail: string = '';
  isAdmin: boolean = false;
  private refreshInterval: any;

  templateList: any[] = [];
  isLoadingTemplates = false;

  constructor(
    private authService: AuthService, 
    private userDataService: UserDataService,
    private router: Router, 
    private elementRef: ElementRef,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.loadLoggedInUsers();
    this.checkAdminStatus();
    this.loadAdminTemplates();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('adminTemplateCreated', () => {
        this.loadAdminTemplates();
      });
    }
    
    this.refreshInterval = setInterval(() => {
      this.loadLoggedInUsers();
      this.checkAdminStatus();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadLoggedInUsers(): void {
    this.loggedInUsers = this.authService.getAllLoggedInUsers();
    const currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = currentUser ? currentUser.email : '';
  }

  get currentUserLabel(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? `${user.name} (${user.email})` : null;
  }

  getUserInitial(user: LoggedInUser | null = null): string {
    const targetUser = user || this.authService.getCurrentUser();
    if (targetUser && targetUser.name) {
      return targetUser.name.charAt(0).toUpperCase();
    }
    return 'U'; // Default to 'U' for User
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.name : 'User';
  }

  getCurrentUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.email : 'user@example.com';
  }

  getCurrentUserRole(): string {
    return this.authService.getCurrentUserRole() || 'none';
  }

  toggleAccount(): void {
    this.isAccountOpen = !this.isAccountOpen;
    if (this.isAccountOpen) {
      this.loadLoggedInUsers();
    }
  }

  closeAccount(): void {
    this.isAccountOpen = false;
  }

  logoutUser(user: LoggedInUser): void {
    // Clear user data before logout if it's the current user
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.email === user.email) {
      this.userDataService.clearCurrentUserData();
    }
    
    this.authService.logoutUser(user.email);
    this.loadLoggedInUsers();
    
    // If it's the current user, emit logout event
    if (currentUser && currentUser.email === user.email) {
      this.logout.emit();
    }
  }

  formatLoginTime(loginTime: number): string {
    const date = new Date(loginTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  goToLogin(): void {
    this.login.emit(); 
    this.router.navigate([{ outlets: { modal: ['login'] } }]);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  onTemplatesClick(): void {
    if (this.loggedIn) {
      this.router.navigate(['/templates']);
    } else {
      this.goToLogin();
    }
  }

  toggleTemplates(): void {
    if (!this.loggedIn) {
      this.goToLogin();
      return;
    }
    this.isTemplatesOpen = !this.isTemplatesOpen;
  }

  closeTemplates(): void {
    this.isTemplatesOpen = false;
  }

  selectTemplate(template: any): void {
    // For admin templates, use the actual template ID
    const templateId = template.id.startsWith('template') ? template.id : 'template1';
    
    this.router.navigate(['/resume'], {
      queryParams: { 
        template: templateId, 
        adminTemplate: template.id, // Pass admin template ID for loading
        edit: 'true' 
      }
    });
    this.closeTemplates();
  }

  checkAdminStatus(): void {
    // Show admin panel only for admin role users
    this.isAdmin = this.authService.isAdmin();
  }

  goToAdmin(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      // Show error message for non-admin users
      alert('Access Denied: Admin privileges required!');
    }
  }

  showResumeGuide(): void {
    this.router.navigate(['/help']);
  }

  async loadAdminTemplates(): Promise<void> {
    try {
      this.isLoadingTemplates = true;
      const result = await this.supabaseService.getAllTemplates();
      
      if (result.data) {
        // Filter and process admin templates
        const adminTemplates = result.data
          .map(template => {
            try {
              const data = JSON.parse(template.description || '{}');
              // Only include admin templates (those with template properties)
              if (data.templateColor || data.templateLayout || data.templateFeatures) {
                return {
                  id: template.id,
                  name: data.name || template.title || 'Admin Template',
                  category: data.category || template.category || 'Professional',
                  description: data.description || 'Admin created template'
                };
              }
              return null;
            } catch {
              return null;
            }
          })
          .filter(template => template !== null);
        
        // Add default templates if no admin templates exist
        if (adminTemplates.length === 0) {
          this.templateList = [
            { id: 'template1', name: 'Classic Blue', category: 'Professional', description: 'Traditional professional look' },
            { id: 'template2', name: 'Modern Sidebar', category: 'Creative', description: 'Contemporary design with sidebar' },
            { id: 'template3', name: 'Header Style', category: 'Professional', description: 'Clean header-focused layout' },
            { id: 'template4', name: 'Minimal Black', category: 'Minimalist', description: 'Sleek minimalist design' },
            { id: 'template5', name: 'Professional Navy', category: 'Professional', description: 'Corporate navy theme' },
            { id: 'template6', name: 'Creative Orange', category: 'Creative', description: 'Vibrant creative design' },
            { id: 'template7', name: 'Executive Gray', category: 'Executive', description: 'Senior executive template' },
            { id: 'template8', name: 'Tech Modern', category: 'Technology', description: 'Perfect for tech professionals' },
            { id: 'template9', name: 'Academic Dark Blue', category: 'Academic', description: 'Ideal for academic positions' },
            { id: 'template10', name: 'Startup Green', category: 'Creative', description: 'Dynamic startup vibe' },
            { id: 'template11', name: 'Corporate Navy', category: 'Professional', description: 'Corporate standard design' },
            { id: 'template12', name: 'Artistic Purple', category: 'Creative', description: 'Artistic and creative layout' },
            { id: 'template13', name: 'Fresh Graduate', category: 'Entry Level', description: 'Perfect for new graduates' },
            { id: 'template14', name: 'Healthcare Pro', category: 'Healthcare', description: 'Medical professionals template' },
            { id: 'template15', name: 'Finance Expert', category: 'Finance', description: 'Banking and finance focused' },
            { id: 'template16', name: 'Marketing Guru', category: 'Marketing', description: 'Creative marketing template' },
            { id: 'template17', name: 'Engineering Pro', category: 'Engineering', description: 'Technical engineering layout' },
            { id: 'template18', name: 'Sales Champion', category: 'Sales', description: 'Results-driven sales template' },
            { id: 'template19', name: 'Designer Portfolio', category: 'Design', description: 'Showcase your design skills' },
            { id: 'template20', name: 'Legal Professional', category: 'Legal', description: 'Law and legal services' },
            { id: 'template21', name: 'Consultant Elite', category: 'Consulting', description: 'Management consulting style' },
            { id: 'template22', name: 'Teacher Choice', category: 'Education', description: 'Education sector template' },
            { id: 'template23', name: 'Entrepreneur Bold', category: 'Business', description: 'Bold entrepreneurial design' },
            { id: 'template24', name: 'Data Scientist', category: 'Technology', description: 'Analytics and data focused' }
          ];
        } else {
          // Combine admin templates with default templates
          this.templateList = [
            ...adminTemplates,
            { id: 'template1', name: 'Classic Blue', category: 'Professional', description: 'Traditional professional look' },
            { id: 'template2', name: 'Modern Sidebar', category: 'Creative', description: 'Contemporary design with sidebar' },
            { id: 'template3', name: 'Header Style', category: 'Professional', description: 'Clean header-focused layout' },
            { id: 'template4', name: 'Minimal Black', category: 'Minimalist', description: 'Sleek minimalist design' },
            { id: 'template5', name: 'Professional Navy', category: 'Professional', description: 'Corporate navy theme' },
            { id: 'template6', name: 'Creative Orange', category: 'Creative', description: 'Vibrant creative design' },
            { id: 'template7', name: 'Executive Gray', category: 'Executive', description: 'Senior executive template' },
            { id: 'template8', name: 'Tech Modern', category: 'Technology', description: 'Perfect for tech professionals' }
          ];
        }
      }
    } catch (error) {
      console.error('Error loading admin templates:', error);
      // Fallback to default templates
      this.templateList = [
        { id: 'template1', name: 'Classic Blue', category: 'Professional', description: 'Traditional professional look' },
        { id: 'template2', name: 'Modern Sidebar', category: 'Creative', description: 'Contemporary design with sidebar' },
        { id: 'template3', name: 'Header Style', category: 'Professional', description: 'Clean header-focused layout' },
        { id: 'template4', name: 'Minimal Black', category: 'Minimalist', description: 'Sleek minimalist design' },
        { id: 'template5', name: 'Professional Navy', category: 'Professional', description: 'Corporate navy theme' },
        { id: 'template6', name: 'Creative Orange', category: 'Creative', description: 'Vibrant creative design' },
        { id: 'template7', name: 'Executive Gray', category: 'Executive', description: 'Senior executive template' },
        { id: 'template8', name: 'Tech Modern', category: 'Technology', description: 'Perfect for tech professionals' },
        { id: 'template9', name: 'Academic Dark Blue', category: 'Academic', description: 'Ideal for academic positions' },
        { id: 'template10', name: 'Startup Green', category: 'Creative', description: 'Dynamic startup vibe' },
        { id: 'template11', name: 'Corporate Navy', category: 'Professional', description: 'Corporate standard design' },
        { id:'template12', name: 'Artistic Purple', category: 'Creative', description: 'Artistic and creative layout' },
        { id: 'template13', name: 'Fresh Graduate', category: 'Entry Level', description: 'Perfect for new graduates' },
        { id: 'template14', name: 'Healthcare Pro', category: 'Healthcare', description: 'Medical professionals template' },
        { id: 'template15', name: 'Finance Expert', category: 'Finance', description: 'Banking and finance focused' },
        { id: 'template16', name: 'Marketing Guru', category: 'Marketing', description: 'Creative marketing template' },
        { id: 'template17', name: 'Engineering Pro', category: 'Engineering', description: 'Technical engineering layout' },
        { id: 'template18', name: 'Sales Champion', category: 'Sales', description: 'Results-driven sales template' },
        { id: 'template19', name: 'Designer Portfolio', category: 'Design', description: 'Showcase your design skills' },
        { id: 'template20', name: 'Legal Professional', category: 'Legal', description: 'Law and legal services' },
        { id: 'template21', name: 'Consultant Elite', category: 'Consulting', description: 'Management consulting style' },
        { id: 'template22', name: 'Teacher Choice', category: 'Education', description: 'Education sector template' },
        { id: 'template23', name: 'Entrepreneur Bold', category: 'Business', description: 'Bold entrepreneurial design' },
        { id: 'template24', name: 'Data Scientist', category: 'Technology', description: 'Analytics and data focused' }
      ];
    } finally {
      this.isLoadingTemplates = false;
    }
  }
}
