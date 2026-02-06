import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { UserDataService } from './services/user-data.service';
import { SupabaseService } from './services/supabase.service';

import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showTemplateManager = false;

  constructor(
    private authService: AuthService, 
    private userDataService: UserDataService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Supabase will automatically handle URL detection and redirect
    // No need for global auth state handling
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogout(): void {
    // Clear current user's data before logout
    this.userDataService.clearCurrentUserData();
    this.authService.logout();
    this.router.navigate(['/logged-out']);
  }

  onTemplatesClick(): void {
    this.showTemplateManager = true;
  }

  onCloseTemplateManager(): void {
    this.showTemplateManager = false;
  }
}