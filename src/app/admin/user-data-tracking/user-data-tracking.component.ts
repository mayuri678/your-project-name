import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { SupabaseService } from '../../services/supabase.service';

interface UserActivity {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  templateId: string;
  templateName: string;
  templateCategory: string;
  action: 'created' | 'updated' | 'downloaded' | 'deleted';
  timestamp: Date;
  resumeData?: any;
}

@Component({
  selector: 'app-user-data-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-data-tracking.component.html',
  styleUrls: ['./user-data-tracking.component.css']
})
export class UserDataTrackingComponent implements OnInit {
  userActivity: UserActivity[] = [];
  filteredActivity: UserActivity[] = [];
  paginatedActivity: UserActivity[] = [];
  
  searchTerm = '';
  selectedAction = '';
  selectedTemplate = '';
  
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  isLoading = false;
  showResumeModal = false;
  selectedActivity: UserActivity | null = null;
  
  totalUsers = 0;
  totalResumes = 0;
  mostUsedTemplate = '';
  todayActivity = 0;
  uniqueTemplates: string[] = [];

  constructor(
    private adminService: AdminService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.loadUserActivity();
  }

  loadUserActivity(): void {
    this.isLoading = true;
    
    this.supabaseService.getAllTemplates().then((result: any) => {
      if (result.data) {
        this.userActivity = result.data.map((template: any) => {
          let resumeData: any = {};
          let userName = 'Unknown User';
          let userEmail = 'user@example.com';
          
          try {
            if (template.description) {
              resumeData = JSON.parse(template.description);
              userName = resumeData.name || resumeData.fullName || 'Unknown User';
              userEmail = resumeData.email || 'user@example.com';
            }
          } catch (e) {
            // Use defaults
          }
          
          return {
            id: template.id,
            userId: template.user_id || 'unknown',
            userEmail: userEmail,
            userName: userName,
            templateId: template.id,
            templateName: template.title || 'Untitled Resume',
            templateCategory: this.getCategoryName(template.category),
            action: 'created' as const,
            timestamp: new Date(template.created_at),
            resumeData: resumeData
          };
        });
        
        this.calculateStatistics();
        this.applyFilters();
      }
      this.isLoading = false;
    }).catch(() => {
      this.generateMockData();
      this.isLoading = false;
    });
  }

  generateMockData(): void {
    const mockUsers = ['john.doe@email.com', 'jane.smith@email.com', 'mike.wilson@email.com'];
    const mockTemplates = ['Professional Template', 'Creative Template', 'Modern Template'];
    const mockCategories = ['Professional', 'Creative', 'Modern'];
    const actions: ('created' | 'updated' | 'downloaded')[] = ['created', 'updated', 'downloaded'];
    
    this.userActivity = [];
    
    for (let i = 0; i < 25; i++) {
      const userIndex = Math.floor(Math.random() * mockUsers.length);
      const templateIndex = Math.floor(Math.random() * mockTemplates.length);
      const actionIndex = Math.floor(Math.random() * actions.length);
      
      this.userActivity.push({
        id: `activity_${i + 1}`,
        userId: `user_${userIndex + 1}`,
        userEmail: mockUsers[userIndex],
        userName: mockUsers[userIndex].split('@')[0].replace('.', ' '),
        templateId: `template_${templateIndex + 1}`,
        templateName: mockTemplates[templateIndex],
        templateCategory: mockCategories[templateIndex],
        action: actions[actionIndex],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        resumeData: {
          name: mockUsers[userIndex].split('@')[0].replace('.', ' '),
          email: mockUsers[userIndex],
          phone: '+91 98765 43210',
          experience: 'Software Developer with 3+ years experience',
          education: 'B.Tech Computer Science'
        }
      });
    }
    
    this.calculateStatistics();
    this.applyFilters();
  }

  calculateStatistics(): void {
    const uniqueUsers = new Set(this.userActivity.map(a => a.userEmail));
    this.totalUsers = uniqueUsers.size;
    this.totalResumes = this.userActivity.filter(a => a.action === 'created').length;
    
    const templateCounts = this.userActivity.reduce((acc, activity) => {
      acc[activity.templateName] = (acc[activity.templateName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    this.mostUsedTemplate = Object.keys(templateCounts).reduce((a, b) => 
      templateCounts[a] > templateCounts[b] ? a : b, 'None'
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todayActivity = this.userActivity.filter(a => 
      new Date(a.timestamp) >= today
    ).length;
    
    this.uniqueTemplates = [...new Set(this.userActivity.map(a => a.templateName))];
  }

  applyFilters(): void {
    this.filteredActivity = this.userActivity.filter(activity => {
      const matchesSearch = !this.searchTerm || 
        activity.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        activity.userName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesAction = !this.selectedAction || activity.action === this.selectedAction;
      const matchesTemplate = !this.selectedTemplate || activity.templateName === this.selectedTemplate;
      
      return matchesSearch && matchesAction && matchesTemplate;
    });
    
    this.totalPages = Math.ceil(this.filteredActivity.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedActivity = this.filteredActivity.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getUserInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  getActionIcon(action: string): string {
    const icons = {
      'created': '✨',
      'updated': '✏️',
      'downloaded': '📥',
      'deleted': '🗑️'
    };
    return icons[action as keyof typeof icons] || '📄';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN');
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  viewResumeData(activity: UserActivity): void {
    this.selectedActivity = activity;
    this.showResumeModal = true;
  }

  closeResumeModal(): void {
    this.showResumeModal = false;
    this.selectedActivity = null;
  }

  formatResumeData(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  downloadResume(activity: UserActivity): void {
    if (activity.resumeData) {
      const dataStr = JSON.stringify(activity.resumeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activity.userName}_resume_data.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  private getCategoryName(categoryId: string): string {
    const categoryMap: { [key: string]: string } = {
      'template1': 'Professional',
      'template2': 'Creative', 
      'template3': 'Modern',
      'template4': 'Classic',
      'template5': 'Technical'
    };
    return categoryMap[categoryId] || 'Professional';
  }
}