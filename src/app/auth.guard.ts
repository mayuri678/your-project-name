import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    // Let the target route render, but also open the login modal on top
    // Use microtask to avoid NavigationCancel due to redirect during guard
    Promise.resolve().then(() => {
      router.navigate([{ outlets: { modal: ['login'] } }]);
    });
  }
  return true;
};
