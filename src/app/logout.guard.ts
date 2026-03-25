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
    this.userDataService.clearCurrentUserData();
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
