import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const email = route.queryParams['email'];
    const verified = route.queryParams['verified'];
    
    if (!email || verified !== 'true' || !this.passwordResetService.isOtpVerified(email)) {
      this.router.navigate(['/supabase-forgot-password']);
      return false;
    }
    
    return true;
  }
}