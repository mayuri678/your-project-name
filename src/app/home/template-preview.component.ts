import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="preview-container" [ngSwitch]="templateId % 5">
      <!-- Executive Layout -->
      <div *ngSwitchCase="0" class="preview-executive">
        <div class="preview-header-exec">
          <div class="preview-avatar"></div>
          <div class="preview-header-text">
            <div class="preview-name">John Doe</div>
            <div class="preview-title">Senior Manager</div>
          </div>
        </div>
        <div class="preview-contact">
          <span>✉ john@email.com</span>
          <span>📱 +1 234 567</span>
        </div>
        <div class="preview-content">
          <div class="preview-section">
            <div class="preview-section-title">Experience</div>
            <div class="preview-line"></div>
            <div class="preview-line short"></div>
          </div>
          <div class="preview-section">
            <div class="preview-section-title">Skills</div>
            <div class="preview-line"></div>
          </div>
        </div>
      </div>

      <!-- Sidebar Layout -->
      <div *ngSwitchCase="1" class="preview-sidebar">
        <div class="preview-sidebar-left">
          <div class="preview-avatar-circle"></div>
          <div class="preview-sidebar-text">
            <div class="preview-name-small">Jane Smith</div>
            <div class="preview-title-small">Designer</div>
          </div>
          <div class="preview-sidebar-section">
            <div class="preview-section-title-small">Skills</div>
            <div class="preview-line-small"></div>
            <div class="preview-line-small"></div>
          </div>
        </div>
        <div class="preview-sidebar-right">
          <div class="preview-section-title">Experience</div>
          <div class="preview-line"></div>
          <div class="preview-line short"></div>
          <div class="preview-section-title">Education</div>
          <div class="preview-line"></div>
        </div>
      </div>

      <!-- Minimal Layout -->
      <div *ngSwitchCase="2" class="preview-minimal">
        <div class="preview-header-minimal">
          <div class="preview-name">Alex Johnson</div>
          <div class="preview-title-minimal">Professional</div>
        </div>
        <div class="preview-content-minimal">
          <div class="preview-line"></div>
          <div class="preview-line"></div>
          <div class="preview-line short"></div>
        </div>
      </div>

      <!-- Creative Layout -->
      <div *ngSwitchCase="3" class="preview-creative">
        <div class="preview-accent-bar"></div>
        <div class="preview-header-creative">
          <div class="preview-name">Sarah Williams</div>
        </div>
        <div class="preview-content-creative">
          <div class="preview-line"></div>
          <div class="preview-line"></div>
          <div class="preview-section-title">Skills</div>
          <div class="preview-line short"></div>
        </div>
      </div>

      <!-- Modern Layout -->
      <div *ngSwitchCase="4" class="preview-modern">
        <div class="preview-header-modern">
          <div class="preview-avatar-small"></div>
          <div class="preview-name-small">Profile</div>
        </div>
        <div class="preview-content-modern">
          <div class="preview-line"></div>
          <div class="preview-line short"></div>
          <div class="preview-line"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-container {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      font-size: 10px;
      font-family: Arial, sans-serif;
      color: #333;
    }

    /* Executive Layout */
    .preview-executive {
      padding: 12px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .preview-header-exec {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }

    .preview-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .preview-header-text {
      flex: 1;
    }

    .preview-name {
      font-weight: 700;
      font-size: 11px;
      margin: 0;
    }

    .preview-title {
      font-size: 9px;
      opacity: 0.9;
      margin: 0;
    }

    .preview-contact {
      display: flex;
      gap: 8px;
      font-size: 8px;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      flex-wrap: wrap;
    }

    .preview-content {
      flex: 1;
      overflow: hidden;
    }

    .preview-section {
      margin-bottom: 6px;
    }

    .preview-section-title {
      font-weight: 700;
      font-size: 9px;
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    .preview-line {
      height: 2px;
      background: rgba(255,255,255,0.4);
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .preview-line.short {
      width: 60%;
    }

    /* Sidebar Layout */
    .preview-sidebar {
      display: flex;
      height: 100%;
      background: white;
    }

    .preview-sidebar-left {
      width: 35%;
      background: linear-gradient(180deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 10px;
      display: flex;
      flex-direction: column;
    }

    .preview-avatar-circle {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      margin: 0 auto 8px;
    }

    .preview-name-small {
      font-weight: 700;
      font-size: 10px;
      text-align: center;
      margin-bottom: 2px;
    }

    .preview-title-small {
      font-size: 8px;
      text-align: center;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .preview-sidebar-section {
      margin-top: 8px;
    }

    .preview-section-title-small {
      font-weight: 700;
      font-size: 8px;
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    .preview-line-small {
      height: 1.5px;
      background: rgba(255,255,255,0.3);
      margin-bottom: 2px;
      border-radius: 1px;
    }

    .preview-sidebar-right {
      flex: 1;
      padding: 10px;
      overflow: hidden;
    }

    /* Minimal Layout */
    .preview-minimal {
      padding: 12px;
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .preview-header-minimal {
      margin-bottom: 10px;
      border-bottom: 2px solid #333;
      padding-bottom: 6px;
    }

    .preview-title-minimal {
      font-size: 8px;
      color: #666;
    }

    .preview-content-minimal {
      flex: 1;
    }

    /* Creative Layout */
    .preview-creative {
      padding: 12px;
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
    }

    .preview-accent-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ff6b6b, #ff8e72);
    }

    .preview-header-creative {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .preview-content-creative {
      flex: 1;
      overflow: hidden;
    }

    /* Modern Layout */
    .preview-modern {
      padding: 12px;
      background: white;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .preview-header-modern {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid #2563eb;
    }

    .preview-avatar-small {
      width: 28px;
      height: 28px;
      background: #2563eb;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .preview-content-modern {
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class TemplatePreviewComponent {
  @Input() templateId: number = 0;
}
