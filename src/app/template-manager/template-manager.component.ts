import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateRegistryService, TemplateInfo } from '../resume-templates/template-registry.service';

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Select Resume Template</h2>
          <button class="close-btn" (click)="close()">&times;</button>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            *ngFor="let category of categories" 
            [class.active]="selectedCategory === category"
            (click)="filterByCategory(category)">
            {{ category }}
          </button>
        </div>

        <!-- Templates Grid -->
        <div class="templates-grid">
          <div 
            *ngFor="let template of filteredTemplates" 
            class="template-card"
            (click)="selectTemplate(template.id)">
            <div class="template-preview" [style.background]="getGradient(template.id)">
              <div class="template-id">{{ template.id }}</div>
              <div class="template-name">{{ template.name }}</div>
            </div>
            <div class="template-footer">
              <span class="category">{{ template.category }}</span>
              <button class="use-btn">Use Template</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 1200px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 2rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.8rem;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #666;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #f0f0f0;
      color: #333;
    }

    .category-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .category-tabs button {
      padding: 0.5rem 1rem;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .category-tabs button:hover {
      border-color: #4285f4;
    }

    .category-tabs button.active {
      background: #4285f4;
      color: white;
      border-color: #4285f4;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
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
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      border-color: #4285f4;
    }

    .template-preview {
      height: 250px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      position: relative;
    }

    .template-id {
      font-size: 2.5rem;
      font-weight: bold;
      opacity: 0.95;
    }

    .template-name {
      font-size: 1rem;
      margin-top: 0.5rem;
      text-align: center;
      padding: 0 1rem;
      font-weight: 500;
    }

    .template-footer {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fafafa;
    }

    .category {
      font-size: 0.8rem;
      color: #666;
      background: white;
      padding: 0.3rem 0.8rem;
      border-radius: 12px;
    }

    .use-btn {
      background: #4285f4;
      color: white;
      border: none;
      padding: 0.4rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 500;
      transition: background 0.3s;
    }

    .use-btn:hover {
      background: #3367d6;
    }
  `]
})
export class TemplateManagerComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  @Output() templateSelected = new EventEmitter<number>();

  templates: TemplateInfo[] = [];
  filteredTemplates: TemplateInfo[] = [];
  categories: string[] = ['All'];
  selectedCategory: string = 'All';

  constructor(
    private router: Router,
    private templateRegistry: TemplateRegistryService
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
    this.templateSelected.emit(templateId);
    this.router.navigate(['/resume-builder'], {
      queryParams: { templateId: templateId }
    });
  }

  close() {
    this.closeModal.emit();
  }

  getGradient(id: number): string {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
    ];
    return gradients[id % gradients.length];
  }
}
