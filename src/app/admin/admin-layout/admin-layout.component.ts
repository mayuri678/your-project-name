import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/admin.models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  currentAdmin: AdminUser | null = null;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if admin is logged in
    if (!this.adminService.isAdminLoggedIn()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    
    this.currentAdmin = this.adminService.getCurrentAdmin();
  }

  logout(): void {
    this.adminService.adminLogout();
    this.router.navigate(['/admin/login']);
  }
}