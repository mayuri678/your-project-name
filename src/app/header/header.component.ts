import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, LoggedInUser } from '../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() loggedIn: boolean = false;
  @Input() showTemplates: boolean = false;

  @Output() about = new EventEmitter<void>();
  @Output() resume = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();   // ✅ Already present
  @Output() logout = new EventEmitter<void>();
  @Output() templates = new EventEmitter<void>();

  isAccountOpen: boolean = false;
  isExamplesOpen: boolean = false;
  loggedInUsers: LoggedInUser[] = [];
  currentUserEmail: string = '';
  private refreshInterval: any;

  // Categories shown in the Resume Examples dropdown
  exampleCategories: string[] = [
    'Accountant',
    'Bartender',
    'Certified Nursing Assistant',
    'College',
    'Data Scientist',
    'Graphic Design',
    'High School',
    'Medical Assistant',
    'Microsoft Word',
    'Project Manager',
    'Registered Nurse',
    'Server',
    'Software Engineer',
    'Student',
    'Teacher'
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadLoggedInUsers();
    // Refresh the list every 2 seconds to catch new logins
    this.refreshInterval = setInterval(() => {
      this.loadLoggedInUsers();
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

  // Resume Examples dropdown controls
  toggleExamples(): void {
    this.isExamplesOpen = !this.isExamplesOpen;
  }

  closeExamples(): void {
    this.isExamplesOpen = false;
  }

  goToExample(category: string): void {
    this.closeExamples();
    this.router.navigate(['/examples'], { queryParams: { category } });
  }

  // ✅ Login button click method
  goToLogin(): void {
    this.login.emit(); // emit kartoy if parent wants to listen
    this.router.navigate([{ outlets: { modal: ['login'] } }]);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
