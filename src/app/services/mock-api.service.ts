import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private users: MockUser[] = [
    {
      id: '1',
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main St, City, Country',
      avatar: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      phone: '+0987654321',
      address: '456 Admin Ave, City, Country'
    }
  ];

  private currentToken: string | null = null;
  private currentUserId: string | null = null;

  login(email: string, password: string): Observable<any> {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Generate a mock JWT token
      this.currentToken = this.generateMockToken(user.id);
      this.currentUserId = user.id;
      
      return of({
        token: this.currentToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }).pipe(delay(500)); // Simulate network delay
    } else {
      return throwError(() => ({
        error: { message: 'Invalid email or password' },
        status: 401
      })).pipe(delay(500));
    }
  }

  getProfile(token: string): Observable<any> {
    if (!this.isValidToken(token)) {
      return throwError(() => ({
        error: { message: 'Invalid or expired token' },
        status: 401
      })).pipe(delay(300));
    }

    const userId = this.getUserIdFromToken(token);
    const user = this.users.find(u => u.id === userId);

    if (user) {
      const { password, ...userProfile } = user;
      return of(userProfile).pipe(delay(300));
    } else {
      return throwError(() => ({
        error: { message: 'User not found' },
        status: 404
      })).pipe(delay(300));
    }
  }

  private generateMockToken(userId: string): string {
    // This is a mock token - in real implementation, this would be a proper JWT
    return `mock-jwt-token-${userId}-${Date.now()}`;
  }

  private isValidToken(token: string): boolean {
    // Simple validation for mock token
    return !!token && token.startsWith('mock-jwt-token-');
  }

  private getUserIdFromToken(token: string): string | null {
    // Extract user ID from mock token
    const parts = token.split('-');
    return parts.length >= 4 ? parts[3] : null;
  }
}