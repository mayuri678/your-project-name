import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Password Reset Requests</h2>
    <button (click)="loadRequests()">Refresh</button>
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" style="color: red;">{{ error }}</div>
    <div *ngIf="!loading && resetRequests.length === 0">No requests found</div>
    <table *ngIf="!loading && resetRequests.length > 0">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Requested At</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let request of resetRequests">
          <td>{{ request.username }}</td>
          <td>{{ request.email }}</td>
          <td>{{ request.requested_at | date:'medium' }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  `]
})
export class AdminComponent implements OnInit {
  resetRequests: any[] = [];
  loading = true;
  error = '';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    this.loading = true;
    try {
      const { data, error } = await this.authService.getPasswordResetRequests();
      if (error) {
        this.error = error.message;
      } else {
        this.resetRequests = data || [];
        console.log('Reset requests:', this.resetRequests);
      }
    } catch (err) {
      this.error = 'Failed to load requests';
      console.error('Error:', err);
    }
    this.loading = false;
  }
}