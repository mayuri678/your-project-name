// src/app/logged-out/logged-out.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logged-out',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Logging out...</h2>`,
})
export class LoggedOutComponent {
  constructor(private router: Router) {
    // simulate logout process
    setTimeout(() => {
      this.router.navigate(['/home']); // Redirect to login page
    }, 1000);
  }
}

