import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private authService: SupabaseAuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/supabase-login']);
          return false;
        }
      })
    );
  }
}