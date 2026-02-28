import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-options-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-options-overlay" (click)="close.emit()">
      <div class="resume-options-modal" (click)="$event.stopPropagation()">
        <div class="resume-options-header">
          <h2>Create Your Resume</h2>
          <button class="close-modal-btn" (click)="close.emit()">×</button>
        </div>

        <div class="resume-options-content">
          <!-- Design Resume Card -->
          <div class="resume-option-card" (click)="designResume()">
            <div class="option-icon">🎨</div>
            <h3>Design Resume</h3>
            <p>Use our resume builder to create a professional resume with customizable templates</p>

            <div class="option-features">
              <span class="feature-badge">✓ Customizable</span>
              <span class="feature-badge">✓ Professional</span>
              <span class="feature-badge">✓ Easy to Use</span>
            </div>

            <button class="option-btn primary-option" (click)="designResume(); $event.stopPropagation()">
              ✨ Start Designing Now
            </button>
          </div>

          <!-- Google Templates Card -->
          <div class="resume-option-card" (click)="getGoogleTemplates()">
            <div class="option-icon">📚</div>
            <h3>Google Templates</h3>
            <p>Browse and download resume templates from Google Docs</p>

            <div class="option-features">
              <span class="feature-badge">✓ Free Templates</span>
              <span class="feature-badge">✓ Google Docs</span>
              <span class="feature-badge">✓ Various Styles</span>
            </div>

            <button class="option-btn secondary-option" (click)="getGoogleTemplates(); $event.stopPropagation()">
              Browse Templates
            </button>
          </div>

          <!-- MS Word Editor Card -->
          <div class="resume-option-card">
            <div class="option-icon">📝</div>
            <h3>MS Word Editor</h3>
            <p>Minimal Microsoft Word-like editor with authentic styling and A4 layout</p>

            <div class="option-features">
              <span class="feature-badge">✓ Word Interface</span>
              <span class="feature-badge">✓ A4 Layout</span>
              <span class="feature-badge">✓ Rich Text</span>
            </div>

            <button class="option-btn primary-option" (click)="openMsWordEditor()">
              🚀 Open MS Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-options-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .resume-options-modal {
      background: white;
      border-radius: 12px;
      max-width: 900px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .resume-options-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px;
      border-bottom: 1px solid #eee;
    }

    .resume-options-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .close-modal-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.3s;
    }

    .close-modal-btn:hover {
      background: #f5f5f5;
    }

    .resume-options-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      padding: 30px;
    }

    .resume-option-card {
      border: 2px solid #e9ecef;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .resume-option-card:hover {
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
    }

    .option-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .resume-option-card h3 {
      margin: 0 0 12px 0;
      font-size: 20px;
      color: #333;
    }

    .resume-option-card p {
      margin: 0 0 20px 0;
      color: #666;
      line-height: 1.5;
    }

    .option-features {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .feature-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .option-btn {
      width: 100%;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .primary-option {
      background: #007bff;
      color: white;
    }

    .primary-option:hover {
      background: #0056b3;
    }

    .secondary-option {
      background: #28a745;
      color: white;
    }

    .secondary-option:hover {
      background: #1e7e34;
    }
  `]
})
export class ResumeOptionsModalComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  designResume(): void {
    this.router.navigate(['/loading']);
    this.close.emit();
  }

  getGoogleTemplates(): void {
    window.open('https://docs.google.com/document/u/0/?ftv=1&tgif=d&resourcekey=0', '_blank');
    this.close.emit();
  }

  openMsWordEditor(): void {
    this.router.navigate(['/ms-word-editor']);
    this.close.emit();
  }
}