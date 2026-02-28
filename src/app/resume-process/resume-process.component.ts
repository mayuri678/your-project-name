import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-process',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-process-container">
      <div class="header">
        <div class="logo">
          <div class="logo-icon">📄</div>
          <span class="logo-text">Resume<br>Now.</span>
        </div>
      </div>

      <div class="content">
        <h1>Here's how we get you hired</h1>
        
        <div class="process-steps">
          <div class="step-card" [class.active]="currentStep === 1">
            <div class="step-header">
              <div class="progress-bar" [class.completed]="currentStep >= 1"></div>
            </div>
            <div class="step-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <div class="click-indicator" *ngIf="currentStep === 1">👆</div>
            </div>
            <h3>Pick a template</h3>
            <div class="step-features">
              <div class="feature">✓ ATS friendly</div>
              <div class="feature">✓ Flexible layouts</div>
              <div class="feature">✓ Job and industry match</div>
            </div>
          </div>

          <div class="step-card" [class.active]="currentStep === 2">
            <div class="step-header">
              <div class="progress-bar" [class.completed]="currentStep >= 2"></div>
            </div>
            <div class="step-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </div>
            <h3>Add content with AI</h3>
            <div class="step-features">
              <div class="feature">✓ Words that match what you do</div>
              <div class="feature">✓ Edit & enhance with AI</div>
              <div class="feature">✓ Quickly tailor for every application</div>
            </div>
          </div>

          <div class="step-card" [class.active]="currentStep === 3">
            <div class="step-header">
              <div class="progress-bar" [class.completed]="currentStep >= 3"></div>
            </div>
            <div class="step-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <path d="M12 18v-6l-3 3"></path>
                <path d="M9 15l3 3 3-3"></path>
              </svg>
            </div>
            <h3>Download & send</h3>
            <div class="step-features">
              <div class="feature">✓ Popular file formats</div>
              <div class="feature">✓ Instant digital profile</div>
              <div class="feature">✓ Unlimited versions</div>
            </div>
          </div>
        </div>

        <button class="continue-btn" (click)="continue()">
          Continue
        </button>

        <div class="terms">
          By clicking above, you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resume-process-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      color: #fff;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    h1 {
      font-size: 48px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 60px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .process-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }

    .step-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      padding: 30px 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      position: relative;
      opacity: 0.6;
      transition: all 0.5s ease;
      border: 2px solid transparent;
    }

    .step-card.active {
      opacity: 1;
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      border: 2px solid #ffd700;
      background: linear-gradient(135deg, #fff 0%, #f0f8ff 100%);
    }

    .step-header {
      margin-bottom: 20px;
    }

    .progress-bar {
      height: 6px;
      background: #ddd;
      border-radius: 3px;
      width: 100%;
      transition: background 0.5s ease;
    }

    .progress-bar.completed {
      background: linear-gradient(90deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%);
    }

    .step-icon {
      position: relative;
      margin-bottom: 20px;
      color: #667eea;
    }

    .step-card.active .step-icon {
      color: #ff6b6b;
    }

    .click-indicator {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 20px;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .step-card.active h3 {
      color: #667eea;
    }

    .step-features {
      text-align: left;
    }

    .feature {
      margin-bottom: 8px;
      color: #666;
      font-size: 16px;
    }

    .continue-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      padding: 16px 60px;
      border-radius: 30px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
    }

    .continue-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
    }

    .terms {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
    }

    .terms a {
      color: #ffd700;
      text-decoration: none;
      font-weight: 600;
    }

    .terms a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 32px;
      }
      
      .process-steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResumeProcessComponent {
  currentStep = 1;

  constructor(private router: Router) {
    this.startStepProgression();
  }

  startStepProgression(): void {
    setTimeout(() => {
      this.currentStep = 2;
      setTimeout(() => {
        this.currentStep = 3;
      }, 1500);
    }, 1500);
  }

  continue(): void {
    this.router.navigate(['/template-selection']);
  }
}