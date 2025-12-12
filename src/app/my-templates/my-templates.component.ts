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
}