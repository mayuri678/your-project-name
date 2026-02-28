import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateRegistryService, TemplateInfo } from '../resume-templates/template-registry.service';

@Component({
  selector: 'app-template-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-selection-container">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">📄</div>
          <span class="logo-text">Resume<br>Now.</span>
        </div>
      </div>

      <div class="content">
        <h1>Templates we recommend for you</h1>
        <p class="subtitle">You can always change your template later.</p>
        
        <div class="filters">
          <span class="filter-label">Filter by</span>
          
          <select class="filter-dropdown">
            <option>Headshot</option>
            <option>No Headshot</option>
          </select>
          
          <select class="filter-dropdown">
            <option>Graphics</option>
            <option>No Graphics</option>
            <option>Minimal Graphics</option>
          </select>
          
          <select class="filter-dropdown">
            <option>Columns</option>
            <option>Single Column</option>
            <option>Two Columns</option>
          </select>
          
          <div class="colors-filter">
            <span class="colors-label">Colors</span>
            <div class="color-options">
              <div class="color-circle" style="background: #2c3e50" [class.active]="selectedColor === 'dark'"></div>
              <div class="color-circle" style="background: #95a5a6" [class.active]="selectedColor === 'gray'"></div>
              <div class="color-circle" style="background: #3498db" [class.active]="selectedColor === 'blue'"></div>
              <div class="color-circle" style="background: #5dade2" [class.active]="selectedColor === 'lightblue'"></div>
              <div class="color-circle" style="background: #1abc9c" [class.active]="selectedColor === 'teal'"></div>
              <div class="color-circle" style="background: #27ae60" [class.active]="selectedColor === 'green'"></div>
              <div class="color-circle" style="background: #f39c12" [class.active]="selectedColor === 'orange'"></div>
              <div class="color-circle" style="background: #e74c3c" [class.active]="selectedColor === 'red'"></div>
            </div>
          </div>
        </div>

        <div class="template-count">
          All templates ({{filteredTemplates.length}})
        </div>

        <div class="templates-grid">
          <div class="template-card" *ngFor="let template of filteredTemplates; let i = index" (click)="selectTemplate(template)">
            <div class="template-preview" [ngClass]="getTemplateLayoutClass(template.id)">
              <div class="template-header" [style.background]="getTemplateColor(template.id)" [ngClass]="getHeaderClass(template.id)">
                <div class="header-content" [ngClass]="{'text-dark': isLightColor(template.id)}">
                  <h3>{{template.name}}</h3>
                  <div class="template-contact">{{template.category}} Style</div>
                </div>
              </div>
              <div class="template-body" [ngClass]="getBodyClass(template.id)">
                <div class="template-section" *ngIf="!isSidebarLayout(template.id)">
                  <h4 [style.color]="getTemplateColor(template.id)">Summary</h4>
                  <div class="template-text-lines">
                    <div class="text-line" [style.background]="getAccentColor(template.id)"></div>
                    <div class="text-line" [style.background]="getAccentColor(template.id)"></div>
                    <div class="text-line short" [style.background]="getAccentColor(template.id)"></div>
                  </div>
                </div>
                <div class="template-section">
                  <h4 [style.color]="getTemplateColor(template.id)">{{isSidebarLayout(template.id) ? 'Profile' : 'Skills'}}</h4>
                  <div class="skills-list" [ngClass]="{'vertical': isSidebarLayout(template.id)}">
                    <div class="skill-item" [style.background]="getAccentColor(template.id)"></div>
                    <div class="skill-item" [style.background]="getAccentColor(template.id)"></div>
                    <div class="skill-item" [style.background]="getAccentColor(template.id)"></div>
                  </div>
                </div>
                <div class="template-section">
                  <h4 [style.color]="getTemplateColor(template.id)">Experience</h4>
                  <div class="template-text-lines">
                    <div class="text-line" [style.background]="getAccentColor(template.id)"></div>
                    <div class="text-line short" [style.background]="getAccentColor(template.id)"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="template-info">
              <span class="category-badge" [style.background]="getTemplateColor(template.id)" [style.color]="isLightColor(template.id) ? '#000' : '#fff'">{{template.category}}</span>
              <span class="template-number">#{{template.id}}</span>
            </div>
            <button class="use-template-btn" [style.background]="getTemplateColor(template.id)">Use Template</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-selection-container {
      min-height: 100vh;
      background: #f8f9fa;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 40px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 24px;
    }

    .logo-text {
      font-weight: bold;
      font-size: 14px;
      line-height: 1.2;
      color: #333;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      font-size: 36px;
      font-weight: bold;
      color: #333;
      text-align: center;
      margin-bottom: 10px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 40px;
      font-size: 16px;
    }

    .filters {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .filter-label {
      font-weight: 600;
      color: #333;
    }

    .filter-dropdown {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      min-width: 120px;
    }

    .colors-filter {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .colors-label {
      font-weight: 600;
      color: #333;
    }

    .color-options {
      display: flex;
      gap: 8px;
    }

    .color-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s;
    }

    .color-circle.active {
      border-color: #333;
    }

    .template-count {
      color: #666;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .template-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .template-card:hover {
      transform: translateY(-5px);
    }

    .template-preview {
      height: 400px;
      border: 1px solid #e0e0e0;
      font-size: 10px;
      overflow: hidden;
      position: relative;
    }

    .template-preview.sidebar-layout {
      display: flex;
    }

    .template-preview.sidebar-layout .template-header {
      width: 35%;
      height: 100%;
      padding: 20px 10px;
    }

    .template-preview.sidebar-layout .template-body {
      width: 65%;
      padding: 20px 15px;
    }

    .template-preview.header-layout .template-header {
      height: 80px;
    }

    .template-preview.clean-layout .template-header {
      background: transparent !important;
      border-bottom: 2px solid;
      padding: 15px;
    }

    .template-preview.clean-layout .header-content {
      color: #333 !important;
    }

    .template-header {
      padding: 15px;
      color: white;
      text-align: center;
      transition: all 0.3s;
    }

    .template-header.rounded {
      border-radius: 0 0 20px 20px;
    }

    .template-header.gradient {
      background: linear-gradient(135deg, var(--color-1), var(--color-2)) !important;
    }

    .header-content.text-dark {
      color: #333 !important;
    }

    .header-content.text-dark .template-contact {
      color: #666 !important;
    }

    .template-header h3 {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: bold;
    }

    .template-contact {
      font-size: 10px;
      opacity: 0.9;
    }

    .template-body {
      padding: 15px;
      background: white;
    }

    .template-body.two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .template-body.compact {
      padding: 10px;
    }

    .template-section {
      margin-bottom: 15px;
    }

    .template-section h4 {
      margin: 0 0 8px 0;
      font-size: 12px;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
    }

    .template-text-lines {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .text-line {
      height: 8px;
      background: #e0e0e0;
      border-radius: 2px;
    }

    .text-line.short {
      width: 60%;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .skills-list.vertical {
      flex-direction: column;
    }

    .skills-list.vertical .skill-item {
      width: 100%;
    }

    .skill-item {
      width: 40px;
      height: 8px;
      background: #e0e0e0;
      border-radius: 2px;
    }

    .template-info {
      padding: 10px 15px;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .template-number {
      font-size: 12px;
      color: #666;
      font-weight: 600;
    }

    .category-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .use-template-btn {
      width: 100%;
      padding: 15px;
      background: #4285f4;
      color: white;
      border: none;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .use-template-btn:hover {
      background: #3367d6;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .templates-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TemplateSelectionComponent implements OnInit {
  selectedColor = 'blue';
  allTemplates: TemplateInfo[] = [];
  filteredTemplates: TemplateInfo[] = [];
  categories: string[] = [];
  
  private colorMap: { [key: number]: string } = {
    1: '#2c5aa0', 2: '#3b82f6', 3: '#10b981', 4: '#8b5cf6', 5: '#ef4444',
    6: '#6b7280', 7: '#f97316', 8: '#14b8a6', 9: '#1e3a8a', 10: '#84cc16',
    11: '#000000', 12: '#ec4899', 13: '#0ea5e9', 14: '#059669', 15: '#f59e0b',
    16: '#7c3aed', 17: '#06b6d4', 18: '#be123c', 19: '#4ade80', 20: '#475569',
    21: '#4f46e5', 22: '#fb923c', 23: '#c084fc', 24: '#1f2937', 25: '#14b8a6',
    26: '#991b1b', 27: '#15803d', 28: '#c026d3', 29: '#3b82f6', 30: '#ca8a04',
    31: '#6b21a8', 32: '#22d3ee', 33: '#dc2626', 34: '#22c55e', 35: '#1d4ed8',
    36: '#fb923c', 37: '#9333ea', 38: '#18181b', 39: '#2dd4bf', 40: '#7f1d1d',
    41: '#059669', 42: '#ec4899', 43: '#0f172a', 44: '#eab308', 45: '#0284c7',
    46: '#c2410c', 47: '#a78bfa', 48: '#27272a', 49: '#34d399', 50: '#1e40af',
    51: '#ea580c', 52: '#818cf8', 53: '#404040', 54: '#10b981', 55: '#dc2626'
  };

  constructor(
    private router: Router,
    private templateRegistry: TemplateRegistryService
  ) {}

  ngOnInit(): void {
    this.allTemplates = this.templateRegistry.getAllTemplates();
    this.filteredTemplates = this.allTemplates;
    this.categories = this.templateRegistry.getCategories();
  }

  getTemplateColor(id: number): string {
    return this.colorMap[id] || '#3b82f6';
  }

  getAccentColor(id: number): string {
    const color = this.getTemplateColor(id);
    return color + '33'; // Add transparency
  }

  isLightColor(id: number): boolean {
    const lightIds = [6, 11, 19, 23, 29, 34, 36, 39, 44, 47, 49, 52];
    return lightIds.includes(id);
  }

  isSidebarLayout(id: number): boolean {
    const sidebarIds = [2, 4, 7, 9, 12, 14, 16, 18, 21, 24, 26, 28, 31, 33, 36, 38, 41, 43, 46, 48, 51, 53];
    return sidebarIds.includes(id);
  }

  getTemplateLayoutClass(id: number): string {
    if (this.isSidebarLayout(id)) return 'sidebar-layout';
    const cleanIds = [1, 6, 11, 19, 23, 29, 34, 39, 44, 49, 54];
    if (cleanIds.includes(id)) return 'clean-layout';
    return 'header-layout';
  }

  getHeaderClass(id: number): string {
    const roundedIds = [3, 8, 13, 17, 22, 25, 30, 32, 35, 37, 40, 42, 45, 47, 50, 52, 55];
    const gradientIds = [5, 10, 15, 20, 27, 30, 35, 40, 45, 50, 55];
    let classes = [];
    if (roundedIds.includes(id)) classes.push('rounded');
    if (gradientIds.includes(id)) classes.push('gradient');
    return classes.join(' ');
  }

  getBodyClass(id: number): string {
    const twoColumnIds = [8, 13, 20, 25, 30, 35, 40, 45, 50, 55];
    const compactIds = [6, 11, 19, 23, 29, 34, 39, 44, 49, 54];
    if (twoColumnIds.includes(id)) return 'two-column';
    if (compactIds.includes(id)) return 'compact';
    return '';
  }

  selectTemplate(template: TemplateInfo): void {
    console.log('Selected template:', template);
    this.router.navigate(['/resume-builder'], { 
      queryParams: { templateId: template.id } 
    });
  }
}