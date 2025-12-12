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
  
  // Default test users
  private readonly defaultUsers: UserAccount[] = [
    { email: 'admin', password: 'admin', name: 'Admin' },
    { email: 'user1', password: 'user1', name: 'User One' },
    { email: 'user2', password: 'user2', name: 'User Two' },
    { email: 'john@example.com', password: 'john123', name: 'John Doe' },
    { email: 'jane@example.com', password: 'jane123', name: 'Jane Smith' },
    { email: 'test@example.com', password: 'test123', name: 'Test User' },
    { email: 'gulvemayuri63', password: 'mayuri123', name: 'Mayuri Gulve' }
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
    
    // Load registered users from localStorage
    const storedUsers = this.getRegisteredUsers();
    
    // If no users are stored, initialize with default users
    if (storedUsers.length === 0) {
      this.saveRegisteredUsers(this.defaultUsers);
    }
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

  register(email: string, password: string, name?: string): boolean {
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
      name: userName
    };
    
    registeredUsers.push(newUser);
    this.saveRegisteredUsers(registeredUsers);
    return true;
  }

  getTestUsers(): UserAccount[] {
    return this.getRegisteredUsers();
  }

  login(email: string, password: string): boolean {
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
    if (this.isBrowser()) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('isLoggedIn');
      // Optionally remove current user from list, or keep them in the list
      // this.removeLoggedInUser(this.currentUser?.email || '');
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

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
