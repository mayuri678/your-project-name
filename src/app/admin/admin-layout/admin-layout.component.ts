import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/admin.models';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  currentAdmin: AdminUser | null = null;
  loggedIn = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.adminService.isAdminLoggedIn()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    this.currentAdmin = this.adminService.getCurrentAdmin();
    this.loggedIn = this.authService.isLoggedIn();
  }

  logout(): void {
    this.adminService.adminLogout();
    this.router.navigate(['/home']);
  }
}