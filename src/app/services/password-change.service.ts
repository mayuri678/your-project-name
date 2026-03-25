import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // Validate password strength
  validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least 1 number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least 1 special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate form data
  validateForm(data: ChangePasswordRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.newPassword?.trim()) {
      errors.push('New password is required');
    }

    if (!data.confirmPassword?.trim()) {
      errors.push('Confirm password is required');
    }

    if (data.newPassword !== data.confirmPassword) {
      errors.push('New password and confirm password do not match');
    }

    if (data.newPassword && data.currentPassword === data.newPassword) {
      errors.push('New password must be different from current password');
    }

    if (data.newPassword) {
      const strengthCheck = this.validatePasswordStrength(data.newPassword);
      if (!strengthCheck.valid) {
        errors.push(...strengthCheck.errors);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Change password via API
  changePassword(data: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.post<ChangePasswordResponse>(
      `${this.apiUrl}/change-password`,
      data,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Change password error:', error);
        return throwError(() => ({
          success: false,
          message: error.error?.message || 'Failed to change password',
          error: error.error
        }));
      })
    );
  }

  // Change password locally (for localStorage-based auth)
  changePasswordLocally(email: string, newPassword: string): { success: boolean; message: string } {
    try {
      const registeredUsersStr = localStorage.getItem('registeredUsers');
      if (!registeredUsersStr) {
        return { success: false, message: 'No registered users found' };
      }

      const registeredUsers = JSON.parse(registeredUsersStr);
      const userIndex = registeredUsers.findIndex((u: any) => u.email === email);

      if (userIndex === -1) {
        return { success: false, message: 'User not found' };
      }

      registeredUsers[userIndex].password = newPassword;
      registeredUsers[userIndex].passwordChangedAt = new Date().toISOString();
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return { success: false, message: 'An error occurred while changing password' };
    }
  }

  // Get auth token
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  // Get password change history
  getPasswordChangeHistory(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get(
      `${this.apiUrl}/password-change-history`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Get password history error:', error);
        return throwError(() => error);
      })
    );
  }
}
