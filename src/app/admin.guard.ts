import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is logged in
  if (!authService.isLoggedIn()) {
    // Redirect to login if not logged in
    router.navigate([{ outlets: { modal: ['login'] } }]);
    return false;
  }

  // Check if user has admin role
  if (authService.isAdmin()) {
    return true;
  }

  // Show error and redirect to home if not admin
  if (typeof window !== 'undefined') {
    alert('Access Denied: Admin privileges required!');
  }
  router.navigate(['/home']);
  return false;
};