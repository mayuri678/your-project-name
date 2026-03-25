import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Notification } from '../../models/admin.models';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.css']
})
export class AdminNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  users: { id: string; email: string }[] = [];
  loading = true;
  sending = false;
  error = '';
  successMsg = '';
  activeTab: 'list' | 'send' = 'list';

  form = {
    user_id: '',
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    channel: 'in_app' as Notification['channel'],
    broadcast: false
  };

  readonly typeOptions = ['info', 'warning', 'success', 'error', 'announcement'];
  readonly channelOptions = ['in_app', 'email', 'both'];

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUsers();
  }

  async loadNotifications(): Promise<void> {
    this.loading = true;
    const { data, error } = await this.supabase.getAllNotifications();
    if (error) {
      this.error = 'Could not connect to Supabase. Check your connection.';
    } else {
      this.notifications = (data || []).map((n: any) => ({
        ...n,
        user_email: n.users?.email || 'All Users'
      }));
    }
    this.loading = false;
  }

  async loadUsers(): Promise<void> {
    const { data } = await this.supabase.getUsers();
    this.users = (data || []).map((u: any) => ({ id: u.id, email: u.email }));
  }

  async sendNotification(): Promise<void> {
    if (!this.form.title.trim() || !this.form.message.trim()) {
      this.error = 'Title and message are required.';
      return;
    }
    this.sending = true;
    this.error = '';
    this.successMsg = '';

    const payload = {
      title: this.form.title,
      message: this.form.message,
      type: this.form.type,
      channel: this.form.channel
    };

    let result;
    if (this.form.broadcast) {
      result = await this.supabase.sendBroadcastNotification(payload);
    } else {
      result = await this.supabase.sendNotification({
        ...payload,
        user_id: this.form.user_id || undefined
      });
    }

    if (result.error) {
      console.error('Notification error:', result.error);
      this.error = result.error.message || 'Failed to send notification. Check Supabase RLS policies.';
    } else {
      this.successMsg = this.form.broadcast
        ? 'Broadcast sent to all users!'
        : 'Notification sent successfully!';
      this.resetForm();
      await this.loadNotifications();
      setTimeout(() => { this.successMsg = ''; }, 3000);
    }
    this.sending = false;
  }

  async deleteNotification(id: string): Promise<void> {
    const { error } = await this.supabase.deleteNotification(id);
    if (!error) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }
  }

  resetForm(): void {
    this.form = { user_id: '', title: '', message: '', type: 'info', channel: 'in_app', broadcast: false };
  }

  getTypeClass(type: string): string {
    const map: Record<string, string> = {
      info: 'badge-info',
      warning: 'badge-warning',
      success: 'badge-success',
      error: 'badge-danger',
      announcement: 'badge-premium'
    };
    return map[type] || 'badge-secondary';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
  }
}
