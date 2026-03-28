import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { SupabaseService } from '../../services/supabase.service';
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

  constructor(
    private adminService: AdminService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  async loadUsers(): Promise<void> {
    this.isLoading = true;
    try {
      const result = await this.supabaseService.getUsers();
      if (result.data && result.data.length > 0) {
        this.users = result.data.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.full_name || user.email.split('@')[0],
          role: 'user' as AdminUser['role'],
          isActive: true,
          createdAt: new Date(user.created_at),
          lastLogin: user.updated_at ? new Date(user.updated_at) : undefined
        }));
      } else {
        this.users = [];
      }
      this.applyFilters();
    } catch {
      this.users = [];
      this.filteredUsers = [];
    } finally {
      this.isLoading = false;
    }
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