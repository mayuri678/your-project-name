import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ResumeTemplate } from '../../models/admin.models';

@Component({
  selector: 'app-template-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-management.component.html',
  styleUrls: ['./template-management.component.css']
})
export class TemplateManagementComponent implements OnInit {
  templates: ResumeTemplate[] = [];
  filteredTemplates: ResumeTemplate[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedType = '';
  showCreateForm = false;
  isLoading = false;

  categories = ['Professional', 'Creative', 'Modern', 'Classic', 'Technical'];
  
  newTemplate: Partial<ResumeTemplate> = {
    name: '',
    description: '',
    category: '',
    isPremium: false,
    price: 0,
    isActive: true
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.adminService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTemplates = this.templates.filter(template => {
      const matchesSearch = !this.searchTerm || 
        template.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || template.category === this.selectedCategory;
      
      const matchesType = !this.selectedType || 
        (this.selectedType === 'premium' && template.isPremium) ||
        (this.selectedType === 'free' && !template.isPremium);

      return matchesSearch && matchesCategory && matchesType;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  onTypeFilterChange(): void {
    this.applyFilters();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newTemplate = {
      name: '',
      description: '',
      category: '',
      isPremium: false,
      price: 0,
      isActive: true
    };
  }

  createTemplate(): void {
    if (!this.newTemplate.name || !this.newTemplate.category) {
      return;
    }

    this.adminService.createTemplate(this.newTemplate as Omit<ResumeTemplate, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>).subscribe({
      next: (template) => {
        this.templates.push(template);
        this.applyFilters();
        this.toggleCreateForm();
      },
      error: (error) => {
        console.error('Error creating template:', error);
      }
    });
  }

  toggleTemplateStatus(templateId: string): void {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      const updates = { isActive: !template.isActive };
      this.adminService.updateTemplate(templateId, updates).subscribe({
        next: (success) => {
          if (success) {
            template.isActive = !template.isActive;
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error updating template:', error);
        }
      });
    }
  }

  deleteTemplate(templateId: string): void {
    if (confirm('Are you sure you want to delete this template?')) {
      this.adminService.deleteTemplate(templateId).subscribe({
        next: (success) => {
          if (success) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.applyFilters();
          }
        },
        error: (error) => {
          console.error('Error deleting template:', error);
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}