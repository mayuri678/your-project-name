import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoggedInUser } from '../auth.service';

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

  templateList = [
    { id: 'template1', name: 'Classic Blue' },
    { id: 'template2', name: 'Modern Sidebar' },
    { id: 'template3', name: 'Header Style' },
    { id: 'template4', name: 'Minimal Black' },
    { id: 'template5', name: 'Professional Navy' },
    { id: 'template6', name: 'Creative Orange' },
    { id: 'template7', name: 'Executive Gray' },
    { id: 'template8', name: 'Tech Modern' },
    { id: 'template9', name: 'Academic Dark Blue' },
    { id: 'template10', name: 'Startup Green' },
    { id: 'template11', name: 'Corporate Navy' },
    { id: 'template12', name: 'Artistic Purple' }
  ];

  constructor(private authService: AuthService, private router: Router, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadLoggedInUsers();
    this.checkAdminStatus();
    // Refresh the list every 2 seconds to catch new logins
    this.refreshInterval = setInterval(() => {
      this.loadLoggedInUsers();
      this.checkAdminStatus();
    }, 2000);
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
    this.authService.logoutUser(user.email);
    this.loadLoggedInUsers();
    // If it's the current user, emit logout event
    const currentUser = this.authService.getCurrentUser();
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
      this.templates.emit();
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
      queryParams: { template: template.id, edit: 'true' }
    });
    this.closeTemplates();
  }

  checkAdminStatus(): void {
    if (this.loggedIn) {
      const currentUser = this.authService.getCurrentUser();
      this.isAdmin = currentUser?.email === 'admin';
    } else {
      this.isAdmin = false;
    }
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
