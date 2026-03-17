import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatePreviewComponent } from './template-preview-enhanced.component';
import { TemplateMetadata } from './template-metadata';

@Component({
  selector: 'app-template-card-enhanced',
  standalone: true,
  imports: [CommonModule, TemplatePreviewComponent],
  template: `
    <div class="card" (click)="onSelect()" [attr.data-layout]="template.layoutType">
      <div class="card-preview-container">
        <app-template-preview [template]="template"></app-template-preview>
        <div class="card-overlay">
          <button class="card-select-btn">Select Template</button>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="card-header">
          <h3 class="card-title">{{ template.name }}</h3>
          <span class="card-badge" [style.background-color]="template.primaryColor">
            {{ template.category }}
          </span>
        </div>
        <p class="card-description">{{ template.description }}</p>
        <div class="card-features">
          <span class="feature" *ngIf="template.hasPhoto">
            <span class="feature-icon">📷</span>
            <span class="feature-text">Photo</span>
          </span>
          <span class="feature" *ngIf="template.hasSidebar">
            <span class="feature-icon">📋</span>
            <span class="feature-text">Sidebar</span>
          </span>
          <span class="feature">
            <span class="feature-icon">🎨</span>
            <span class="feature-text">{{ template.layoutType | titlecase }}</span>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      height: 100%;
      border: 1px solid #e5e7eb;
    }

    .card:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      transform: translateY(-8px);
      border-color: #d1d5db;
    }

    .card-preview-container {
      position: relative;
      width: 100%;
      aspect-ratio: 8.5 / 11;
      background: #f9fafb;
      overflow: hidden;
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .card:hover .card-overlay {
      background: rgba(0, 0, 0, 0.4);
      opacity: 1;
    }

    .card-select-btn {
      background: white;
      color: #1f2937;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .card-select-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .card-select-btn:active {
      transform: scale(0.98);
    }

    .card-footer {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #1f2937;
      flex: 1;
    }

    .card-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .card-description {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 12px 0;
      line-height: 1.4;
      flex: 1;
    }

    .card-features {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    .feature {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .card:hover .feature {
      background: #e5e7eb;
    }

    .feature-icon {
      font-size: 14px;
    }

    .feature-text {
      font-weight: 500;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .card {
        border-radius: 10px;
      }

      .card-footer {
        padding: 14px;
      }

      .card-title {
        font-size: 15px;
      }

      .card-description {
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .card-footer {
        padding: 12px;
      }

      .card-title {
        font-size: 14px;
      }

      .card-badge {
        font-size: 10px;
        padding: 3px 8px;
      }

      .card-features {
        gap: 6px;
      }

      .feature {
        font-size: 11px;
        padding: 3px 6px;
      }
    }
  `]
})
export class TemplateCardEnhancedComponent {
  @Input() template!: TemplateMetadata;
  @Output() selected = new EventEmitter<number>();

  onSelect(): void {
    this.selected.emit(this.template.id);
  }
}
