import { Injectable } from '@angular/core';
import { ResumeTemplate, RESUME_TEMPLATES } from './models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  getTemplates(): ResumeTemplate[] {
    return RESUME_TEMPLATES;
  }

  getTemplateById(id: string): ResumeTemplate | undefined {
    return RESUME_TEMPLATES.find(t => t.id === id);
  }

  saveSelectedTemplate(template: ResumeTemplate): void {
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
  }

  getSelectedTemplate(): ResumeTemplate | null {
    const stored = localStorage.getItem('selectedTemplate');
    return stored ? JSON.parse(stored) : null;
  }
}
