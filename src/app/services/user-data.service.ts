import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  constructor(private authService: AuthService) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // Get current user's unique key
  private getCurrentUserKey(): string | null {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.email : null;
  }

  // Save user-specific data
  saveUserData(key: string, data: any): boolean {
    if (!this.isBrowser()) return false;
    
    const userKey = this.getCurrentUserKey();
    if (!userKey) return false;

    try {
      const userDataKey = `userData_${userKey}_${key}`;
      localStorage.setItem(userDataKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  // Get user-specific data
  getUserData(key: string): any {
    if (!this.isBrowser()) return null;
    
    const userKey = this.getCurrentUserKey();
    if (!userKey) return null;

    try {
      const userDataKey = `userData_${userKey}_${key}`;
      const stored = localStorage.getItem(userDataKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  // Remove user-specific data
  removeUserData(key: string): boolean {
    if (!this.isBrowser()) return false;
    
    const userKey = this.getCurrentUserKey();
    if (!userKey) return false;

    try {
      const userDataKey = `userData_${userKey}_${key}`;
      localStorage.removeItem(userDataKey);
      return true;
    } catch (error) {
      console.error('Error removing user data:', error);
      return false;
    }
  }

  // Clear all data for current user
  clearCurrentUserData(): void {
    if (!this.isBrowser()) return;
    
    const userKey = this.getCurrentUserKey();
    if (!userKey) return;

    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(`userData_${userKey}_`) || key.startsWith(`userProfile_${userKey}`)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Clear all data for all users (admin function)
  clearAllUsersData(): void {
    if (!this.isBrowser()) return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('userData_') || key.startsWith('userProfile_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Save user photo
  saveUserPhoto(photoData: string): boolean {
    return this.saveUserData('photo', photoData);
  }

  // Get user photo
  getUserPhoto(): string | null {
    return this.getUserData('photo');
  }

  // Save user resume data
  saveUserResume(resumeData: any): boolean {
    return this.saveUserData('resume', resumeData);
  }

  // Get user resume data
  getUserResume(): any {
    return this.getUserData('resume');
  }

  // Save user templates
  saveUserTemplates(templates: any[]): boolean {
    return this.saveUserData('templates', templates);
  }

  // Get user templates
  getUserTemplates(): any[] {
    return this.getUserData('templates') || [];
  }

  // Check if user has any data
  hasUserData(): boolean {
    if (!this.isBrowser()) return false;
    
    const userKey = this.getCurrentUserKey();
    if (!userKey) return false;

    const keys = Object.keys(localStorage);
    return keys.some(key => key.startsWith(`userData_${userKey}_`) || key.startsWith(`userProfile_${userKey}`));
  }

  // Mark that user has created a resume
  markResumeCreated(): void {
    const userKey = this.getCurrentUserKey();
    if (userKey) {
      localStorage.setItem(`hasCreatedResume_${userKey}`, 'true');
    }
  }

  // Get resume count for current user
  getResumeCount(): number {
    if (!this.isBrowser()) return 0;
    
    const userKey = this.getCurrentUserKey();
    if (!userKey) return 0;

    let count = 0;
    
    // Check if user has resume data
    const resumeData = this.getUserData('resumeData');
    if (resumeData && Object.keys(resumeData).length > 0) {
      count++;
    }
    
    // Check if user has created resume flag
    const hasCreated = localStorage.getItem(`hasCreatedResume_${userKey}`);
    if (hasCreated === 'true' && count === 0) {
      count = 1;
    }
    
    return count;
  }
}