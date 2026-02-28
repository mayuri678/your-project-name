import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserAccount } from '../auth.service';

@Component({
  selector: 'app-debug-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: monospace;">
      <h2>Debug: Registered Users</h2>
      <button (click)="loadUsers()" style="padding: 10px; margin: 10px 0;">Refresh Users</button>
      <button (click)="clearAll()" style="padding: 10px; margin: 10px; background: red; color: white;">Clear All Users</button>
      
      <h3>Total Users: {{ users.length }}</h3>
      
      <div *ngFor="let user of users" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; background: #f5f5f5;">
        <div><strong>Email:</strong> {{ user.email }}</div>
        <div><strong>Password:</strong> {{ user.password }}</div>
        <div><strong>Name:</strong> {{ user.name }}</div>
        <div><strong>Role:</strong> {{ user.role }}</div>
      </div>
      
      <div *ngIf="users.length === 0" style="padding: 20px; background: #ffe6e6;">
        No users registered yet!
      </div>
    </div>
  `
})
export class DebugUsersComponent implements OnInit {
  users: UserAccount[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.authService.getAllUsers();
    console.log('📋 All registered users:', this.users);
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear all users?')) {
      localStorage.removeItem('registeredUsers');
      this.loadUsers();
      alert('All users cleared! The default users will be reloaded on next page refresh.');
    }
  }
}
