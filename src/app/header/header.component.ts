import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, LoggedInUser } from '../auth.service';
import { UserDataService } from '../services/user-data.service';
import { SupabaseService } from '../services/supabase.service';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', './header-popup.css']
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

  showContactPopup = false;
  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor(
    private authService: AuthService, 
    private userDataService: UserDataService,
    private router: Router, 
    private elementRef: ElementRef,
    private supabaseService: SupabaseService,
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLoggedInUsers();
    this.checkAdminStatus();
    this.loadAdminTemplates();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('adminTemplateCreated', () => {
        this.loadAdminTemplates();
      });
      
      // Listen for profile updates
      window.addEventListener('storage', () => {
        this.loadLoggedInUsers();
        this.cdr.detectChanges();
      });
    }
    
    this.refreshInterval = setInterval(() => {
      this.loadLoggedInUsers();
      this.checkAdminStatus();
      this.cdr.markForCheck();
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
    if (user) {
      // Get full name from profile if available
      const profile = this.authService.getUserProfile();
      const displayName = profile?.username || user.name;
      return `${displayName} (${user.email})`;
    }
    return null;
  }

  getUserInitial(user: LoggedInUser | null = null): string {
    const targetUser = user || this.authService.getCurrentUser();
    if (targetUser) {
      // Get full name from profile if available
      const profile = this.authService.getUserProfile();
      const displayName = profile?.username || targetUser.name;
      if (displayName) {
        return displayName.charAt(0).toUpperCase();
      }
    }
    return 'U'; // Default to 'U' for User
  }

  getUserPhoto(): string | null {
    const profile = this.authService.getUserProfile();
    if (profile?.photo) {
      return profile.photo;
    }
    // Also check UserDataService
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const savedProfile = localStorage.getItem(`userProfile_${currentUser.email}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          return parsed.photo || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Get full name from profile if available
      const profile = this.authService.getUserProfile();
      if (profile && profile.username) {
        return profile.username;
      }
      // Fallback to user.name from auth service
      return user.name;
    }
    return 'User';
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
    
    // If it's the current user, emit logout event and navigate to login
    if (currentUser && currentUser.email === user.email) {
      this.logout.emit();
      this.router.navigate(['/login']);
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
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  onTemplatesClick(): void {
    if (this.loggedIn) {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('openTemplateManager'));
        }, 100);
      });
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
    this.router.navigate(['/resume'], {
      queryParams: { 
        template: template.id,
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

  goToHelp(): void {
    this.router.navigate(['/help']);
  }

  openContactForm(): void {
    this.showContactPopup = true;
  }

  closeContactPopup(): void {
    this.showContactPopup = false;
    this.resetContactForm();
  }

  async sendContactMessage(): Promise<void> {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Save to Supabase
      await this.contactService.submitContactForm({
        full_name: this.contactForm.name,
        email: this.contactForm.email,
        message: this.contactForm.message
      });

      // Send email using EmailJS
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_vw95fjw',
          template_id: 'template_default',
          user_id: '9yJLiuXHcw3EG0n-f',
          template_params: {
            to_email: 'gulvemayuri63@gmail.com',
            from_name: this.contactForm.name,
            from_email: this.contactForm.email,
            reply_to: this.contactForm.email,
            message: this.contactForm.message,
            subject: `New Contact Form Message from ${this.contactForm.name}`
          }
        })
      });

      if (response.ok) {
        alert('✅ Thank you! Your message has been sent to gulvemayuri63@gmail.com');
      } else {
        alert('✅ Message saved! We will contact you soon.');
      }
      this.closeContactPopup();
    } catch (error) {
      alert('✅ Message saved! We will contact you soon.');
      this.closeContactPopup();
    }
  }

  resetContactForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }

  openResumeGenerator(): void {
    if (!this.loggedIn) {
      this.goToLogin();
      return;
    }
    this.router.navigate(['/resume-generator']);
  }

  logoutCurrentUser(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async loadAdminTemplates(): Promise<void> {
    try {
      this.isLoadingTemplates = true;
      
      // Default 28 templates
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
        { id: 'template24', name: 'Data Scientist', category: 'Technology', description: 'Analytics and data focused' },
        { id: 'template25', name: 'Simple Clean', category: 'Minimalist', description: 'Clean and simple design' },
        { id: 'template26', name: 'Modern Professional', category: 'Professional', description: 'Modern professional style' },
        { id: 'template27', name: 'Creative Bold', category: 'Creative', description: 'Bold creative design' },
        { id: 'template28', name: 'Executive Elite', category: 'Executive', description: 'Elite executive template' }
      ];
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      this.isLoadingTemplates = false;
    }
  }
}
