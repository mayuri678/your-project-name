import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TemplateCardData {
  id: number;
  name: string;
  category: string;
  description: string;
  layoutType: 'executive' | 'sidebar' | 'creative' | 'minimal' | 'modern' | 'elegant' | 'bold';
  primaryColor: string;
  accentColor?: string;
  hasPhoto: boolean;
  hasSidebar: boolean;
}

@Component({
  selector: 'app-template-preview-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-card" (click)="onSelect()" [style.--primary-color]="template.primaryColor" [style.--accent-color]="template.accentColor || template.primaryColor">
      <div class="card-preview">
        <div [ngSwitch]="template.layoutType" class="preview-container">
          <!-- Executive Layout -->
          <div *ngSwitchCase="'executive'" class="preview-executive">
            <div class="preview-header">
              <div class="header-name">John Doe</div>
              <div class="header-title">Senior Manager</div>
              <div class="header-contact">john@email.com | (555) 123-4567</div>
            </div>
            <div class="preview-body">
              <div class="section">
                <div class="section-title">EXPERIENCE</div>
                <div class="section-line"></div>
                <div class="section-line short"></div>
              </div>
              <div class="section">
                <div class="section-title">EDUCATION</div>
                <div class="section-line"></div>
              </div>
              <div class="section">
                <div class="section-title">SKILLS</div>
                <div class="section-line short"></div>
              </div>
            </div>
          </div>

          <!-- Sidebar Layout -->
          <div *ngSwitchCase="'sidebar'" class="preview-sidebar">
            <div class="sidebar-left">
              <div class="sidebar-avatar" *ngIf="template.hasPhoto"></div>
              <div class="sidebar-section">
                <div class="sidebar-title">CONTACT</div>
                <div class="sidebar-line"></div>
                <div class="sidebar-line short"></div>
              </div>
              <div class="sidebar-section">
                <div class="sidebar-title">SKILLS</div>
                <div class="sidebar-line"></div>
              </div>
            </div>
            <div class="sidebar-right">
              <div class="main-header">Jane Smith</div>
              <div class="main-title">Product Manager</div>
              <div class="section">
                <div class="section-title">EXPERIENCE</div>
                <div class="section-line"></div>
                <div class="section-line short"></div>
              </div>
            </div>
          </div>

          <!-- Creative Layout -->
          <div *ngSwitchCase="'creative'" class="preview-creative">
            <div class="creative-accent"></div>
            <div class="creative-header">
              <div class="creative-name">Alex Johnson</div>
              <div class="creative-title">Designer</div>
            </div>
            <div class="creative-body">
              <div class="creative-section">
                <div class="creative-icon">●</div>
                <div class="creative-line"></div>
              </div>
              <div class="creative-section">
                <div class="creative-icon">●</div>
                <div class="creative-line short"></div>
              </div>
            </div>
          </div>

          <!-- Minimal Layout -->
          <div *ngSwitchCase="'minimal'" class="preview-minimal">
            <div class="minimal-header">
              <div class="minimal-name">Sarah Lee</div>
            </div>
            <div class="minimal-body">
              <div class="minimal-line"></div>
              <div class="minimal-line"></div>
              <div class="minimal-line short"></div>
              <div class="minimal-section-title">EXPERIENCE</div>
              <div class="minimal-line"></div>
            </div>
          </div>

          <!-- Modern Layout -->
          <div *ngSwitchCase="'modern'" class="preview-modern">
            <div class="modern-header">
              <div class="modern-avatar" *ngIf="template.hasPhoto"></div>
              <div class="modern-info">
                <div class="modern-name">Chris Taylor</div>
                <div class="modern-title">Developer</div>
              </div>
            </div>
            <div class="modern-body">
              <div class="modern-section">
                <div class="modern-section-title">SKILLS</div>
                <div class="modern-line"></div>
              </div>
              <div class="modern-section">
                <div class="modern-section-title">EXPERIENCE</div>
                <div class="modern-line"></div>
                <div class="modern-line short"></div>
              </div>
            </div>
          </div>

          <!-- Elegant Layout -->
          <div *ngSwitchCase="'elegant'" class="preview-elegant">
            <div class="elegant-header">
              <div class="elegant-name">Emma Wilson</div>
              <div class="elegant-title">Executive</div>
            </div>
            <div class="elegant-divider"></div>
            <div class="elegant-body">
              <div class="elegant-section">
                <div class="elegant-section-title">PROFESSIONAL EXPERIENCE</div>
                <div class="elegant-line"></div>
                <div class="elegant-line short"></div>
              </div>
            </div>
          </div>

          <!-- Bold Layout -->
          <div *ngSwitchCase="'bold'" class="preview-bold">
            <div class="bold-accent-top"></div>
            <div class="bold-header">
              <div class="bold-name">Michael Brown</div>
            </div>
            <div class="bold-body">
              <div class="bold-section">
                <div class="bold-section-title">EXPERIENCE</div>
                <div class="bold-line"></div>
              </div>
              <div class="bold-section">
                <div class="bold-section-title">SKILLS</div>
                <div class="bold-line short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-info">
        <h3 class="template-name">{{ template.name }}</h3>
        <p class="template-category">{{ template.category }}</p>
        <p class="template-description">{{ template.description }}</p>
        <button class="select-btn" (click)="onSelect(); $event.stopPropagation()">
          Select Template
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #1e3c72;
      --accent-color: #2a5298;
    }

    .template-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .template-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .card-preview {
      flex: 1;
      background: #f8f9fa;
      padding: 16px;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .preview-container {
      width: 100%;
      height: 100%;
      font-size: 11px;
      line-height: 1.4;
    }

    /* Executive Layout */
    .preview-executive {
      background: white;
      padding: 12px;
      border: 1px solid #e0e0e0;
    }

    .preview-header {
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-color);
    }

    .header-name {
      font-weight: 700;
      font-size: 13px;
      color: var(--primary-color);
    }

    .header-title {
      font-weight: 600;
      font-size: 11px;
      color: #666;
    }

    .header-contact {
      font-size: 9px;
      color: #999;
      margin-top: 2px;
    }

    .preview-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .section-title {
      font-weight: 700;
      font-size: 10px;
      color: var(--primary-color);
      letter-spacing: 0.5px;
    }

    .section-line {
      height: 2px;
      background: #ddd;
      border-radius: 1px;
    }

    .section-line.short {
      width: 70%;
    }

    /* Sidebar Layout */
    .preview-sidebar {
      display: flex;
      gap: 8px;
      background: white;
      border: 1px solid #e0e0e0;
      height: 100%;
    }

    .sidebar-left {
      background: var(--primary-color);
      color: white;
      padding: 8px;
      width: 35%;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      margin: 0 auto;
    }

    .sidebar-section {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .sidebar-title {
      font-weight: 700;
      font-size: 9px;
      letter-spacing: 0.5px;
    }

    .sidebar-line {
      height: 1px;
      background: rgba(255, 255, 255, 0.4);
    }

    .sidebar-line.short {
      width: 60%;
    }

    .sidebar-right {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .main-header {
      font-weight: 700;
      font-size: 12px;
      color: var(--primary-color);
    }

    .main-title {
      font-size: 10px;
      color: #666;
      margin-bottom: 4px;
    }

    /* Creative Layout */
    .preview-creative {
      background: white;
      border: 1px solid #e0e0e0;
      padding: 12px;
      position: relative;
    }

    .creative-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary-color);
    }

    .creative-header {
      margin-top: 8px;
      margin-bottom: 10px;
    }

    .creative-name {
      font-weight: 700;
      font-size: 13px;
      color: var(--primary-color);
    }

    .creative-title {
      font-size: 10px;
      color: #666;
    }

    .creative-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .creative-section {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .creative-icon {
      color: var(--primary-color);
      font-size: 8px;
    }

    .creative-line {
      flex: 1;
      height: 2px;
      background: #ddd;
    }

    .creative-line.short {
      width: 60%;
    }

    /* Minimal Layout */
    .preview-minimal {
      background: white;
      padding: 12px;
      border: 1px solid #e0e0e0;
    }

    .minimal-header {
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }

    .minimal-name {
      font-weight: 700;
      font-size: 12px;
      color: #333;
    }

    .minimal-body {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .minimal-line {
      height: 1px;
      background: #ddd;
    }

    .minimal-line.short {
      width: 70%;
    }

    .minimal-section-title {
      font-weight: 700;
      font-size: 9px;
      color: #666;
      margin-top: 4px;
    }

    /* Modern Layout */
    .preview-modern {
      background: white;
      border: 1px solid #e0e0e0;
      padding: 10px;
    }

    .modern-header {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-color);
    }

    .modern-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      border-radius: 50%;
    }

    .modern-info {
      flex: 1;
    }

    .modern-name {
      font-weight: 700;
      font-size: 11px;
      color: var(--primary-color);
    }

    .modern-title {
      font-size: 9px;
      color: #666;
    }

    .modern-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .modern-section {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .modern-section-title {
      font-weight: 700;
      font-size: 9px;
      color: var(--primary-color);
    }

    .modern-line {
      height: 2px;
      background: #ddd;
    }

    .modern-line.short {
      width: 65%;
    }

    /* Elegant Layout */
    .preview-elegant {
      background: white;
      border: 1px solid #e0e0e0;
      padding: 12px;
      font-family: Georgia, serif;
    }

    .elegant-header {
      text-align: center;
      margin-bottom: 8px;
    }

    .elegant-name {
      font-weight: 700;
      font-size: 13px;
      color: var(--primary-color);
    }

    .elegant-title {
      font-size: 10px;
      color: #666;
      font-style: italic;
    }

    .elegant-divider {
      height: 1px;
      background: var(--primary-color);
      margin: 6px 0;
    }

    .elegant-body {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .elegant-section {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .elegant-section-title {
      font-weight: 700;
      font-size: 10px;
      color: var(--primary-color);
    }

    .elegant-line {
      height: 1px;
      background: #ddd;
    }

    .elegant-line.short {
      width: 70%;
    }

    /* Bold Layout */
    .preview-bold {
      background: white;
      border: 1px solid #e0e0e0;
      position: relative;
    }

    .bold-accent-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    }

    .bold-header {
      padding: 12px;
      padding-top: 14px;
      background: var(--primary-color);
      color: white;
    }

    .bold-name {
      font-weight: 700;
      font-size: 13px;
    }

    .bold-body {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .bold-section {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .bold-section-title {
      font-weight: 700;
      font-size: 10px;
      color: var(--primary-color);
    }

    .bold-line {
      height: 2px;
      background: #ddd;
    }

    .bold-line.short {
      width: 60%;
    }

    /* Card Info */
    .card-info {
      padding: 16px;
      background: white;
      border-top: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .template-name {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #333;
    }

    .template-category {
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .template-description {
      margin: 0;
      font-size: 13px;
      color: #666;
      line-height: 1.4;
    }

    .select-btn {
      padding: 10px 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 4px;
    }

    .select-btn:hover {
      background: var(--accent-color);
      transform: scale(1.02);
    }

    .select-btn:active {
      transform: scale(0.98);
    }
  `]
})
export class TemplatePreviewCardComponent {
  @Input() template!: TemplateCardData;
  @Output() selected = new EventEmitter<number>();

  onSelect(): void {
    this.selected.emit(this.template.id);
  }
}
