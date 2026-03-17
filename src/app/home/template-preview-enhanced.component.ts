import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateMetadata } from './template-metadata';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preview-wrapper" [ngSwitch]="template.layoutType">
      <!-- Executive Layout -->
      <div *ngSwitchCase="'executive'" class="preview-executive" [style.--primary-color]="template.primaryColor" [style.--accent-color]="template.accentColor">
        <div class="exec-header">
          <div class="exec-profile" *ngIf="template.hasPhoto">
            <div class="exec-avatar"></div>
          </div>
          <div class="exec-info">
            <div class="exec-name">John Doe</div>
            <div class="exec-title">Senior Manager</div>
          </div>
        </div>
        <div class="exec-contact">
          <span>✉ john@email.com</span>
          <span>📱 +1 234 567</span>
        </div>
        <div class="exec-content">
          <div class="exec-col-main">
            <div class="exec-section">
              <div class="exec-section-title">Professional Summary</div>
              <div class="exec-line"></div>
              <div class="exec-line short"></div>
            </div>
            <div class="exec-section">
              <div class="exec-section-title">Experience</div>
              <div class="exec-item">
                <div class="exec-item-title">Senior Developer</div>
                <div class="exec-item-company">Tech Company</div>
                <div class="exec-line short"></div>
              </div>
            </div>
          </div>
          <div class="exec-col-side">
            <div class="exec-section">
              <div class="exec-section-title">Skills</div>
              <div class="exec-line"></div>
              <div class="exec-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Layout -->
      <div *ngSwitchCase="'sidebar'" class="preview-sidebar" [style.--primary-color]="template.primaryColor">
        <div class="sidebar-left">
          <div class="sidebar-avatar" *ngIf="template.hasPhoto"></div>
          <div class="sidebar-name">Jane Smith</div>
          <div class="sidebar-title">Designer</div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">Skills</div>
            <div class="sidebar-line"></div>
            <div class="sidebar-line"></div>
          </div>
        </div>
        <div class="sidebar-right">
          <div class="sidebar-section">
            <div class="sidebar-section-title">Experience</div>
            <div class="sidebar-line"></div>
            <div class="sidebar-line short"></div>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">Education</div>
            <div class="sidebar-line"></div>
          </div>
        </div>
      </div>

      <!-- Creative Layout -->
      <div *ngSwitchCase="'creative'" class="preview-creative" [style.--primary-color]="template.primaryColor">
        <div class="creative-header">
          <div class="creative-avatar" *ngIf="template.hasPhoto"></div>
          <div class="creative-info">
            <div class="creative-name">Alex Johnson</div>
            <div class="creative-title">Creative Professional</div>
          </div>
        </div>
        <div class="creative-content">
          <div class="creative-col-main">
            <div class="creative-section">
              <div class="creative-section-title">💼 About Me</div>
              <div class="creative-line"></div>
              <div class="creative-line short"></div>
            </div>
            <div class="creative-section">
              <div class="creative-section-title">💼 Experience</div>
              <div class="creative-item">
                <div class="creative-item-title">Project Lead</div>
                <div class="creative-line short"></div>
              </div>
            </div>
          </div>
          <div class="creative-col-side">
            <div class="creative-section">
              <div class="creative-section-title">💡 Skills</div>
              <div class="creative-skill"></div>
              <div class="creative-skill"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Elegant Layout -->
      <div *ngSwitchCase="'elegant'" class="preview-elegant" [style.--primary-color]="template.primaryColor">
        <div class="elegant-top-bar"></div>
        <div class="elegant-header">
          <div class="elegant-avatar" *ngIf="template.hasPhoto"></div>
          <div class="elegant-info">
            <div class="elegant-name">Sarah Williams</div>
            <div class="elegant-title">Professional</div>
          </div>
        </div>
        <div class="elegant-contact">
          <span>sarah@email.com</span>
          <span>+1 234 567</span>
        </div>
        <div class="elegant-content">
          <div class="elegant-col-main">
            <div class="elegant-section">
              <div class="elegant-section-title">Profile</div>
              <div class="elegant-line"></div>
              <div class="elegant-line short"></div>
            </div>
          </div>
          <div class="elegant-col-side">
            <div class="elegant-section">
              <div class="elegant-section-title">Skills</div>
              <div class="elegant-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bold Layout -->
      <div *ngSwitchCase="'bold'" class="preview-bold" [style.--primary-color]="template.primaryColor">
        <div class="bold-header">
          <div class="bold-avatar" *ngIf="template.hasPhoto"></div>
          <div class="bold-info">
            <div class="bold-name">Michael Brown</div>
            <div class="bold-title">Executive</div>
          </div>
        </div>
        <div class="bold-content">
          <div class="bold-section">
            <div class="bold-section-title">Professional Summary</div>
            <div class="bold-line"></div>
            <div class="bold-line short"></div>
          </div>
          <div class="bold-section">
            <div class="bold-section-title">Experience</div>
            <div class="bold-item">
              <div class="bold-item-title">Director</div>
              <div class="bold-line short"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Minimal Layout -->
      <div *ngSwitchCase="'minimal'" class="preview-minimal" [style.--primary-color]="template.primaryColor">
        <div class="minimal-header">
          <div class="minimal-name">Emma Davis</div>
          <div class="minimal-title">Professional</div>
        </div>
        <div class="minimal-content">
          <div class="minimal-section">
            <div class="minimal-section-title">Experience</div>
            <div class="minimal-line"></div>
            <div class="minimal-line short"></div>
          </div>
          <div class="minimal-section">
            <div class="minimal-section-title">Skills</div>
            <div class="minimal-line"></div>
          </div>
        </div>
      </div>

      <!-- Modern Layout -->
      <div *ngSwitchCase="'modern'" class="preview-modern" [style.--primary-color]="template.primaryColor">
        <div class="modern-header">
          <div class="modern-avatar" *ngIf="template.hasPhoto"></div>
          <div class="modern-info">
            <div class="modern-name">Chris Taylor</div>
            <div class="modern-title">Tech Professional</div>
          </div>
        </div>
        <div class="modern-content">
          <div class="modern-section">
            <div class="modern-section-title">Experience</div>
            <div class="modern-line"></div>
            <div class="modern-line short"></div>
          </div>
          <div class="modern-section">
            <div class="modern-section-title">Skills</div>
            <div class="modern-line"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-color: #2563eb;
      --accent-color: #1e40af;
    }

    .preview-wrapper {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      font-family: Arial, sans-serif;
      font-size: 10px;
      color: #333;
      display: flex;
      flex-direction: column;
    }

    /* Executive Layout */
    .preview-executive {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .exec-header {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }

    .exec-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .exec-info {
      flex: 1;
    }

    .exec-name {
      font-weight: 700;
      font-size: 11px;
      margin: 0;
    }

    .exec-title {
      font-size: 9px;
      opacity: 0.9;
      margin: 0;
    }

    .exec-contact {
      display: flex;
      gap: 8px;
      font-size: 8px;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      flex-wrap: wrap;
    }

    .exec-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 8px;
      flex: 1;
      overflow: hidden;
    }

    .exec-section {
      margin-bottom: 6px;
    }

    .exec-section-title {
      font-weight: 700;
      font-size: 9px;
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    .exec-line {
      height: 2px;
      background: rgba(255,255,255,0.4);
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .exec-line.short {
      width: 60%;
    }

    .exec-item {
      margin-bottom: 4px;
    }

    .exec-item-title {
      font-weight: 600;
      font-size: 9px;
      margin-bottom: 1px;
    }

    .exec-item-company {
      font-size: 8px;
      opacity: 0.8;
      margin-bottom: 2px;
    }

    /* Sidebar Layout */
    .preview-sidebar {
      display: flex;
      height: 100%;
      background: white;
    }

    .sidebar-left {
      width: 35%;
      background: linear-gradient(180deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      padding: 10px;
      display: flex;
      flex-direction: column;
    }

    .sidebar-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      margin: 0 auto 8px;
    }

    .sidebar-name {
      font-weight: 700;
      font-size: 10px;
      text-align: center;
      margin-bottom: 2px;
    }

    .sidebar-title {
      font-size: 8px;
      text-align: center;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .sidebar-section {
      margin-top: 8px;
    }

    .sidebar-section-title {
      font-weight: 700;
      font-size: 8px;
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    .sidebar-line {
      height: 1.5px;
      background: rgba(255,255,255,0.3);
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .sidebar-right {
      flex: 1;
      padding: 10px;
      overflow: hidden;
    }

    /* Creative Layout */
    .preview-creative {
      background: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .creative-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      padding: 10px;
      border-radius: 6px;
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }

    .creative-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.3);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .creative-info {
      flex: 1;
    }

    .creative-name {
      font-weight: 700;
      font-size: 10px;
      margin: 0;
    }

    .creative-title {
      font-size: 8px;
      opacity: 0.9;
      margin: 0;
    }

    .creative-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 8px;
      flex: 1;
      overflow: hidden;
    }

    .creative-section {
      margin-bottom: 6px;
    }

    .creative-section-title {
      font-weight: 700;
      font-size: 9px;
      color: var(--primary-color);
      margin-bottom: 3px;
    }

    .creative-line {
      height: 2px;
      background: #e5e7eb;
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .creative-line.short {
      width: 60%;
    }

    .creative-skill {
      height: 6px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      border-radius: 3px;
      margin-bottom: 3px;
    }

    .creative-item {
      margin-bottom: 4px;
    }

    .creative-item-title {
      font-weight: 600;
      font-size: 9px;
      color: #1f2937;
      margin-bottom: 2px;
    }

    /* Elegant Layout */
    .preview-elegant {
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .elegant-top-bar {
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--accent-color) 100%);
    }

    .elegant-header {
      background: #faf5ff;
      padding: 10px;
      display: flex;
      gap: 8px;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }

    .elegant-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-color);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .elegant-info {
      flex: 1;
    }

    .elegant-name {
      font-weight: 700;
      font-size: 10px;
      color: var(--primary-color);
      margin: 0;
    }

    .elegant-title {
      font-size: 8px;
      color: #6b7280;
      margin: 0;
    }

    .elegant-contact {
      display: flex;
      justify-content: center;
      gap: 12px;
      padding: 6px;
      background: var(--primary-color);
      color: white;
      font-size: 7px;
    }

    .elegant-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 8px;
      padding: 10px;
      flex: 1;
      overflow: hidden;
    }

    .elegant-section {
      margin-bottom: 6px;
    }

    .elegant-section-title {
      font-weight: 700;
      font-size: 9px;
      color: var(--primary-color);
      margin-bottom: 3px;
      padding-bottom: 2px;
      border-bottom: 1px solid var(--primary-color);
    }

    .elegant-line {
      height: 2px;
      background: #e5e7eb;
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .elegant-line.short {
      width: 60%;
    }

    /* Bold Layout */
    .preview-bold {
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .bold-header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: white;
      padding: 10px;
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .bold-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.3);
      border-radius: 6px;
      flex-shrink: 0;
    }

    .bold-info {
      flex: 1;
    }

    .bold-name {
      font-weight: 700;
      font-size: 10px;
      margin: 0;
    }

    .bold-title {
      font-size: 8px;
      opacity: 0.9;
      margin: 0;
    }

    .bold-content {
      padding: 10px;
      flex: 1;
      overflow: hidden;
    }

    .bold-section {
      margin-bottom: 6px;
    }

    .bold-section-title {
      font-weight: 700;
      font-size: 9px;
      color: var(--primary-color);
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    .bold-line {
      height: 2px;
      background: #e5e7eb;
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .bold-line.short {
      width: 60%;
    }

    .bold-item {
      margin-bottom: 4px;
    }

    .bold-item-title {
      font-weight: 600;
      font-size: 9px;
      color: #1f2937;
      margin-bottom: 2px;
    }

    /* Minimal Layout */
    .preview-minimal {
      background: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .minimal-header {
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--primary-color);
    }

    .minimal-name {
      font-weight: 700;
      font-size: 11px;
      color: #1f2937;
      margin: 0;
    }

    .minimal-title {
      font-size: 8px;
      color: #6b7280;
      margin: 0;
    }

    .minimal-content {
      flex: 1;
      overflow: hidden;
    }

    .minimal-section {
      margin-bottom: 6px;
    }

    .minimal-section-title {
      font-weight: 700;
      font-size: 9px;
      color: var(--primary-color);
      margin-bottom: 3px;
    }

    .minimal-line {
      height: 2px;
      background: #e5e7eb;
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .minimal-line.short {
      width: 60%;
    }

    /* Modern Layout */
    .preview-modern {
      background: white;
      padding: 12px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .modern-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-color);
    }

    .modern-avatar {
      width: 28px;
      height: 28px;
      background: var(--primary-color);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .modern-info {
      flex: 1;
    }

    .modern-name {
      font-weight: 700;
      font-size: 10px;
      color: #1f2937;
      margin: 0;
    }

    .modern-title {
      font-size: 8px;
      color: #6b7280;
      margin: 0;
    }

    .modern-content {
      flex: 1;
      overflow: hidden;
    }

    .modern-section {
      margin-bottom: 6px;
    }

    .modern-section-title {
      font-weight: 700;
      font-size: 9px;
      color: var(--primary-color);
      margin-bottom: 3px;
    }

    .modern-line {
      height: 2px;
      background: #e5e7eb;
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .modern-line.short {
      width: 60%;
    }
  `]
})
export class TemplatePreviewComponent {
  @Input() template!: TemplateMetadata;
}
