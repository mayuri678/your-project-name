  import { Component } from '@angular/core';
  import { Router, RouterModule } from '@angular/router';
  import { HeaderComponent } from '../header/header.component';
  import { FooterComponent } from '../footer/footer.component';
  import { AuthService } from '../auth.service';

  @Component({
    selector: 'app-about',
    standalone: true,
    imports: [RouterModule, HeaderComponent, FooterComponent],
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
        this.router.navigate(['/resume']);
      } else {
        this.router.navigate([{ outlets: { modal: ['login'] } }]);
      }
    }
  }

