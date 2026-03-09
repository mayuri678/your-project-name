import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-selection-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="templates-grid">
      <div *ngFor="let template of templates" 
           class="template-card" 
           (click)="selectTemplate(template.id)">
        <h3>{{ template.name }}</h3>
        <p>Template {{ template.id }}</p>
      </div>
    </div>
  `,
  styles: [`
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 20px;
    }
    .template-card {
      border: 2px solid #ddd;
      padding: 20px;
      cursor: pointer;
      border-radius: 8px;
    }
    .template-card:hover {
      border-color: #4285f4;
      transform: scale(1.05);
    }
  `]
})
export class TemplateSelectionSimpleComponent {
  templates = [
    { id: 1, name: 'Classic' },
    { id: 2, name: 'Modern' },
    { id: 3, name: 'Creative' }
  ];

  constructor(private router: Router) {}

  selectTemplate(templateId: number) {
    // Navigate with templateId
    this.router.navigate(['/resume-builder'], {
      queryParams: { templateId }
    });
  }
}
