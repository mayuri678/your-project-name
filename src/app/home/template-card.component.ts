import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatePreviewComponent } from './template-preview.component';

export interface TemplateCard {
  id: number;
  name: string;
  category: string;
  description?: string;
}

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [CommonModule, TemplatePreviewComponent],
  template: `
    <div class="template-card" (click)="onSelect()">
      <div class="card-preview">
        <app-template-preview [templateId]="template.id"></app-template-preview>
      </div>
      <div class="card-info">
        <h3 class="card-name">{{ template.name }}</h3>
        <p class="card-category">{{ template.category }}</p>
        <p class="card-description" *ngIf="template.description">{{ template.description }}</p>
        <button class="card-btn">Select</button>
      </div>
    </div>
  `,
  styles: [`
    .template-card {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      height: 100%;
    }

    .template-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      transform: translateY(-4px);
    }

    .card-preview {
      width: 100%;
      aspect-ratio: 8.5 / 11;
      background: #f5f5f5;
      overflow: hidden;
    }

    .card-info {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1f2937;
    }

    .card-category {
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-description {
      font-size: 13px;
      color: #4b5563;
      margin: 0 0 12px 0;
      flex: 1;
      line-height: 1.4;
    }

    .card-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .card-btn:hover {
      background: #1d4ed8;
    }

    .card-btn:active {
      background: #1e40af;
    }
  `]
})
export class TemplateCardComponent {
  @Input() template!: TemplateCard;
  @Output() selected = new EventEmitter<number>();

  onSelect(): void {
    this.selected.emit(this.template.id);
  }
}
