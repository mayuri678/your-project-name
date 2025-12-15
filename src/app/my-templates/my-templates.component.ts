import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-my-templates',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.css']
})
export class MyTemplatesComponent implements OnInit {
  templates: any[] = [];
  loading = true;
  isLoggedIn = false;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      await this.loadTemplates();
    }
  }

  async loadTemplates() {
    try {
      const result = await this.supabaseService.getUserTemplates();
      if (result.data) {
        this.templates = result.data;
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      this.loading = false;
    }
  }

  viewTemplate(template: any) {
    const templateData = JSON.parse(template.description);
    this.router.navigate(['/resume'], {
      queryParams: {
        template: template.category,
        loadData: template.id
      }
    });
  }

  editTemplate(template: any) {
    this.router.navigate(['/resume'], {
      queryParams: {
        template: template.category,
        edit: 'true',
        templateId: template.id
      }
    });
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
    this.authService.logout();
    this.router.navigate(['/logged-out']);
  }

  navigateToResume() {
    this.router.navigate(['/resume']);
  }

  getTemplateName(template: any): string {
    try {
      // Always try to get name from description first
      const templateData = JSON.parse(template.description);
      if (templateData.name && templateData.name.trim()) {
        return templateData.name.trim();
      }
      
      // If no name in description, check if title contains template format
      if (template.title && template.title.includes(' - ')) {
        // Extract name from "template1 - Name" format
        const namePart = template.title.split(' - ')[1];
        if (namePart && namePart.trim()) {
          return namePart.trim();
        }
      }
      
      // Fallback to title or default
      return template.title || 'Untitled Resume';
    } catch (error) {
      return template.title || 'Untitled Resume';
    }
  }
}