import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { PasswordHistoryService } from '../../services/password-history.service';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
}

interface PasswordResetRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  requestDate: Date;
  status: 'pending' | 'completed' | 'expired';
  resetToken?: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  color: string;
  layout: string;
  features: string[];
}

@Component({
  selector: 'app-password-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './password-management.component.html',
  styleUrls: ['./password-management.component.css']
})
export class PasswordManagementComponent implements OnInit {
  users: User[] = [];
  passwordRequests: PasswordResetRequest[] = [];
  templates: Template[] = [];
  showResetModal = false;
  showBulkResetModal = false;
  showEditModal = false;
  showTemplateModal = false;
  showTemplateEditModal = false;
  showAddTemplateModal = false;
  selectedUserId: number | null = null;
  selectedUser: User | null = null;
  selectedTemplate: Template | null = null;
  isDarkMode = false;
  
  resetForm = {
    email: '',
    newPassword: '',
    confirmPassword: ''
  };

  bulkResetForm = {
    userEmails: '',
    sendEmail: true
  };

  editForm = {
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  };

  emailTemplate = {
    subject: 'Password Reset - Your Account',
    body: `Dear {{userName}},

Your password has been reset successfully.

New Password: {{newPassword}}

Please login and change your password immediately.

Best regards,
Admin Team`
  };

  templateEditForm = {
    name: '',
    category: '',
    color: '',
    layout: '',
    features: ''
  };

  addTemplateForm = {
    name: '',
    category: '',
    color: 'Blue',
    layout: '1 Column',
    features: ''
  };

  passwordPolicy = {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  };

  constructor(
    private supabaseService: SupabaseService,
    private passwordHistory: PasswordHistoryService
  ) {}

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('adminDarkMode') === 'true';
    this.loadUsers();
    this.loadTemplates();
    this.loadPasswordRequests();
    
    // Refresh every 30 seconds
    setInterval(() => {
      this.loadPasswordRequests();
    }, 30000);
  }

  loadUsers() {
    this.supabaseService.getUsers().then(result => {
      if (result.data) {
        this.users = result.data.map(user => ({
          id: user.id,
          name: user.full_name || user.email.split('@')[0],
          email: user.email,
          phone: user.phone || 'N/A',
          status: 'active' as 'active' | 'inactive',
          lastLogin: new Date(user.created_at)
        }));
      }
    }).catch(error => {
      console.error('Error loading users:', error);
      this.users = [
        {
          id: 1,
          name: 'राहुल शर्मा',
          email: 'rahul@email.com',
          phone: '9876543210',
          status: 'active',
          lastLogin: new Date('2024-01-15')
        }
      ];
    });
  }

  async loadPasswordRequests() {
    try {
      // Use existing method from SupabaseService
      const result = await this.supabaseService.getPasswordResetRequests();
      
      if (result.data && result.data.length > 0) {
        this.passwordRequests = result.data.map((request: any, index: number) => ({
          id: request.id || index + 1,
          userId: request.id || index + 1,
          userName: request.user_name || request.email.split('@')[0],
          userEmail: request.email,
          requestDate: new Date(request.requested_at),
          status: request.used ? 'completed' : 'pending',
          resetToken: undefined
        }));
        console.log('✅ Loaded', this.passwordRequests.length, 'password reset requests');
      } else {
        console.log('📝 No password reset requests found');
        this.passwordRequests = [];
      }
    } catch (error) {
      console.error('❌ Error:', error);
      this.passwordRequests = [];
    }
  }

  openResetModal(userId?: number) {
    this.showResetModal = true;
    this.selectedUserId = userId || null;
    
    if (userId) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        this.resetForm.email = user.email;
      }
    }
    
    this.resetForm.newPassword = '';
    this.resetForm.confirmPassword = '';
  }

  async resetPassword() {
    if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.validatePassword(this.resetForm.newPassword)) {
      alert('Password must be at least 6 characters!');
      return;
    }

    try {
      // First try to send Supabase password reset email
      const resetResult = await this.supabaseService.adminResetPassword(
        this.resetForm.email, 
        this.resetForm.newPassword
      );
      
      if (resetResult.success) {
        alert(`✅ Password reset email sent to ${this.resetForm.email}\n\nThe user will receive an email with a reset link.`);
        
        const request = this.passwordRequests.find(r => r.userEmail === this.resetForm.email && r.status === 'pending');
        if (request) {
          request.status = 'completed';
        }
        
        await this.supabaseService.logPasswordChangeActivity(this.resetForm.email, 'admin_reset', 'admin@example.com');
        this.passwordHistory.logPasswordChange({
          userId: request?.userId.toString() || '',
          userEmail: this.resetForm.email,
          userName: request?.userName || this.resetForm.email,
          changeType: 'admin_reset',
          changedBy: 'admin@example.com'
        });
        
        this.closeResetModal();
        return;
      }
      
      // Fallback to direct password update
      const result = await this.supabaseService.updateUserPasswordByEmail(
        this.resetForm.email, 
        this.resetForm.newPassword
      );
      
      if (result.success) {
        alert(`✅ Password successfully reset for ${this.resetForm.email}\n\nNew Password: ${this.resetForm.newPassword}`);
        
        const request = this.passwordRequests.find(r => r.userEmail === this.resetForm.email && r.status === 'pending');
        if (request) {
          request.status = 'completed';
        }
        
        await this.supabaseService.logPasswordChangeActivity(this.resetForm.email, 'admin_reset', 'admin@example.com');
        this.passwordHistory.logPasswordChange({
          userId: request?.userId.toString() || '',
          userEmail: this.resetForm.email,
          userName: request?.userName || this.resetForm.email,
          changeType: 'admin_reset',
          changedBy: 'admin@example.com'
        });
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('❌ Failed to reset password');
    }
    
    this.closeResetModal();
  }

  async sendResetLink(email: string) {
    try {
      // First try to send Supabase password reset email
      const resetResult = await this.supabaseService.adminResetPassword(email, '');
      
      if (resetResult.success) {
        alert(`✅ Password reset email sent to ${email}\n\nThe user will receive an email with a reset link.`);
        
        // Update the request status
        const request = this.passwordRequests.find(r => r.userEmail === email && r.status === 'pending');
        if (request) {
          request.status = 'completed';
        }
        
        // Log the password reset request
        await this.supabaseService.logPasswordChangeActivity(email, 'admin_reset', 'admin@example.com');
        
        return;
      }
      
      // Fallback to temporary password method
      const tempPassword = this.generateRandomPassword();
      const result = await this.supabaseService.updateUserPasswordByEmail(email, tempPassword);
      
      if (result.success) {
        alert(`✅ Password reset for ${email}:\n\nNew Temporary Password: ${tempPassword}\n\nNote: User should change this password after login.`);
        
        const request = this.passwordRequests.find(r => r.userEmail === email && r.status === 'pending');
        if (request) {
          request.resetToken = tempPassword;
          request.status = 'completed';
        }
        
        // Log the password change
        await this.supabaseService.logPasswordChangeActivity(email, 'admin_reset', 'admin@example.com');
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      alert('❌ Failed to send password reset');
    }
  }

  updateRequestStatus(requestId: number, status: 'completed' | 'expired') {
    const request = this.passwordRequests.find(r => r.id === requestId);
    if (request) {
      request.status = status;
    }
  }

  openBulkResetModal() {
    this.showBulkResetModal = true;
    this.bulkResetForm = {
      userEmails: '',
      sendEmail: true
    };
  }

  async bulkPasswordReset() {
    const emails = this.bulkResetForm.userEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    if (emails.length === 0) {
      alert('Please enter at least one email address');
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    let results = [];
    
    for (const email of emails) {
      try {
        const newPassword = this.generateRandomPassword();
        const result = await this.supabaseService.updateUserPasswordByEmail(email, newPassword);
        
        if (result.success) {
          results.push(`✅ ${email}: ${newPassword}`);
          successCount++;
        } else {
          results.push(`❌ ${email}: ${result.error}`);
          errorCount++;
        }
      } catch (error) {
        results.push(`❌ ${email}: Update failed`);
        errorCount++;
      }
    }
    
    const resultMessage = `Bulk Password Reset Results:\n\n${results.join('\n')}\n\n✅ Success: ${successCount}\n❌ Failed: ${errorCount}`;
    alert(resultMessage);
    this.closeBulkResetModal();
  }

  closeResetModal() {
    this.showResetModal = false;
    this.selectedUserId = null;
    this.resetForm = {
      email: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  closeBulkResetModal() {
    this.showBulkResetModal = false;
  }

  openEditModal(userId: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.selectedUser = user;
      this.editForm = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status
      };
      this.showEditModal = true;
    }
  }

  async updateUserInfo() {
    if (!this.selectedUser) return;

    try {
      // Update user in the local array
      const userIndex = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = {
          ...this.users[userIndex],
          name: this.editForm.name,
          email: this.editForm.email,
          phone: this.editForm.phone,
          status: this.editForm.status
        };
        
        alert('✅ User information updated successfully!');
        this.closeEditModal();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('❌ Failed to update user information');
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editForm = {
      name: '',
      email: '',
      phone: '',
      status: 'active'
    };
  }

  openTemplateModal() {
    this.showTemplateModal = true;
  }

  saveTemplate() {
    alert('✅ Email template saved successfully!');
    this.closeTemplateModal();
  }

  closeTemplateModal() {
    this.showTemplateModal = false;
  }

  loadTemplates() {
    this.templates = [
      {
        id: '2565f24e-2fc0-4827-a2d9-cb121e0e206b',
        name: 'bhargavi kulkarni',
        category: 'template1',
        color: 'Blue',
        layout: '1 Column',
        features: ['Feature 1', 'Feature 2']
      }
    ];
  }

  openTemplateEditModal(template: Template) {
    this.selectedTemplate = template;
    this.templateEditForm = {
      name: template.name,
      category: template.category,
      color: template.color,
      layout: template.layout,
      features: template.features.join(', ')
    };
    this.showTemplateEditModal = true;
  }

  saveTemplateChanges() {
    if (!this.selectedTemplate) return;
    
    const templateIndex = this.templates.findIndex(t => t.id === this.selectedTemplate!.id);
    if (templateIndex !== -1) {
      this.templates[templateIndex] = {
        ...this.selectedTemplate,
        name: this.templateEditForm.name,
        category: this.templateEditForm.category,
        color: this.templateEditForm.color,
        layout: this.templateEditForm.layout,
        features: this.templateEditForm.features.split(',').map(f => f.trim())
      };
      
      alert('✅ Template updated successfully!');
      this.closeTemplateEditModal();
    }
  }

  closeTemplateEditModal() {
    this.showTemplateEditModal = false;
    this.selectedTemplate = null;
  }

  openAddTemplateModal() {
    this.addTemplateForm = {
      name: '',
      category: '',
      color: 'Blue',
      layout: '1 Column',
      features: ''
    };
    this.showAddTemplateModal = true;
  }

  addNewTemplate() {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name: this.addTemplateForm.name,
      category: this.addTemplateForm.category,
      color: this.addTemplateForm.color,
      layout: this.addTemplateForm.layout,
      features: this.addTemplateForm.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
    };
    
    this.templates.push(newTemplate);
    alert('✅ Template added successfully!');
    this.closeAddTemplateModal();
  }

  closeAddTemplateModal() {
    this.showAddTemplateModal = false;
  }

  generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  generatePassword() {
    this.resetForm.newPassword = this.generateRandomPassword();
    this.resetForm.confirmPassword = this.resetForm.newPassword;
  }

  generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  validatePassword(password: string): boolean {
    return password.length >= this.passwordPolicy.minLength;
  }

  getPasswordStrength(password: string): string {
    if (password.length < 6) return 'Weak';
    if (password.length < 8) return 'Medium';
    return 'Strong';
  }

  getRequestStats() {
    return {
      total: this.passwordRequests.length,
      pending: this.passwordRequests.filter(r => r.status === 'pending').length,
      completed: this.passwordRequests.filter(r => r.status === 'completed').length,
      expired: this.passwordRequests.filter(r => r.status === 'expired').length
    };
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('adminDarkMode', this.isDarkMode.toString());
  }
}