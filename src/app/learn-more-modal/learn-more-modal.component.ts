import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learn-more-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="learn-more-overlay" (click)="close.emit()">
      <div class="learn-more-modal" (click)="$event.stopPropagation()">
        <div class="learn-more-header">
          <div class="header-content">
            <h2>Why Choose Resume Builder?</h2>
            <p class="header-subtitle">Create professional resumes that get you noticed</p>
          </div>
          <button class="close-modal-btn" (click)="close.emit()" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="learn-more-content">
          <div class="features-grid-new">
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3>28+ Professional Templates</h3>
              <p>Choose from ATS-friendly templates</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                </svg>
              </div>
              <h3>Easy Editing</h3>
              <p>No design skills needed</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                </svg>
              </div>
              <h3>Download as PDF</h3>
              <p>High-quality PDF export</p>
            </div>
          </div>

          <div class="cta-section-new">
            <h3>Ready to Build Your Perfect Resume?</h3>
            <button class="cta-button-new" (click)="openResumeOptions.emit()">
              <span>Get Started Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .learn-more-overlay {
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

    .learn-more-modal {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .learn-more-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 30px;
      border-bottom: 1px solid #eee;
    }

    .header-content h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: #333;
    }

    .header-subtitle {
      margin: 0;
      color: #666;
    }

    .close-modal-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.3s;
    }

    .close-modal-btn:hover {
      background: #f5f5f5;
    }

    .learn-more-content {
      padding: 30px;
    }

    .features-grid-new {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .feature-card {
      text-align: center;
      padding: 20px;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .feature-icon-wrapper {
      margin-bottom: 15px;
      color: #007bff;
    }

    .feature-card h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      color: #333;
    }

    .feature-card p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .cta-section-new {
      text-align: center;
    }

    .cta-section-new h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .cta-button-new {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .cta-button-new:hover {
      background: #0056b3;
    }
  `]
})
export class LearnMoreModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() openResumeOptions = new EventEmitter<void>();
}