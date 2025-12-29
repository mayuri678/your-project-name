import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserDataService } from './services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Clear all user data when accessing logout route
    this.userDataService.clearCurrentUserData();
    this.authService.logout();
    
    // Redirect to logged-out page
    this.router.navigate(['/logged-out']);
    return false; // Prevent navigation to the logout route itself
  }
}