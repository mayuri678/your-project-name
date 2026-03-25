import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { UserDataService } from './services/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background: #f0f0f0; border-radius: 8px; margin: 20px;">
      <h2>🧪 Logout Test</h2>
      
      <div style="margin: 10px 0;">
        <strong>Current Status:</strong>
        <p>Logged In: {{ isLoggedIn }}</p>
        <p>Current User: {{ currentUser?.email || 'None' }}</p>
        <p>localStorage loggedIn: {{ getLocalStorageLoggedIn() }}</p>
      </div>

      <div style="margin: 10px 0;">
        <button (click)="testLogout()" style="padding: 10px 20px; background: red; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Test Logout
        </button>
        <button (click)="checkStorage()" style="padding: 10px 20px; background: blue; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          Check Storage
        </button>
        <button (click)="goToLogin()" style="padding: 10px 20px; background: green; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          Go to Login
        </button>
      </div>

      <div style="margin: 10px 0; background: white; padding: 10px; border-radius: 4px;">
        <strong>Console Output:</strong>
        <pre>{{ consoleOutput }}</pre>
      </div>
    </div>
  `
})
export class LogoutTestComponent implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: any = null;
  consoleOutput: string = '';

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateStatus();
  }

  updateStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
    this.log('Status updated');
  }

  getLocalStorageLoggedIn(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loggedIn') || 'null';
    }
    return 'N/A';
  }

  testLogout(): void {
    this.log('🔴 Starting logout...');
    this.log('Before logout - isLoggedIn: ' + this.authService.isLoggedIn());
    
    this.userDataService.clearCurrentUserData();
    this.log('✅ User data cleared');
    
    this.authService.logout();
    this.log('✅ AuthService.logout() called');
    
    this.updateStatus();
    this.log('After logout - isLoggedIn: ' + this.authService.isLoggedIn());
    this.log('After logout - localStorage loggedIn: ' + this.getLocalStorageLoggedIn());
    
    setTimeout(() => {
      this.log('Navigating to /login...');
      this.router.navigate(['/login'], { replaceUrl: true });
    }, 500);
  }

  checkStorage(): void {
    this.log('📦 Checking localStorage...');
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      this.log('localStorage keys: ' + keys.join(', '));
      
      keys.forEach(key => {
        if (key.includes('logged') || key.includes('current') || key.includes('user')) {
          this.log(`  ${key}: ${localStorage.getItem(key)}`);
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.consoleOutput += `[${timestamp}] ${message}\n`;
    console.log(message);
  }
}
