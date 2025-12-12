import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';

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
  imports: [CommonModule, RouterModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './template-manager.component.html',
  styleUrls: ['./template-manager.component.css']
})
export class TemplateManagerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() templateSelected = new EventEmitter<string>();

  constructor(private supabaseService: SupabaseService) {}

  templates: Template[] = [
    {
      id: 'executive',
      name: 'Executive',
      category: 'Professional',
      thumbnail: 'https://resumegenius.com/wp-content/uploads/Executive-Resume-Template.png',
      downloadUrl: 'https://resumegenius.com/resume/executive-resume-templates',
      lastModified: new Date('2023-11-20')
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      category: 'Minimalist',
      thumbnail: 'https://cdn-images.zety.com/templates/zety/valera-17-classy-single.png',
      downloadUrl: 'https://zety.com/resume-templates',
      lastModified: new Date('2023-11-18')
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      category: 'Creative',
      thumbnail: 'https://www.resume.com/hs-fs/hubfs/creative-resume-templates.jpg',
      downloadUrl: 'https://www.resume.com/career-advice/resumes/creative-resume-templates/',
      lastModified: new Date('2023-11-15')
    },
    {
      id: 'modern-chronological',
      name: 'Modern Chronological',
      category: 'Professional',
      thumbnail: 'https://www.myperfectresume.com/wp-content/uploads/2022/08/chronological-resume-template.jpg',
      downloadUrl: 'https://www.myperfectresume.com/resume-templates/chronological',
      lastModified: new Date('2023-11-10')
    },
    {
      id: 'functional-resume',
      name: 'Functional Resume',
      category: 'Professional',
      thumbnail: 'https://resumegenius.com/wp-content/uploads/Functional-Resume-Template.png',
      downloadUrl: 'https://resumegenius.com/resume/functional-resume-templates',
      lastModified: new Date('2023-11-05')
    },
    {
      id: 'combination-resume',
      name: 'Combination Resume',
      category: 'Professional',
      thumbnail: 'https://cdn-images.zety.com/templates/zety/berlin-17-classy-single.png',
      downloadUrl: 'https://zety.com/resume-templates',
      lastModified: new Date('2023-11-01')
    },
    {
      id: 'academic-cv',
      name: 'Academic CV',
      category: 'Academic',
      thumbnail: 'https://www.overleaf.com/learn/latex/Articles/Free_Online_Introduction_to_LaTeX_Part_3/Example_of_a_CV_in_LaTeX',
      downloadUrl: 'https://www.overleaf.com/latex/templates/tagged/cv',
      lastModified: new Date('2023-10-28')
    },
    {
      id: 'infographic-resume',
      name: 'Infographic Resume',
      category: 'Creative',
      thumbnail: 'https://venngage-wordpress.s3.amazonaws.com/uploads/2019/01/Simple-Professional-Resume-Template.png',
      downloadUrl: 'https://venngage.com/blog/infographic-resume/',
      lastModified: new Date('2023-10-25')
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'Professional',
      thumbnail: 'assets/images/templates/executive.jpg',
      downloadUrl: '/api/templates/executive',
      lastModified: new Date('2023-10-28')
    },
    {
      id: 'modern-tech',
      name: 'Tech Professional',
      category: 'Technology',
      thumbnail: 'assets/images/templates/tech.jpg',
      downloadUrl: '/api/templates/tech',
      lastModified: new Date('2023-10-25')
    },
    {
      id: 'academic',
      name: 'Academic CV',
      category: 'Education',
      thumbnail: 'assets/images/templates/academic.jpg',
      downloadUrl: '/api/templates/academic',
      lastModified: new Date('2023-10-20')
    },
    {
      id: 'timeline',
      name: 'Timeline',
      category: 'Creative',
      thumbnail: 'assets/images/templates/timeline.jpg',
      downloadUrl: '/api/templates/timeline',
      lastModified: new Date('2023-10-18')
    },
    {
      id: 'corporate',
      name: 'Corporate',
      category: 'Professional',
      thumbnail: 'assets/images/templates/corporate.jpg',
      downloadUrl: '/api/templates/corporate',
      lastModified: new Date('2023-10-15')
    },
    {
      id: 'creative-colorful',
      name: 'Colorful',
      category: 'Creative',
      thumbnail: 'assets/images/templates/colorful.jpg',
      downloadUrl: '/api/templates/colorful',
      lastModified: new Date('2023-10-10')
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Simple',
      thumbnail: 'assets/images/templates/modern-minimal.jpg',
      downloadUrl: '/api/templates/modern-minimal',
      lastModified: new Date('2023-10-05')
    },
    {
      id: 'professional-blue',
      name: 'Professional Blue',
      category: 'Professional',
      thumbnail: 'assets/images/templates/professional-blue.jpg',
      downloadUrl: '/api/templates/professional-blue',
      lastModified: new Date('2023-10-01')
    },
    {
      id: 'designer',
      name: 'Designer Portfolio',
      category: 'Creative',
      thumbnail: 'assets/images/templates/designer.jpg',
      downloadUrl: '/api/templates/designer',
      lastModified: new Date('2023-09-28')
    },
    {
      id: 'modern-red',
      name: 'Modern Red',
      category: 'Professional',
      thumbnail: 'assets/images/templates/modern-red.jpg',
      downloadUrl: '/api/templates/modern-red',
      lastModified: new Date('2023-09-25')
    },
    {
      id: 'classic',
      name: 'Classic',
      category: 'Simple',
      thumbnail: 'assets/images/templates/classic.jpg',
      downloadUrl: '/api/templates/classic',
      lastModified: new Date('2023-09-20')
    },
    {
      id: 'modern-green',
      name: 'Modern Green',
      category: 'Professional',
      thumbnail: 'assets/images/templates/modern-green.jpg',
      downloadUrl: '/api/templates/modern-green',
      lastModified: new Date('2023-09-15')
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'Professional',
      thumbnail: 'assets/images/templates/executive.jpg',
      downloadUrl: '/api/templates/executive',
      lastModified: new Date('2023-10-28')
    },
    {
      id: 'timeless',
      name: 'Timeless Classic',
      category: 'Traditional',
      thumbnail: 'assets/images/templates/timeless.jpg',
      downloadUrl: '/api/templates/timeless',
      lastModified: new Date('2023-09-10')
    },
    {
      id: 'modern-blue',
      name: 'Modern Blue',
      category: 'Professional',
      thumbnail: 'assets/images/templates/modern-blue.jpg',
      downloadUrl: '/api/templates/modern-blue',
      lastModified: new Date('2023-11-05')
    }
  ];

  filteredTemplates: Template[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';

  ngOnInit(): void {
    this.filteredTemplates = [...this.templates];
    this.categories = ['all', ...new Set(this.templates.map(t => t.category))];
  }

  filterTemplates(): void {
    this.filteredTemplates = this.templates.filter(template => {
      const matchesCategory =
        this.selectedCategory === 'all' || template.category === this.selectedCategory;
      const matchesSearch =
        template.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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
    console.log('Downloading template:', template.name);
    const link = document.createElement('a');
    link.href = template.downloadUrl;
    link.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async editTemplate(template: Template): Promise<void> {
    await this.saveTemplateData(template.id, { selectedTemplate: template });
    this.templateSelected.emit(template.id);
    this.close.emit();
  }

  private async saveTemplateData(templateId: string, content: any): Promise<void> {
    try {
      const result = await this.supabaseService.saveTemplate({
        templateId,
        content
      });
      if (result.error) {
        console.error('Failed to save template:', result.error);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }

  closeManager(): void {
    this.close.emit();
  }
}
