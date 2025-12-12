import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
    constructor(private router: Router, public authService: AuthService) {}

    goToLogin() {
      this.router.navigate([{ outlets: { modal: ['login'] } }]);
    }

    onLogout() {
      this.authService.logout();
      this.router.navigate(['/logged-out']);
    }

    goToTemplates() {
      if (this.authService.isLoggedIn()) {
        // Navigate to templates page for better template selection experience
        this.router.navigate(['/templates']);
      } else {
        this.router.navigate([{ outlets: { modal: ['login'] } }]);
      }
    }

    // Alternative method to go directly to resume builder
    createResumeDirectly() {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/resume']);
      } else {
        this.router.navigate([{ outlets: { modal: ['login'] } }]);
      }
    }
  }

