import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserAccount } from '../auth.service';

@Component({
  selector: 'app-test-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>All Registered Users</h2>
      <div class="users-list">
        <div class="user-card" *ngFor="let user of users">
          <h3>{{ user.name }}</h3>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Password:</strong> {{ user.password }}</p>
          <p><strong>Role:</strong> {{ user.role || 'user' }}</p>
        </div>
      </div>
      <p class="total">Total Users: {{ users.length }}</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .users-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .user-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: #f9f9f9;
    }
    .user-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .user-card p {
      margin: 5px 0;
      font-size: 14px;
    }
    .total {
      text-align: center;
      font-weight: bold;
      margin-top: 20px;
    }
  `]
})
export class TestUsersComponent implements OnInit {
  users: UserAccount[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.authService.getAllUsers();
  }
}