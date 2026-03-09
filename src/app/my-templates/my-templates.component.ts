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
    console.log('🔍 MyTemplates component initialized');
    const adminToken = localStorage.getItem('adminToken');
    this.isLoggedIn = this.authService.isLoggedIn() || !!adminToken;
    console.log('✅ Login status:', this.isLoggedIn, 'Admin:', !!adminToken);
    if (this.isLoggedIn) {
      this.clearPreviousTemplates();
      await this.loadTemplates();
    } else {
      console.log('❌ User not logged in, redirecting...');
      this.loading = false;
    }
  }

  async loadTemplates() {
    console.log('📦 Loading templates...');
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://kwlaqovlzhxghwtilxxu.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bGFxb3Zsemh4Z2h3dGlseHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjQ0MzMsImV4cCI6MjA3ODUwMDQzM30.L2jcB8zc2sN1GH3F9CNhKLbaD2jAFs_iGmcFSYA6vQA'
      );
      
      const { data: user } = await supabase.auth.getUser();
      const adminToken = localStorage.getItem('adminToken');
      
      if (user.user) {
        // Load from Supabase for logged in users
        const { data, error } = await supabase
          .from('user_resumes')
          .select('*')
          .eq('user_id', user.user.id)
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error('Error loading resumes:', error);
        } else {
          this.templates = (data || []).map(resume => ({
            id: resume.id,
            name: resume.resume_name,
            template_id: resume.template_id,
            resume_data: resume.resume_data,
            status: resume.status,
            created_at: resume.created_at,
            updated_at: resume.updated_at
          }));
          console.log('✅ Loaded resumes from Supabase:', this.templates.length);
        }
      } else if (adminToken) {
        // Load from localStorage for admin
        const localResumes = JSON.parse(localStorage.getItem('localResumes') || '[]');
        this.templates = localResumes.map((resume: any) => ({
          id: resume.id,
          name: resume.resume_name,
          template_id: resume.template_id,
          resume_data: resume.resume_data,
          status: resume.status || 'draft',
          created_at: resume.created_at,
          updated_at: resume.updated_at
        }));
        console.log('✅ Loaded resumes from localStorage:', this.templates.length);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      this.loading = false;
    }
  }

  viewTemplate(template: any) {
    this.router.navigate(['/resume-builder'], {
      queryParams: {
        templateId: template.template_id,
        resumeId: template.id
      }
    });
  }

  editTemplate(template: any) {
    // Navigate to resume builder in edit mode
    this.router.navigate(['/resume-builder'], {
      queryParams: {
        templateId: template.template_id,
        resumeId: template.id
      }
    });
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
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        
        if (adminToken) {
          // Delete from localStorage for admin
          const localResumes = JSON.parse(localStorage.getItem('localResumes') || '[]');
          const filtered = localResumes.filter((r: any) => r.id !== template.id);
          localStorage.setItem('localResumes', JSON.stringify(filtered));
          this.templates = this.templates.filter(t => t.id !== template.id);
          alert('✅ Resume deleted!');
        } else {
          // Delete from Supabase for regular users
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            'https://kwlaqovlzhxghwtilxxu.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bGFxb3Zsemh4Z2h3dGlseHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjQ0MzMsImV4cCI6MjA3ODUwMDQzM30.L2jcB8zc2sN1GH3F9CNhKLbaD2jAFs_iGmcFSYA6vQA'
          );
          
          const { error } = await supabase
            .from('user_resumes')
            .delete()
            .eq('id', template.id);
          
          if (error) {
            alert('Failed to delete resume');
          } else {
            this.templates = this.templates.filter(t => t.id !== template.id);
            alert('✅ Resume deleted!');
          }
        }
      } catch (error) {
        alert('Error deleting resume');
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
    return template.name || template.resume_name || 'Untitled Resume';
  }

  private clearPreviousTemplates(): void {
    // Clear templates array to prevent showing previous user's templates
    this.templates = [];
    this.loading = true;
  }
}







