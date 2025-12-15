import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showTemplateManager = false;

  constructor(private authService: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogout(): void {
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