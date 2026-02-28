import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { TemplateBuilderComponent } from './template-builder.component';
import { TemplateViewerComponent } from './template-viewer.component';
import { TemplateService } from '../template.service';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  downloadUrl: string;
  lastModified: Date;
}

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TemplateBuilderComponent, TemplateViewerComponent],
  templateUrl: './template-manager.component.html',
  styleUrls: ['./template-manager.component.css']
})
export class TemplateManagerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() templateSelected = new EventEmitter<string>();

  constructor(private supabaseService: SupabaseService, private router: Router, private templateService: TemplateService) {}

  createdTemplates: any[] = [];
  showCreatedTemplates = false;
  showTemplateViewer = false;
  selectedTemplate: any = null;
  editTemplateData: any = null;

  templates: Template[] = [
    {
      id: 'basic-resume',
      name: 'Basic Resume',
      category: 'Simple',
      thumbnail: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Basic+Resume',
      downloadUrl: '/resume-template.html',
      lastModified: new Date()
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'Professional',
      thumbnail: 'https://via.placeholder.com/300x400/764ba2/ffffff?text=Executive',
      downloadUrl: '#',
      lastModified: new Date('2023-11-20')
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      category: 'Minimalist',
      thumbnail: 'https://via.placeholder.com/300x400/f093fb/ffffff?text=Modern+Minimalist',
      downloadUrl: '#',
      lastModified: new Date('2023-11-18')
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      category: 'Creative',
      thumbnail: 'https://via.placeholder.com/300x400/4facfe/ffffff?text=Creative+Portfolio',
      downloadUrl: '#',
      lastModified: new Date('2023-11-15')
    },
    {
      id: 'modern-chronological',
      name: 'Modern Chronological',
      category: 'Professional',
      thumbnail: 'https://via.placeholder.com/300x400/00f2fe/ffffff?text=Modern+Chronological',
      downloadUrl: '#',
      lastModified: new Date('2023-11-10')
    },
    {
      id: 'functional-resume',
      name: 'Functional Resume',
      category: 'Professional',
      thumbnail: 'https://via.placeholder.com/300x400/43e97b/ffffff?text=Functional+Resume',
      downloadUrl: '#',
      lastModified: new Date('2023-11-05')
    },
    {
      id: 'combination-resume',
      name: 'Combination Resume',
      category: 'Professional',
      thumbnail: 'https://via.placeholder.com/300x400/38f9d7/ffffff?text=Combination+Resume',
      downloadUrl: '#',
      lastModified: new Date('2023-11-01')
    },
    {
      id: 'academic-cv',
      name: 'Academic CV',
      category: 'Academic',
      thumbnail: 'https://via.placeholder.com/300x400/fa709a/ffffff?text=Academic+CV',
      downloadUrl: '#',
      lastModified: new Date('2023-10-28')
    },
    {
      id: 'infographic-resume',
      name: 'Infographic Resume',
      category: 'Creative',
      thumbnail: 'https://via.placeholder.com/300x400/fee140/ffffff?text=Infographic+Resume',
      downloadUrl: '#',
      lastModified: new Date('2023-10-25')
    }
  ];

  filteredTemplates: Template[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  
  showAddForm: boolean = false;
  showTemplateBuilder: boolean = false;
  newTemplateName: string = '';
  newTemplateCategory: string = 'Professional';
  newTemplateThumbnail: string = '';

  ngOnInit(): void {
    this.filteredTemplates = [...this.templates];
    this.categories = ['all', ...new Set(this.templates.map(t => t.category))];
    this.loadCreatedTemplates();
  }

  loadCreatedTemplates(): void {
    this.createdTemplates = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('my_template_') || key?.startsWith('template_')) {
        try {
          const templateData = localStorage.getItem(key);
          if (templateData) {
            const template = JSON.parse(templateData);
            this.createdTemplates.push({ ...template, id: key });
          }
        } catch (e) {
          console.error('Error parsing template:', e);
        }
      }
    }
  }

  filterTemplates(): void {
    this.filteredTemplates = this.templates.filter(template => {
      const matchesCategory = this.selectedCategory === 'all' || template.category === this.selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterTemplates();
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterTemplates();
  }

  downloadTemplate(template: Template, event: Event): void {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = template.downloadUrl;
    link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async editTemplate(template: Template): Promise<void> {
    // Template persist करा localStorage मध्ये
    this.templateService.saveSelectedTemplate({
      id: template.id,
      name: template.name,
      style: template.category as any,
      color: this.getCategoryColor(template.category),
      thumbnail: template.category.toLowerCase()
    });
    
    await this.saveTemplateData(template.id, { selectedTemplate: template });
    this.templateSelected.emit(template.id);
    this.close.emit();
    
    this.router.navigate(['/resume-builder'], {
      queryParams: { template: template.id }
    });
  }

  private getCategoryColor(category: string): string {
    const colors: {[key: string]: string} = {
      'Professional': '#3b5998',
      'Modern': '#4285f4',
      'Creative': '#00c853',
      'Simple': '#607d8b',
      'Minimalist': '#9e9e9e',
      'Academic': '#5e35b1'
    };
    return colors[category] || '#667eea';
  }

  async isTemplateAvailable(templateId: string): Promise<boolean> {
    try {
      const userEmail = localStorage.getItem('currentUserEmail');
      if (!userEmail) return true;
      const { data } = await this.supabaseService.getUserTemplates();
      const userTemplates = data || [];
      return !userTemplates.some((t: any) => {
        try {
          const templateData = JSON.parse(t.description);
          return templateData.originalTemplateId === templateId;
        } catch {
          return false;
        }
      });
    } catch {
      return true;
    }
  }

  private async saveTemplateData(templateId: string, content: any): Promise<void> {
    try {
      const enhancedContent = {
        ...content,
        originalTemplateId: templateId,
        savedAt: new Date().toISOString()
      };
      const result = await this.supabaseService.saveTemplate({
        templateId,
        content: enhancedContent
      });
      if (result.error) {
        console.error('Failed to save template:', result.error);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }

  addTemplate(): void {
    this.editTemplateData = null;
    this.showTemplateBuilder = true;
  }

  viewCreatedTemplates(): void {
    this.loadCreatedTemplates();
    this.showCreatedTemplates = true;
  }

  addQuickTemplate(): void {
    this.showAddForm = true;
  }

  handleThumbnailError(event: Event, template: Template): void {
    // जर बाहेरच्या URL ची image load झाली नाही तर broken icon लपवा
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
    // thumbnail काढून टाकल्याने autoPreview fallback दिसेल
    template.thumbnail = '';
  }

  getThumbnailClass(template: Template): string {
    switch (template.category) {
      case 'Professional':
        return 'thumb-professional';
      case 'Creative':
        return 'thumb-creative';
      case 'Minimalist':
      case 'Simple':
        return 'thumb-minimal';
      case 'Academic':
        return 'thumb-academic';
      default:
        return 'thumb-default';
    }
  }
  
  createTemplate(): void {
    if (!this.newTemplateName.trim()) return;
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: this.newTemplateName,
      category: this.newTemplateCategory,
      thumbnail: this.newTemplateThumbnail || 'assets/images/templates/default.jpg',
      downloadUrl: '',
      lastModified: new Date()
    };
    this.templates.unshift(newTemplate);
    this.filterTemplates();
    this.cancelAdd();
  }
  
  cancelAdd(): void {
    this.showAddForm = false;
    this.showTemplateBuilder = false;
    this.showCreatedTemplates = false;
    this.showTemplateViewer = false;
    this.editTemplateData = null;
    this.selectedTemplate = null;
    this.newTemplateName = '';
    this.newTemplateCategory = 'Professional';
    this.newTemplateThumbnail = '';
  }

  closeManager(): void {
    this.close.emit();
  }

  deleteCreatedTemplate(templateId: string): void {
    localStorage.removeItem(templateId);
    this.loadCreatedTemplates();
  }

  editCreatedTemplate(template: any): void {
    this.editTemplateData = template;
    this.showCreatedTemplates = false;
    this.showTemplateBuilder = true;
  }

  viewTemplate(template: any): void {
    this.selectedTemplate = template;
    this.showCreatedTemplates = false;
    this.showTemplateViewer = true;
  }
}
