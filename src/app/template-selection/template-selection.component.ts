import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateRegistryService, TemplateInfo } from '../resume-templates/template-registry.service';
import { SupabaseTemplateService } from '../services/supabase-template.service';

@Component({
  selector: 'app-template-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-selection-container">
      <div class="header">
        <h1>Choose Your Resume Template</h1>
        <p>Select a template to start building your professional resume</p>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button 
          *ngFor="let category of categories" 
          [class.active]="selectedCategory === category"
          (click)="filterByCategory(category)">
          {{ category }}
        </button>
      </div>

      <!-- Template Grid -->
      <div class="templates-grid">
        <div 
          *ngFor="let template of filteredTemplates" 
          class="template-card"
          (click)="selectTemplate(template.id)">
          <div class="template-preview">
            <div class="template-number">Template {{ template.id }}</div>
            <div class="template-name">{{ template.name }}</div>
          </div>
          <div class="template-info">
            <span class="category-badge">{{ template.category }}</span>
            <button class="select-btn">Select</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-selection-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #666;
      font-size: 1.1rem;
    }

    .category-filter {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .category-filter button {
      padding: 0.5rem 1.5rem;
      border: 2px solid #ddd;
      background: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .category-filter button:hover {
      border-color: #4285f4;
      color: #4285f4;
    }

    .category-filter button.active {
      background: #4285f4;
      color: white;
      border-color: #4285f4;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .template-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
      background: white;
    }

    .template-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border-color: #4285f4;
    }

    .template-preview {
      height: 300px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
    }

    .template-number {
      font-size: 3rem;
      font-weight: bold;
      opacity: 0.9;
    }

    .template-name {
      font-size: 1.2rem;
      margin-top: 1rem;
      text-align: center;
      padding: 0 1rem;
    }

    .template-info {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-badge {
      background: #f0f0f0;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.85rem;
      color: #666;
    }

    .select-btn {
      background: #4285f4;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s;
    }

    .select-btn:hover {
      background: #3367d6;
    }
  `]
})
export class TemplateSelectionComponent implements OnInit {
  templates: TemplateInfo[] = [];
  filteredTemplates: TemplateInfo[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';

  constructor(
    private router: Router,
    private templateRegistry: TemplateRegistryService,
    private supabaseTemplateService: SupabaseTemplateService
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.templates = this.templateRegistry.getAllTemplates();
    this.filteredTemplates = this.templates;
    this.categories = ['All', ...this.templateRegistry.getCategories()];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredTemplates = this.templates;
    } else {
      this.filteredTemplates = this.templates.filter(t => t.category === category);
    }
  }

  selectTemplate(templateId: number) {
    // Navigate to resume builder with template ID
    this.router.navigate(['/resume-builder'], {
      queryParams: { templateId: templateId }
    });
  }
}
