import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeTranslationService } from '../services/resume-translation.service';

@Component({
  selector: 'app-resume-translator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="translator-container">
      <h2>Professional Resume Translation Assistant</h2>
      
      <div class="input-section">
        <label for="targetLanguage">Target Language:</label>
        <select id="targetLanguage" [(ngModel)]="targetLanguage" class="form-control">
          <option value="">Select Language</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="italian">Italian</option>
          <option value="portuguese">Portuguese</option>
        </select>
      </div>
      
      <div class="input-section">
        <label for="resumeInput">English Resume:</label>
        <textarea 
          id="resumeInput"
          [(ngModel)]="resumeText" 
          placeholder="Paste your English resume here..."
          class="form-control"
          rows="15">
        </textarea>
      </div>
      
      <button 
        (click)="translateResume()" 
        [disabled]="!resumeText || !targetLanguage"
        class="translate-btn">
        Translate Resume
      </button>
      
      <div class="output-section" *ngIf="translatedResume">
        <h3>Translated Resume ({{targetLanguage | titlecase}}):</h3>
        <div class="translated-content">
          <pre>{{translatedResume}}</pre>
        </div>
        <button (click)="copyToClipboard()" class="copy-btn">Copy to Clipboard</button>
      </div>
    </div>
  `,
  styles: [`
    .translator-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .input-section {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 300px;
    }
    
    .translate-btn, .copy-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-right: 10px;
    }
    
    .translate-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .translate-btn:hover:not(:disabled), .copy-btn:hover {
      background-color: #0056b3;
    }
    
    .output-section {
      margin-top: 30px;
      border-top: 2px solid #eee;
      padding-top: 20px;
    }
    
    .translated-content {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
      max-height: 500px;
      overflow-y: auto;
    }
    
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      font-family: inherit;
    }
  `]
})
export class ResumeTranslatorComponent {
  resumeText: string = '';
  targetLanguage: string = '';
  translatedResume: string = '';
  
  constructor(private translationService: ResumeTranslationService) {}
  
  translateResume(): void {
    if (!this.resumeText || !this.targetLanguage) return;
    
    this.translatedResume = this.translationService.translateResume(
      this.resumeText, 
      this.targetLanguage
    );
  }
  
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.translatedResume).then(() => {
      alert('Translated resume copied to clipboard!');
    });
  }
}