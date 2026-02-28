import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        
        <h2>Creating Your Resume...</h2>
        
        <div class="progress-steps">
          <div class="step" [class.completed]="currentStep >= 1" [class.active]="currentStep === 1">
            <div class="step-icon">
              <svg *ngIf="currentStep > 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span *ngIf="currentStep <= 1">1</span>
            </div>
            <span>Loading 32+ Professional Resume Designs</span>
          </div>
          
          <div class="step" [class.completed]="currentStep >= 2" [class.active]="currentStep === 2">
            <div class="step-icon">
              <svg *ngIf="currentStep > 2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span *ngIf="currentStep <= 2">2</span>
            </div>
            <span>Preparing 100,000+ Pre-Written Phrases</span>
          </div>
          
          <div class="step" [class.completed]="currentStep >= 3" [class.active]="currentStep === 3">
            <div class="step-icon">
              <svg *ngIf="currentStep > 3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span *ngIf="currentStep <= 3">3</span>
            </div>
            <span>Loading 15,000+ Job Titles</span>
          </div>
          
          <div class="step" [class.completed]="currentStep >= 4" [class.active]="currentStep === 4">
            <div class="step-icon">
              <svg *ngIf="currentStep > 4" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span *ngIf="currentStep <= 4">4</span>
            </div>
            <span>Setting Up 9 Template Color Options</span>
          </div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progress"></div>
        </div>
        
        <p class="loading-text">{{ loadingMessages[currentMessageIndex] }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .loading-content {
      text-align: center;
      color: white;
      max-width: 500px;
      padding: 40px;
    }

    .loading-spinner {
      margin-bottom: 30px;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    h2 {
      font-size: 28px;
      margin-bottom: 40px;
      font-weight: 600;
    }

    .progress-steps {
      text-align: left;
      margin-bottom: 30px;
    }

    .step {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      opacity: 0.5;
      transition: all 0.5s ease;
    }

    .step.active {
      opacity: 1;
      transform: scale(1.05);
    }

    .step.completed {
      opacity: 1;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-weight: bold;
      transition: all 0.5s ease;
    }

    .step.completed .step-icon {
      background: #28a745;
      color: white;
    }

    .step.active .step-icon {
      background: white;
      color: #667eea;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .progress-fill {
      height: 100%;
      background: white;
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .loading-text {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
  `]
})
export class LoadingComponent implements OnInit {
  currentStep = 0;
  progress = 0;
  currentMessageIndex = 0;
  
  loadingMessages = [
    'Initializing resume builder...',
    'Loading professional templates...',
    'Preparing content suggestions...',
    'Setting up job database...',
    'Configuring design options...',
    'Almost ready!'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startLoading();
  }

  startLoading() {
    const totalSteps = 4;
    const stepDuration = 1000; // 1 second per step
    
    const interval = setInterval(() => {
      this.currentStep++;
      this.progress = (this.currentStep / totalSteps) * 100;
      
      if (this.currentStep <= totalSteps) {
        this.currentMessageIndex = this.currentStep;
      }
      
      if (this.currentStep > totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          this.router.navigate(['/resume-process']);
        }, 500);
      }
    }, stepDuration);
  }
}