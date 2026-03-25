import { Injectable } from '@angular/core';
import { EmailService } from './services/email.service';
import { SupabaseAuthService } from './services/supabase-auth.service';
import { BehaviorSubject } from 'rxjs';

export interface LoggedInUser {
  email: string;
  name: string;
  loginTime: number;
}

export interface UserAccount {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
}

export interface UserProfile {
  username?: string;
  email?: string;
  contactNo?: string;
  notification?: boolean;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  location?: string;
  photo?: string;
  education?: string;
  degree?: string;
  institution?: string;
  graduationYear?: string;
  role?: string;
  is_dark_mode?: boolean;
  language?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private currentUser: { email: string; name: string } | null = null;
  private loggedInUsers: LoggedInUser[] = [];
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$ = this.loggedInSubject.asObservable();
  
  private readonly defaultUsers: UserAccount[] = [
    { email: 'admin', password: 'admin', name: 'Admin System Administrator', role: 'admin' },
    { email: 'user1', password: 'user1', name: 'User One Kumar', role: 'user' },
    { email: 'user2', password: 'user2', name: 'User Two Sharma', role: 'user' },
    { email: 'john@example.com', password: 'john123', name: 'John Michael Doe', role: 'user' },
    { email: 'jane@example.com', password: 'jane123', name: 'Jane Elizabeth Smith', role: 'user' },
    { email: 'test@example.com', password: 'test123', name: 'Test User Account', role: 'user' },
    { email: 'gulvemayuri63@gmail.com', password: 'mayuri123', name: 'Mayuri Suresh Gulve', role: 'user' },
    { email: 'normaluser', password: 'user123', name: 'Normal User Singh', role: 'user' },
    { email: 'demo@test.com', password: 'demo123', name: 'Demo Test User', role: 'user' }
  ];

  constructor(private emailService: EmailService, private supabaseAuthService: SupabaseAuthService) {
    if (this.isBrowser()) {
      this.loggedIn = localStorage.getItem('loggedIn') === 'true';
      this.loadLoggedInUsers();
      this.initializeUsers();
      this.loggedInSubject.next(this.loggedIn);
    }
  }

  private initializeUsers(): void {
    if (!this.isBrowser()) return;
    const stored = localStorage.getItem('registeredUsers');
    if (!stored) {
      console.log('📝 Initializing default users...');
      this.saveRegisteredUsers(this.defaultUsers);
      console.log('✅ Default users saved:', this.defaultUsers.map(u => u.email));
    } else {
      console.log('✅ Users already exist in localStorage');
    }
  }

  private getRegisteredUsers(): UserAccount[] {
    if (!this.isBrowser()) return [];
    try {
      const stored = localStorage.getItem('registeredUsers');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  private saveRegisteredUsers(users: UserAccount[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  async register(email: string, password: string, name?: string, role: 'admin' | 'user' = 'user'): Promise<boolean> {
    if (!this.isBrowser()) return false;
    
    this.initializeUsers();
    
    const registeredUsers = this.getRegisteredUsers();
    if (registeredUsers.some(u => u.email === email)) return false;
    
    const userName = name || (email.includes('@') ? email.split('@')[0] : email);
    registeredUsers.push({ email, password, name: userName, role });
    this.saveRegisteredUsers(registeredUsers);
    
    try {
      const uniqueId = email.replace(/[@.]/g, '_').toLowerCase();
      const profileData = {
        id: uniqueId,
        email: email,
        full_name: userName,
        username: userName,
        role: role,
        is_dark_mode: false,
        language: 'en'
      };
      
      await this.supabaseAuthService.upsertUserProfile(profileData);
      console.log('✅ User registered and saved to Supabase');
    } catch (error) {
      console.error('❌ Supabase save failed during registration:', error);
    }
    
    return true;
  }

  login(email: string, password: string): boolean {
    console.log('🔐 AuthService.login() called with:', email);
    
    this.clearUserSession();
    
    if (!email || !password) {
      console.log('❌ Login failed: Missing email or password');
      return false;
    }
    
    const registeredUsers = this.getRegisteredUsers();
    console.log('📋 Available users:', registeredUsers.map(u => u.email));
    
    const user = registeredUsers.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ Login failed: User not found:', email);
      console.log('📋 Available users were:', registeredUsers.map(u => u.email));
      return false;
    }
    
    console.log('🔍 Found user:', user.email, 'Checking password...');
    console.log('Expected password:', user.password);
    console.log('Provided password:', password);
    console.log('Match:', user.password === password);
    
    if (user.password !== password) {
      console.log('❌ Login failed: Wrong password for:', email);
      return false;
    }
    
    console.log('✅ Login successful for:', email);
    
    this.loggedIn = true;
    this.currentUser = { email: user.email, name: user.name };
    
    if (this.isBrowser()) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('currentUserEmail', user.email);
      localStorage.setItem('currentUserName', user.name);
      localStorage.setItem('currentUserRole', user.role || 'user');
      
      this.addLoggedInUser(user.email, user.name);
      this.saveLoginToBackend(user.email, user.name);
    }
    
    this.loggedInSubject.next(true);
    console.log('✅ Login state updated');
    return true;
  }

  logout(): void {
    console.log('🔴 LOGOUT CALLED - Clearing all data');
    
    this.loggedIn = false;
    this.currentUser = null;
    
    if (this.isBrowser()) {
      const currentEmail = localStorage.getItem('currentUserEmail');
      console.log('Clearing data for user:', currentEmail);
      
      // Remove from logged in users
      if (currentEmail) {
        this.removeLoggedInUser(currentEmail);
        localStorage.removeItem(`userProfile_${currentEmail}`);
      }
      
      // Clear ALL session data
      this.clearUserSession();
      this.clearAllTokens();
      
      console.log('✅ After logout - loggedIn:', localStorage.getItem('loggedIn'));
      console.log('✅ After logout - currentUserEmail:', localStorage.getItem('currentUserEmail'));
    }
    
    this.loggedInSubject.next(false);
    console.log('✅ Logout complete');
  }

  logoutUser(email: string): void {
    this.removeLoggedInUser(email);
    if (this.currentUser?.email === email) {
      this.logout();
    }
  }

  private clearAllTokens(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    const result = this.isBrowser() ? localStorage.getItem('loggedIn') === 'true' : this.loggedIn;
    return result;
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

  getCurrentUserRole(): string {
    return this.isBrowser() ? localStorage.getItem('currentUserRole') || 'user' : 'user';
  }

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  getAllUsers(): UserAccount[] {
    return this.getRegisteredUsers();
  }

  addLoggedInUser(email: string, name: string): void {
    if (!this.isBrowser()) return;
    const existingIndex = this.loggedInUsers.findIndex(u => u.email === email);
    if (existingIndex >= 0) {
      this.loggedInUsers[existingIndex].loginTime = Date.now();
    } else {
      this.loggedInUsers.push({ email, name, loginTime: Date.now() });
    }
    this.saveLoggedInUsers();
  }

  removeLoggedInUser(email: string): void {
    this.loggedInUsers = this.loggedInUsers.filter(u => u.email !== email);
    if (this.isBrowser()) this.saveLoggedInUsers();
  }

  getAllLoggedInUsers(): LoggedInUser[] {
    return [...this.loggedInUsers];
  }

  private loadLoggedInUsers(): void {
    if (!this.isBrowser()) return;
    try {
      const stored = localStorage.getItem('loggedInUsers');
      this.loggedInUsers = stored ? JSON.parse(stored) : [];
    } catch (error) {
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

  saveUserProfile(profile: UserProfile): boolean {
    if (!this.isBrowser()) return false;
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    try {
      const profileKey = `userProfile_${currentUser.email}`;
      localStorage.setItem(profileKey, JSON.stringify(profile));
      return true;
    } catch (error) {
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
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  setCurrentUser(email: string, name: string, role: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUserEmail', email);
    localStorage.setItem('currentUserName', name);
    localStorage.setItem('currentUserRole', role);
    this.loggedInSubject.next(true);
  }

  async forgotPassword(email: string): Promise<{success: boolean, message: string}> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = this.getRegisteredUsers();
    let user = registeredUsers.find(u => u.email === email);
    
    if (!user) {
      const defaultPassword = 'newpassword123';
      const userName = email.includes('@') ? email.split('@')[0] : email;
      user = { email, password: defaultPassword, name: userName, role: 'user' };
      registeredUsers.push(user);
      this.saveRegisteredUsers(registeredUsers);
    }
    
    const resetToken = this.generateResetToken();
    const resetData = {
      email,
      token: resetToken,
      expires: Date.now() + (30 * 60 * 1000)
    };
    
    if (this.isBrowser()) {
      localStorage.setItem(`resetToken_${resetToken}`, JSON.stringify(resetData));
    }
    
    try {
      const supabaseResetData = {
        email: email,
        token: resetToken,
        expires_at: new Date(Date.now() + (30 * 60 * 1000)).toISOString(),
        user_agent: navigator.userAgent,
        ip_address: 'client_ip'
      };
      
      const { data, error } = await this.supabaseAuthService.savePasswordResetRequest(supabaseResetData);
      
      if (error) {
        console.warn('⚠️ Supabase password reset save failed:', error);
      }
    } catch (error) {
      console.warn('⚠️ Supabase unavailable for password reset:', error);
    }
    
    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
    
    try {
      await this.emailService.sendForgotPasswordEmail(email, resetLink, user.name);
    } catch (error) {
      console.error('Email service error:', error);
    }
    
    return {
      success: true,
      message: 'Password reset email sent successfully!'
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{success: boolean, message: string}> {
    if (!this.isBrowser()) return { success: false, message: 'Browser environment required' };

    const resetDataStr = localStorage.getItem(`resetToken_${token}`);
    if (!resetDataStr) return { success: false, message: 'Invalid or expired reset token' };

    let resetData;
    try {
      resetData = JSON.parse(resetDataStr);
    } catch {
      return { success: false, message: 'Invalid reset token format' };
    }

    if (Date.now() > resetData.expires) {
      localStorage.removeItem(`resetToken_${token}`);
      return { success: false, message: 'Reset token has expired' };
    }

    const registeredUsers = this.getRegisteredUsers();
    let userIndex = registeredUsers.findIndex(u => u.email === resetData.email);
    
    if (userIndex === -1) {
      const userName = resetData.email.includes('@') ? resetData.email.split('@')[0] : resetData.email;
      registeredUsers.push({ email: resetData.email, password: newPassword, name: userName, role: 'user' });
    } else {
      registeredUsers[userIndex].password = newPassword;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    this.saveRegisteredUsers(registeredUsers);
    localStorage.removeItem(`resetToken_${token}`);
    
    try {
      const result = await this.supabaseAuthService.markResetTokenAsUsed(token);
      if (result.error) {
        console.warn('⚠️ Failed to mark token as used in Supabase:', result.error);
      }
    } catch (error) {
      console.warn('⚠️ Supabase unavailable for token update:', error);
    }
    
    return { success: true, message: 'Password reset successfully' };
  }

  changePassword(currentPassword: string, newPassword: string): {success: boolean, message: string} {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'No user is currently logged in' };

    const registeredUsers = this.getRegisteredUsers();
    const userIndex = registeredUsers.findIndex(u => u.email === currentUser.email);
    
    if (userIndex === -1) return { success: false, message: 'User account not found' };
    if (registeredUsers[userIndex].password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    registeredUsers[userIndex].password = newPassword;
    this.saveRegisteredUsers(registeredUsers);
    
    return { success: true, message: 'Password changed successfully' };
  }

  async supabaseForgotPassword(email: string): Promise<{success: boolean, message: string}> {
    try {
      const { data, error } = await this.supabaseAuthService.sendPasswordResetEmail(email);
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to send reset email'
        };
      }
      
      return {
        success: true,
        message: 'Password reset email sent successfully! Check your inbox.'
      };
      
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  async supabaseResetPassword(newPassword: string): Promise<{success: boolean, message: string}> {
    try {
      const { data, error } = await this.supabaseAuthService.updatePasswordWithSupabase(newPassword);
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to update password'
        };
      }
      
      const currentUser = this.supabaseAuthService.getCurrentUser();
      if (currentUser?.email) {
        this.addLoggedInUser(currentUser.email, currentUser.email.split('@')[0]);
        this.setCurrentUser(currentUser.email, currentUser.email.split('@')[0], 'user');
      }
      
      return {
        success: true,
        message: 'Password updated successfully! You are now logged in.'
      };
      
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  clearUserSession(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUserName');
    localStorage.removeItem('currentUserRole');
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('currentUserEmail');
    sessionStorage.removeItem('currentUserName');
    sessionStorage.removeItem('currentUserRole');
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  setJwtToken(token: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('jwtToken', token);
  }

  getJwtToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('jwtToken');
  }

  private async saveLoginToBackend(email: string, name: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseAuthService.saveLoginHistory(email, 'local_auth');
      
      if (error) {
        console.warn('⚠️ Failed to save login to Supabase:', error);
      }
    } catch (error) {
      console.warn('⚠️ Supabase unavailable for login history:', error);
    }
  }
}
