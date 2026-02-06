import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MockApiService } from './mock-api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class JwtAuthService {
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private mockApi: MockApiService) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.mockApi.login(credentials.email, credentials.password)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  getProfile(): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return this.mockApi.getProfile(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}