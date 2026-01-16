import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../auth.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-my-templates',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.css']
})
export class MyTemplatesComponent implements OnInit {
  templates: any[] = [];
  loading = true;
  isLoggedIn = false;
  editingTemplate: any = null;
  showEditForm = false;
  
  categories = ['Professional', 'Creative', 'Modern', 'Classic', 'Technical'];
  colors = ['Blue', 'Green', 'Red', 'Purple', 'Orange', 'Black', 'Gray'];
  layouts = ['1 Column', '2 Column', '3 Column', 'Mixed Layout'];
  features = ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio'];

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      // Clear previous user's templates first
      this.clearPreviousTemplates();
      await this.loadTemplates();
    }
  }

  async loadTemplates() {
    try {
      // Load from localStorage (downloaded templates)
      const localTemplates = JSON.parse(localStorage.getItem('myTemplates') || '[]');
      
      // Load user's own templates from Supabase
      const userResult = await this.supabaseService.getUserTemplates();
      let userTemplates = userResult.data || [];
      
      // Also load admin-created templates
      const adminResult = await this.supabaseService.getAllTemplates();
      let adminTemplates = adminResult.data || [];
      
      // Combine all arrays
      const allTemplates = [...localTemplates, ...userTemplates, ...adminTemplates];
      const uniqueTemplates = allTemplates.filter((template, index, self) => 
        index === self.findIndex(t => t.id === template.id)
      );
      
      // Process all templates
      const processedTemplates = uniqueTemplates.map(template => {
        try {
          const data = template.content ? { content: template.content } : JSON.parse(template.description || '{}');
          return {
            ...template,
            parsedData: data,
            displayName: template.name || data.name || data.templateName || template.title || 'Untitled Resume',
            isAdminTemplate: !!(data.templateColor || data.templateLayout || data.templateFeatures),
            isLocalTemplate: !!template.content
          };
        } catch {
          return {
            ...template,
            parsedData: {},
            displayName: template.name || template.title || 'Untitled Resume',
            isAdminTemplate: false,
            isLocalTemplate: !!template.content
          };
        }
      });
      
      this.templates = processedTemplates;
      console.log('Loaded templates:', this.templates.length);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      this.loading = false;
    }
  }

  viewTemplate(template: any) {
    // Navigate to resume editor with the template data
    this.router.navigate(['/resume'], {
      queryParams: {
        template: template.category || 'template1',
        loadData: template.id,
        edit: 'true'
      }
    });
  }

  editTemplate(template: any) {
    try {
      const templateData = JSON.parse(template.description);
      this.editingTemplate = {
        id: template.id,
        name: this.getTemplateName(template),
        category: template.category || 'Professional',
        color: templateData.templateColor || 'Blue',
        layout: templateData.templateLayout || '1 Column',
        templateFeatures: templateData.templateFeatures || []
      };
      this.showEditForm = true;
    } catch (error) {
      console.error('Error parsing template data:', error);
      alert('Error loading template for editing');
    }
  }

  async updateTemplate() {
    if (!this.editingTemplate || !this.editingTemplate.name) {
      alert('Template name जरूरी आहे!');
      return;
    }

    try {
      // Get existing template data
      const existingTemplate = this.templates.find(t => t.id === this.editingTemplate.id);
      let existingData = {};
      
      try {
        existingData = JSON.parse(existingTemplate.description);
      } catch (e) {
        // If parsing fails, use empty object
      }

      // Update template data with new values
      const updatedData = {
        ...existingData,
        name: this.editingTemplate.name,
        templateColor: this.editingTemplate.color,
        templateLayout: this.editingTemplate.layout,
        templateFeatures: this.editingTemplate.templateFeatures
      };

      const result = await this.supabaseService.updateTemplate(this.editingTemplate.id, {
        name: this.editingTemplate.name,
        category: this.editingTemplate.category,
        color: this.editingTemplate.color,
        layout: this.editingTemplate.layout,
        templateFeatures: this.editingTemplate.templateFeatures,
        description: JSON.stringify(updatedData)
      });

      if (result.data) {
        // Update local template
        const index = this.templates.findIndex(t => t.id === this.editingTemplate.id);
        if (index !== -1) {
          this.templates[index] = {
            ...this.templates[index],
            title: this.editingTemplate.name,
            category: this.editingTemplate.category,
            description: JSON.stringify(updatedData)
          };
        }
        
        this.cancelEdit();
        alert('✅ Template successfully updated!');
      } else {
        alert('❌ Failed to update template');
      }
    } catch (error) {
      console.error('Error updating template:', error);
      alert('❌ Error updating template');
    }
  }

  cancelEdit() {
    this.editingTemplate = null;
    this.showEditForm = false;
  }

  toggleFeature(feature: string) {
    if (!this.editingTemplate.templateFeatures) {
      this.editingTemplate.templateFeatures = [];
    }
    
    const index = this.editingTemplate.templateFeatures.indexOf(feature);
    if (index > -1) {
      this.editingTemplate.templateFeatures.splice(index, 1);
    } else {
      this.editingTemplate.templateFeatures.push(feature);
    }
  }

  async deleteTemplate(template: any) {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        const result = await this.supabaseService.deleteTemplate(template.id);
        if (result.error) {
          alert('Failed to delete template');
        } else {
          this.templates = this.templates.filter(t => t.id !== template.id);
        }
      } catch (error) {
        alert('Error deleting template');
      }
    }
  }

  onLogout() {
    // Clear current user's data before logout
    this.userDataService.clearCurrentUserData();
    this.clearPreviousTemplates();
    this.authService.logout();
    this.router.navigate(['/logged-out']);
  }

  navigateToResume() {
    this.router.navigate(['/resume']);
  }

  getTemplateName(template: any): string {
    // Use the processed display name if available
    if (template.displayName) {
      return template.displayName;
    }
    
    try {
      const templateData = JSON.parse(template.description || '{}');
      return templateData.name || templateData.templateName || template.title || 'Untitled Resume';
    } catch (error) {
      return template.title || 'Untitled Resume';
    }
  }

  private clearPreviousTemplates(): void {
    // Clear templates array to prevent showing previous user's templates
    this.templates = [];
    this.loading = true;
  }
}







