import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  selectedTemplates: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedType = '';
  showCreateForm = false;
  isLoading = false;
  editingTemplate: ResumeTemplate | null = null;
  showEditForm = false;
  createError: string | null = null;
  createSuccess: string | null = null;

  categories = ['Professional', 'Creative', 'Modern', 'Classic', 'Technical'];
  colors = ['Blue', 'Green', 'Red', 'Purple', 'Orange', 'Black', 'Gray'];
  layouts = ['1 Column', '2 Column', '3 Column', 'Mixed Layout'];
  features = ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio'];
  
  newTemplate: Partial<ResumeTemplate> = {
    name: '',
    description: '',
    category: '',
    color: 'Blue',
    layout: '1 Column',
    templateFeatures: ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio'],
    isPremium: false,
    price: 0,
    isActive: true
  };

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadTemplates();
    
    // Check if we need to refresh templates
    if (typeof window !== 'undefined') {
      const shouldRefresh = localStorage.getItem('refreshTemplates');
      if (shouldRefresh) {
        localStorage.removeItem('refreshTemplates');
        setTimeout(() => this.loadTemplates(), 500);
      }
    }
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.templates = []; // Clear existing templates
    this.filteredTemplates = []; // Clear filtered templates
    console.log('Loading templates...');
    
    this.adminService.getTemplates().subscribe({
      next: (templates) => {
        console.log('Templates loaded:', templates);
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
    this.showEditForm = false;
    this.editingTemplate = null;
    this.createError = null;
    this.createSuccess = null;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newTemplate = {
      name: '',
      description: '',
      category: '',
      color: 'Blue',
      layout: '1 Column',
      templateFeatures: ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio'],
      isPremium: false,
      price: 0,
      isActive: true
    };
  }

  createTemplate(): void {
    if (!this.newTemplate.name || !this.newTemplate.category) {
      this.createError = 'Template name आणि category required आहे!';
      return;
    }

    this.createError = null;
    this.createSuccess = null;
    this.isLoading = true;

    console.log('Creating template with data:', this.newTemplate);

    this.adminService.createTemplate(this.newTemplate as Omit<ResumeTemplate, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>).subscribe({
      next: (template) => {
        console.log('✅ Template created successfully:', template);
        
        // Add to templates list immediately
        this.templates.unshift(template); // Add at beginning
        this.applyFilters();
        
        // Show success message
        this.createSuccess = `✅ Template "${template.name}" यशस्वीरित्या तयार झाला!`;
        
        // Close form after 2 seconds
        setTimeout(() => {
          this.toggleCreateForm();
          this.createSuccess = null;
        }, 2000);
        
        this.isLoading = false;
        
        // Force refresh templates to ensure sync
        setTimeout(() => {
          this.refreshTemplates();
        }, 1000);
      },
      error: (error) => {
        console.error('❌ Error creating template:', error);
        
        let errorMsg = 'Template create करताना त्रुटी आली.';
        if (error?.message?.includes('not authenticated')) {
          errorMsg = 'Authentication त्रुटी! Admin login करा.';
        } else if (error?.message) {
          errorMsg = error.message;
        }
        
        this.createError = errorMsg;
        this.isLoading = false;
      }
    });
  }

  openTemplate(templateId: string): void {
    this.router.navigate(['/admin/template-editor', templateId]);
  }

  openTemplateEditor(templateId: string): void {
    console.log('Navigating to template editor with ID:', templateId);
    window.location.href = `/admin/template-editor/${templateId}`;
  }

  previewTemplate(templateId: string): void {
    // Open template in new tab for preview
    const previewUrl = `/templates/preview/${templateId}`;
    window.open(previewUrl, '_blank');
  }

  duplicateTemplate(template: ResumeTemplate): void {
    const duplicatedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined, // Will be generated by service
      createdAt: undefined,
      updatedAt: undefined,
      downloadCount: 0
    };
    
    delete duplicatedTemplate.id;
    delete duplicatedTemplate.createdAt;
    delete duplicatedTemplate.updatedAt;
    
    this.adminService.createTemplate(duplicatedTemplate).subscribe({
      next: (newTemplate) => {
        this.templates.push(newTemplate);
        this.applyFilters();
        alert(`Template "${template.name}" successfully duplicated!`);
      },
      error: (error) => {
        console.error('Error duplicating template:', error);
        alert('Error occurred while duplicating template');
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

  editTemplate(template: ResumeTemplate): void {
    this.editingTemplate = {
      id: template.id,
      name: template.name,
      description: template.description || '',
      category: template.category,
      color: template.color || 'Blue',
      layout: template.layout || '1 Column',
      templateFeatures: template.templateFeatures || [],
      isPremium: template.isPremium,
      price: template.price || 0,
      isActive: template.isActive,
      downloadCount: template.downloadCount,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    };
    
    this.showEditForm = true;
    this.showCreateForm = false;
    console.log('Editing template:', this.editingTemplate);
  }

  updateTemplate(): void {
    if (!this.editingTemplate || !this.editingTemplate.name) {
      alert('Template name is required!');
      return;
    }

    console.log('Updating template:', this.editingTemplate);

    const updates = {
      name: this.editingTemplate.name.trim(),
      description: this.editingTemplate.description?.trim() || '',
      category: this.editingTemplate.category,
      color: this.editingTemplate.color,
      layout: this.editingTemplate.layout,
      templateFeatures: this.editingTemplate.templateFeatures,
      isPremium: this.editingTemplate.isPremium,
      price: this.editingTemplate.price || 0,
      isActive: this.editingTemplate.isActive
    };

    console.log('Updates to apply:', updates);

    this.isLoading = true;
    
    this.adminService.updateTemplate(this.editingTemplate.id, updates).subscribe({
      next: (success) => {
        console.log('Update success:', success);
        this.isLoading = false;
        
        if (success) {
          // Find and update the template in the current list
          const index = this.templates.findIndex(t => t.id === this.editingTemplate!.id);
          if (index !== -1) {
            // Update the template object directly with all changes
            this.templates[index] = { 
              ...this.templates[index], 
              ...updates, 
              updatedAt: new Date() 
            };
            console.log('Template updated in list:', this.templates[index]);
          }
          
          // Refresh the filtered list immediately
          this.applyFilters();
          
          // Close edit form
          this.cancelEdit();
          
          alert('✅ Template successfully updated!');
          
        } else {
          alert('❌ Template update failed!');
        }
      },
      error: (error) => {
        console.error('Error updating template:', error);
        this.isLoading = false;
        alert('❌ Error occurred while updating!');
      }
    });
  }

  cancelEdit(): void {
    this.editingTemplate = null;
    this.showEditForm = false;
    console.log('Edit cancelled');
  }

  toggleFeature(feature: string): void {
    if (!this.editingTemplate) return;
    
    if (!this.editingTemplate.templateFeatures) {
      this.editingTemplate.templateFeatures = [];
    }
    
    const features = this.editingTemplate.templateFeatures;
    const index = features.indexOf(feature);
    
    if (index > -1) {
      features.splice(index, 1);
    } else {
      features.push(feature);
    }
  }

  // Force refresh templates from service
  refreshTemplates(): void {
    console.log('Force refreshing templates...');
    this.isLoading = true;
    
    // Clear existing templates first
    this.templates = [];
    this.filteredTemplates = [];
    
    this.adminService.getTemplates().subscribe({
      next: (templates) => {
        console.log('Templates refreshed:', templates);
        this.templates = templates;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error refreshing templates:', error);
        this.isLoading = false;
      }
    });
  }

  deleteTemplate(templateId: string): void {
    if (confirm('Are you sure you want to delete this template?')) {
      this.adminService.deleteTemplate(templateId).subscribe({
        next: (success) => {
          if (success) {
            this.templates = this.templates.filter(t => t.id !== templateId);
            this.selectedTemplates = this.selectedTemplates.filter(id => id !== templateId);
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

  getColorClass(color: string): string {
    return `color-${(color || 'blue').toLowerCase()}`;
  }

  // Bulk Operations Methods
  toggleSelection(templateId: string): void {
    const index = this.selectedTemplates.indexOf(templateId);
    if (index > -1) {
      this.selectedTemplates.splice(index, 1);
    } else {
      this.selectedTemplates.push(templateId);
    }
  }

  isSelected(templateId: string): boolean {
    return this.selectedTemplates.includes(templateId);
  }

  clearSelection(): void {
    this.selectedTemplates = [];
  }

  bulkActivate(): void {
    if (this.selectedTemplates.length === 0) return;
    
    const selectedCount = this.selectedTemplates.length;
    const promises = this.selectedTemplates.map(id => 
      this.adminService.updateTemplate(id, { isActive: true }).toPromise()
    );
    
    Promise.all(promises).then(() => {
      this.selectedTemplates.forEach(id => {
        const template = this.templates.find(t => t.id === id);
        if (template) template.isActive = true;
      });
      this.applyFilters();
      this.clearSelection();
      alert(`${selectedCount} templates successfully activated!`);
    }).catch(error => {
      console.error('Bulk activate error:', error);
      alert('Error occurred during bulk activation');
    });
  }

  bulkDeactivate(): void {
    if (this.selectedTemplates.length === 0) return;
    
    const selectedCount = this.selectedTemplates.length;
    const promises = this.selectedTemplates.map(id => 
      this.adminService.updateTemplate(id, { isActive: false }).toPromise()
    );
    
    Promise.all(promises).then(() => {
      this.selectedTemplates.forEach(id => {
        const template = this.templates.find(t => t.id === id);
        if (template) template.isActive = false;
      });
      this.applyFilters();
      this.clearSelection();
      alert(`${selectedCount} templates successfully deactivated!`);
    }).catch(error => {
      console.error('Bulk deactivate error:', error);
      alert('Error occurred during bulk deactivation');
    });
  }

  bulkDelete(): void {
    if (this.selectedTemplates.length === 0) return;
    
    const count = this.selectedTemplates.length;
    if (confirm(`Are you sure you want to delete ${count} templates? This action cannot be undone.`)) {
      const promises = this.selectedTemplates.map(id => 
        this.adminService.deleteTemplate(id).toPromise()
      );
      
      Promise.all(promises).then(() => {
        this.templates = this.templates.filter(t => !this.selectedTemplates.includes(t.id));
        this.applyFilters();
        this.clearSelection();
        alert(`${count} templates successfully deleted!`);
      }).catch(error => {
        console.error('Bulk delete error:', error);
        alert('Error occurred during bulk deletion');
      });
    }
  }
}