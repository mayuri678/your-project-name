import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from './models/resume-data.interface';
import { Template01Component } from './components/template-01.component';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule, Template01Component],
  template: `
    <div class="template-selector">
      <div class="template-preview" [ngSwitch]="selectedTemplate">
        <app-template-01 *ngSwitchCase="1" [data]="resumeData"></app-template-01>
        <div *ngSwitchDefault class="p-8 text-center">
          <p>Select a template to preview</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-selector {
      width: 100%;
      min-height: 100vh;
    }
    .template-preview {
      background: #f5f5f5;
      padding: 2rem;
    }
  `]
})
export class TemplateSelectorComponent {
  @Input() resumeData: ResumeData = {} as ResumeData;
  @Input() selectedTemplate: number = 1;
  @Output() templateChange = new EventEmitter<number>();
}
