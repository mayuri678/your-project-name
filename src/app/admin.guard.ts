import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './services/admin.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  if (adminService.isAdminLoggedIn()) {
    const currentAdmin = adminService.getCurrentAdmin();
    if (currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'editor')) {
      return true;
    }
  }

  router.navigate(['/admin/login']);
  return false;
};