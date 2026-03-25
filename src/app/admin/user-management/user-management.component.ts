import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models/admin.models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  searchTerm = '';

  selectedStatus = '';
  isLoading = false;
  private refreshInterval: any;

  statuses = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    console.log('[UserManagement] Component initialized');
    this.loadUsers();
    
    // Auto-refresh every 3 seconds
    this.refreshInterval = setInterval(() => {
      console.log('[UserManagement] Auto-refreshing users...');
      this.loadUsers();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      console.log('[UserManagement] Auto-refresh stopped');
    }
  }

  loadUsers(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    console.log('[UserManagement] Loading users...');
    
    this.adminService.getUsers().subscribe({
      next: (users) => {
        console.log('[UserManagement] Users loaded:', users.length);
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[UserManagement] Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = true;
      
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && user.isActive) ||
        (this.selectedStatus === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }



  onStatusFilterChange(): void {
    this.applyFilters();
  }







  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getActiveUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  toggleUserStatus(userId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      const action = user.isActive ? 'deactivate' : 'activate';
      const confirmMessage = user.isActive 
        ? `Are you sure you want to deactivate ${user.name}?`
        : `Are you sure you want to activate ${user.name}?`;
      
      if (confirm(confirmMessage)) {
        this.adminService.toggleUserStatus(userId).subscribe({
          next: (success) => {
            if (success) {
              user.isActive = !user.isActive;
              this.applyFilters();
              alert(`User ${action}d successfully!`);
            } else {
              alert(`Failed to ${action} user`);
            }
          },
          error: (error) => {
            console.error(`Error ${action}ing user:`, error);
            alert(`Error ${action}ing user`);
          }
        });
      }
    }
  }


}