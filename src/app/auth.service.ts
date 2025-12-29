import { Injectable } from '@angular/core';

export interface LoggedInUser {
  email: string;
  name: string;
  loginTime: number; // timestamp when user logged in
}

export interface UserAccount {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface UserProfile {
  username: string;
  email: string;
  contactNo: string;
  notification: boolean;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  location: string;
  photo: string; // Base64 encoded image or URL
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private currentUser: { email: string; name: string } | null = null;
  private loggedInUsers: LoggedInUser[] = [];
  
  // Default test users with roles
  private readonly defaultUsers: UserAccount[] = [
    { email: 'admin', password: 'admin', name: 'Admin', role: 'admin' },
    { email: 'user1', password: 'user1', name: 'User One', role: 'user' },
    { email: 'user2', password: 'user2', name: 'User Two', role: 'user' },
    { email: 'john@example.com', password: 'john123', name: 'John Doe', role: 'user' },
    { email: 'jane@example.com', password: 'jane123', name: 'Jane Smith', role: 'user' },
    { email: 'test@example.com', password: 'test123', name: 'Test User', role: 'user' },
    { email: 'gulvemayuri63', password: 'mayuri123', name: 'Mayuri Gulve', role: 'user' },
    { email: 'normaluser', password: 'user123', name: 'Normal User', role: 'user' },
    { email: 'demo@test.com', password: 'demo123', name: 'Demo User', role: 'user' }
  ];

  constructor() {
    if (this.isBrowser()) {
      this.loggedIn = localStorage.getItem('loggedIn') === 'true';
      this.loadLoggedInUsers();
      this.initializeUsers();
    }
  }

  private initializeUsers(): void {
    if (!this.isBrowser()) return;
    
    // Force refresh users to ensure admin role is properly set
    this.saveRegisteredUsers(this.defaultUsers);
    
    console.log('Initialized users:', this.getRegisteredUsers());
  }

  private getRegisteredUsers(): UserAccount[] {
    if (!this.isBrowser()) return [];
    
    try {
      const stored = localStorage.getItem('registeredUsers');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading registered users:', error);
    }
    return [];
  }

  private saveRegisteredUsers(users: UserAccount[]): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving registered users:', error);
    }
  }

  register(email: string, password: string, name?: string, role: 'admin' | 'user' = 'user'): boolean {
    if (!this.isBrowser()) return false;
    
    const registeredUsers = this.getRegisteredUsers();
    
    // Check if user already exists
    if (registeredUsers.some(u => u.email === email)) {
      return false; // User already exists
    }
    
    // Add new user
    const userName = name || (email.includes('@') ? email.split('@')[0] : email);
    const newUser: UserAccount = {
      email,
      password,
      name: userName,
      role
    };
    
    registeredUsers.push(newUser);
    this.saveRegisteredUsers(registeredUsers);
    return true;
  }

  getTestUsers(): UserAccount[] {
    return this.getRegisteredUsers();
  }

  login(email: string, password: string): boolean {
    // Clear previous user data before login
    this.clearUserSession();
    
    const registeredUsers = this.getRegisteredUsers();
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.loggedIn = true;
      this.currentUser = { email: user.email, name: user.name };
      if (this.isBrowser()) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserEmail', user.email);
        localStorage.setItem('currentUserName', user.name);
        localStorage.setItem('currentUserRole', user.role || 'user');
        
        console.log('Login Success:', {
          email: user.email,
          role: user.role,
          savedRole: localStorage.getItem('currentUserRole')
        });
        
        // Add user to logged-in users list
        this.addLoggedInUser(user.email, user.name);
      }
      return true;
    }
    return false;
  }

  addLoggedInUser(email: string, name: string): void {
    if (!this.isBrowser()) return;

    // Check if user already exists
    const existingUserIndex = this.loggedInUsers.findIndex(u => u.email === email);
    
    if (existingUserIndex >= 0) {
      // Update login time if user already exists
      this.loggedInUsers[existingUserIndex].loginTime = Date.now();
    } else {
      // Add new user
      const newUser: LoggedInUser = {
        email,
        name,
        loginTime: Date.now()
      };
      this.loggedInUsers.push(newUser);
    }

    // Save to localStorage
    this.saveLoggedInUsers();
  }

  removeLoggedInUser(email: string): void {
    this.loggedInUsers = this.loggedInUsers.filter(u => u.email !== email);
    if (this.isBrowser()) {
      this.saveLoggedInUsers();
    }
  }

  getAllLoggedInUsers(): LoggedInUser[] {
    return [...this.loggedInUsers];
  }

  private loadLoggedInUsers(): void {
    if (!this.isBrowser()) return;
    
    try {
      const stored = localStorage.getItem('loggedInUsers');
      if (stored) {
        this.loggedInUsers = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading logged-in users:', error);
      this.loggedInUsers = [];
    }
  }

  private saveLoggedInUsers(): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem('loggedInUsers', JSON.stringify(this.loggedInUsers));
    } catch (error) {
      console.error('Error saving logged-in users:', error);
    }
  }

  logout(): void {
    this.loggedIn = false;
    this.currentUser = null;
    
    if (this.isBrowser()) {
      // Clear all user session data
      this.clearUserSession();
      
      // Remove current user from logged-in users list
      const currentEmail = localStorage.getItem('currentUserEmail');
      if (currentEmail) {
        this.removeLoggedInUser(currentEmail);
      }
    }
  }

  logoutUser(email: string): void {
    this.removeLoggedInUser(email);
    // If logging out current user, also clear current session
    if (this.currentUser?.email === email) {
      this.logout();
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem('loggedIn') === 'true';
    }
    return this.loggedIn;
  }

  getCurrentUser(): { email: string; name: string } | null {
    if (this.currentUser) return this.currentUser;
    if (this.isBrowser()) {
      const email = localStorage.getItem('currentUserEmail');
      const name = localStorage.getItem('currentUserName');
      if (email && name) return { email, name };
    }
    return null;
  }

  // Profile management methods
  saveUserProfile(profile: UserProfile): boolean {
    if (!this.isBrowser()) return false;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    try {
      const profileKey = `userProfile_${currentUser.email}`;
      localStorage.setItem(profileKey, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  getUserProfile(): UserProfile | null {
    if (!this.isBrowser()) return null;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    
    try {
      const profileKey = `userProfile_${currentUser.email}`;
      const stored = localStorage.getItem(profileKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
    return null;
  }

  // Forgot password functionality
  getPasswordHint(email: string): string | null {
    const registeredUsers = this.getRegisteredUsers();
    const user = registeredUsers.find(u => u.email === email);
    
    if (user) {
      // Return password hint (first 2 characters + asterisks)
      return user.password.substring(0, 2) + '*'.repeat(user.password.length - 2);
    }
    return null;
  }

  // Reset password (for demo purposes - shows actual password)
  resetPassword(email: string): string | null {
    const registeredUsers = this.getRegisteredUsers();
    const user = registeredUsers.find(u => u.email === email);
    
    if (user) {
      return user.password; // In real app, this would send email
    }
    return null;
  }

  // Check if current user is admin
  isAdmin(): boolean {
    if (!this.isBrowser()) return false;
    
    const userRole = localStorage.getItem('currentUserRole');
    const userEmail = localStorage.getItem('currentUserEmail');
    
    console.log('Admin Check:', { userRole, userEmail, isAdmin: userRole === 'admin' });
    
    // Also check if user email is 'admin' as fallback
    return userRole === 'admin' || userEmail === 'admin';
  }

  // Get current user role
  getCurrentUserRole(): 'admin' | 'user' | null {
    if (!this.isBrowser()) return null;
    
    const role = localStorage.getItem('currentUserRole');
    return role as 'admin' | 'user' || null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  // Clear all user session data to prevent data leakage
  clearUserSession(): void {
    if (!this.isBrowser()) return;
    
    // Clear authentication data
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserRole');
    
    // Clear user profile data for all users
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('userProfile_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear any other user-specific data
    localStorage.removeItem('currentAdmin');
    
    // Reset service state
    this.loggedIn = false;
    this.currentUser = null;
  }

  // Force clear all user data (for complete reset)
  clearAllUserData(): void {
    if (!this.isBrowser()) return;
    
    this.clearUserSession();
    
    // Also clear logged-in users list if needed
    localStorage.removeItem('loggedInUsers');
    this.loggedInUsers = [];
  }
}
