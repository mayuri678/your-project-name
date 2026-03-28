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
  loggedInUsers: LoggedInUser[] = [];
  currentUserEmail: string = '';
  isAdmin: boolean = false;
  private refreshInterval: any;

  showContactPopup = false;
  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  siteLogo = '';
  siteName = 'Resume Builder';

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
    this.loadSiteSettings();
    this.loadLoggedInUsers();
    this.checkAdminStatus();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('adminTemplateCreated', () => {
      });
      
      window.addEventListener('storage', () => {
        this.loadLoggedInUsers();
        this.cdr.detectChanges();
      });
    }
    
    // Subscribe to auth state changes
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      this.cdr.markForCheck();
    });
    
    this.refreshInterval = setInterval(() => {
      this.loadLoggedInUsers();
      this.checkAdminStatus();
      this.loggedIn = this.authService.isLoggedIn();
      this.cdr.markForCheck();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  async loadSiteSettings(): Promise<void> {
    try {
      // Check localStorage cache first for instant display
      const cached = localStorage.getItem('site_settings');
      if (cached) {
        const map = JSON.parse(cached);
        if (map['site_logo']) this.siteLogo = map['site_logo'];
        if (map['site_name']) this.siteName = map['site_name'];
        this.cdr.markForCheck();
      }
      // Always fetch fresh from DB
      const { data } = await this.supabaseService.getAllSettings();
      if (data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => map[s.key] = s.value);
        localStorage.setItem('site_settings', JSON.stringify(map));
        if (map['site_logo']) this.siteLogo = map['site_logo'];
        if (map['site_name']) this.siteName = map['site_name'];
        this.cdr.markForCheck();
      }
    } catch { /* use defaults */ }
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
    this.router.navigate(['/templates']);
  }

  toggleTemplates(): void {
    if (!this.loggedIn) {
      this.goToLogin();
      return;
    }
    this.router.navigate(['/templates']);
  }

  closeTemplates(): void {
  }

  selectTemplate(template: any): void {
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
    this.userDataService.clearCurrentUserData();
    this.authService.logout();
    this.loadLoggedInUsers();
    this.loggedIn = false;
    this.closeAccount();
    this.cdr.detectChanges();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  async loadAdminTemplates(): Promise<void> {
  }
}
