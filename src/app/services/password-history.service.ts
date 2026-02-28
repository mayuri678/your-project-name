import { Injectable } from '@angular/core';

export interface PasswordChangeLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  changeType: 'change' | 'reset' | 'admin_reset';
  changedBy: string;
  timestamp: Date;
  ipAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordHistoryService {
  private readonly STORAGE_KEY = 'password_change_history';

  logPasswordChange(log: Omit<PasswordChangeLog, 'id' | 'timestamp'>): void {
    const history = this.getHistory();
    const newLog: PasswordChangeLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    history.unshift(newLog);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  getHistory(): PasswordChangeLog[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getUserHistory(userEmail: string): PasswordChangeLog[] {
    return this.getHistory().filter(log => log.userEmail === userEmail);
  }

  getLastPasswordChange(userEmail: string): PasswordChangeLog | null {
    const userHistory = this.getUserHistory(userEmail);
    return userHistory.length > 0 ? userHistory[0] : null;
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
