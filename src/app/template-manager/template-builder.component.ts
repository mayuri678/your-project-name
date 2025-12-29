import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TemplateSection {
  id: string;
  type: string;
  title: string;
  required: boolean;
  data?: any;
}

@Component({
  selector: 'app-template-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="template-builder">
      <div class="builder-header">
        <h2>Template Builder</h2>
        <button (click)="closeBuilder()" class="close-btn">&times;</button>
      </div>
      
      <div class="template-form">
        <input [(ngModel)]="templateName" placeholder="Template Name" class="template-name">
        
        <div class="add-section">
          <select [(ngModel)]="selectedSectionType">
            <option value="">Select Section to Add</option>
            <option *ngFor="let type of getAvailableSections()" [value]="type.type">{{type.title}}</option>
          </select>
          <button (click)="addSection()" [disabled]="!selectedSectionType">Add Section</button>
        </div>
        
        <div class="sections-container">
          <div *ngFor="let section of sections; trackBy: trackSection" class="section-item">
            <div class="section-header">
              <span>{{section.title}}</span>
              <button *ngIf="!section.required" (click)="removeSection(section.id)" class="delete-btn">&times;</button>
            </div>
            
            <div class="section-content">
              <div *ngIf="section.type === 'contact'">
                <input [(ngModel)]="section.data.email" placeholder="Email">
                <input [(ngModel)]="section.data.phone" placeholder="Phone">
                <input [(ngModel)]="section.data.location" placeholder="Location">
                <input [(ngModel)]="section.data.linkedin" placeholder="LinkedIn">
                <input [(ngModel)]="section.data.github" placeholder="GitHub">
              </div>
              
              <div *ngIf="section.type === 'experience'">
                <div *ngFor="let exp of section.data; let i = index" class="experience-item">
                  <input [(ngModel)]="exp.title" placeholder="Job Title">
                  <input [(ngModel)]="exp.company" placeholder="Company">
                  <input [(ngModel)]="exp.duration" placeholder="Duration">
                  <textarea [(ngModel)]="exp.description" placeholder="Description"></textarea>
                  <button (click)="removeExperience(section.id, i)">Remove</button>
                </div>
                <button (click)="addExperience(section.id)">Add Experience</button>
              </div>
              
              <div *ngIf="section.type === 'skills'">
                <div *ngFor="let skill of section.data; let i = index" class="skill-item">
                  <input [(ngModel)]="skill.name" placeholder="Skill">
                  <select [(ngModel)]="skill.level">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button (click)="removeSkill(section.id, i)">Remove</button>
                </div>
                <button (click)="addSkill(section.id)">Add Skill</button>
              </div>
              
              <div *ngIf="section.type === 'education'">
                <div *ngFor="let edu of section.data; let i = index" class="education-item">
                  <input [(ngModel)]="edu.degree" placeholder="Degree">
                  <input [(ngModel)]="edu.institution" placeholder="Institution">
                  <input [(ngModel)]="edu.year" placeholder="Year">
                  <button (click)="removeEducation(section.id, i)">Remove</button>
                </div>
                <button (click)="addEducation(section.id)">Add Education</button>
              </div>
              
              <div *ngIf="section.type === 'projects'">
                <div *ngFor="let project of section.data; let i = index" class="project-item">
                  <input [(ngModel)]="project.name" placeholder="Project Name">
                  <textarea [(ngModel)]="project.description" placeholder="Description"></textarea>
                  <input [(ngModel)]="project.technologies" placeholder="Technologies">
                  <button (click)="removeProject(section.id, i)">Remove</button>
                </div>
                <button (click)="addProject(section.id)">Add Project</button>
              </div>
              
              <div *ngIf="section.type === 'certifications'">
                <div *ngFor="let cert of section.data; let i = index" class="cert-item">
                  <input [(ngModel)]="cert.name" placeholder="Certification Name">
                  <input [(ngModel)]="cert.issuer" placeholder="Issuer">
                  <input [(ngModel)]="cert.date" placeholder="Date">
                  <button (click)="removeCertification(section.id, i)">Remove</button>
                </div>
                <button (click)="addCertification(section.id)">Add Certification</button>
              </div>
              
              <div *ngIf="section.type === 'highlights'">
                <div *ngFor="let highlight of section.data; let i = index" class="highlight-item">
                  <textarea [(ngModel)]="highlight.text" placeholder="Highlight"></textarea>
                  <button (click)="removeHighlight(section.id, i)">Remove</button>
                </div>
                <button (click)="addHighlight(section.id)">Add Highlight</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button (click)="saveTemplate()" class="save-btn">Save Template</button>
          <button (click)="closeBuilder()" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-builder { 
      padding: 20px; 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 8px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .builder-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .close-btn { 
      background: #ff4444; 
      color: white; 
      border: none; 
      border-radius: 50%; 
      width: 30px; 
      height: 30px; 
      cursor: pointer; 
      font-size: 18px; 
    }
    .template-name { 
      width: 100%; 
      padding: 10px; 
      margin-bottom: 20px; 
      font-size: 18px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .section-item { 
      border: 1px solid #ddd; 
      margin: 10px 0; 
      padding: 15px; 
      border-radius: 5px; 
    }
    .section-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 10px; 
      font-weight: bold; 
    }
    .delete-btn { 
      background: #ff4444; 
      color: white; 
      border: none; 
      border-radius: 50%; 
      width: 25px; 
      height: 25px; 
      cursor: pointer; 
    }
    .section-content input, .section-content textarea, .section-content select { 
      width: 100%; 
      padding: 8px; 
      margin: 5px 0; 
      border: 1px solid #ccc; 
      border-radius: 3px; 
    }
    .add-section { 
      display: flex; 
      gap: 10px; 
      margin: 20px 0; 
    }
    .add-section select { 
      flex: 1; 
      padding: 10px; 
    }
    .actions { 
      display: flex; 
      gap: 10px; 
      margin-top: 20px; 
    }
    .save-btn, .cancel-btn { 
      padding: 12px 24px; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer; 
    }
    .save-btn { 
      background: #007bff; 
      color: white; 
    }
    .cancel-btn { 
      background: #6c757d; 
      color: white; 
    }
  `]
})
export class TemplateBuilderComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() templateSaved = new EventEmitter<void>();
  @Input() editTemplateData: any = null;
  
  templateName = '';
  selectedSectionType = '';
  editingTemplateId: string | null = null;
  
  sections: TemplateSection[] = [];

  ngOnInit() {
    // Initialize with default contact section
    if (!this.editTemplateData) {
      this.sections = [
        {
          id: 'contact',
          type: 'contact',
          title: 'Contact Information',
          required: true,
          data: { email: 'admin', phone: '+1-234-567-8900', location: 'City, State, Country', linkedin: 'linkedin.com/in/username', github: 'github.com/username' }
        }
      ];
    } else {
      console.log('Loading edit template data:', this.editTemplateData);
      this.templateName = this.editTemplateData.name || '';
      this.sections = JSON.parse(JSON.stringify(this.editTemplateData.sections)) || this.sections;
      this.editingTemplateId = this.editTemplateData.id;
      console.log('Loaded sections:', this.sections);
    }
  }

  availableSections = [
    { type: 'experience', title: 'Experience' },
    { type: 'skills', title: 'Technical Skills' },
    { type: 'education', title: 'Education' },
    { type: 'projects', title: 'Projects' },
    { type: 'certifications', title: 'Certifications' },
    { type: 'highlights', title: 'Highlights' }
  ];

  getAvailableSections() {
    return this.availableSections.filter(section => 
      !this.sections.some(s => s.type === section.type)
    );
  }

  trackSection(index: number, section: TemplateSection) {
    return section.id;
  }

  addSection() {
    if (!this.selectedSectionType) return;
    
    const sectionType = this.availableSections.find(s => s.type === this.selectedSectionType);
    if (!sectionType) return;

    const newSection: TemplateSection = {
      id: Date.now().toString(),
      type: this.selectedSectionType,
      title: sectionType.title,
      required: false,
      data: this.getDefaultData(this.selectedSectionType)
    };

    this.sections.push(newSection);
    this.selectedSectionType = '';
  }

  removeSection(sectionId: string) {
    this.sections = this.sections.filter(s => s.id !== sectionId);
  }

  getDefaultData(type: string) {
    switch (type) {
      case 'experience': return [{ title: 'Software Developer', company: 'Tech Company', duration: '2020-2023', description: 'Developed web applications using modern technologies' }];
      case 'skills': return [{ name: 'HTML', level: 'Advanced' }, { name: 'CSS', level: 'Advanced' }, { name: 'JavaScript', level: 'Intermediate' }];
      case 'education': return [{ degree: 'Bachelor of Computer Science', institution: 'University Name', year: '2020' }];
      case 'projects': return [{ name: 'Portfolio Website', description: 'Personal portfolio built with Angular', technologies: 'Angular, TypeScript, CSS' }];
      case 'certifications': return [{ name: 'Angular Developer Certification', issuer: 'Google', date: '2023' }];
      case 'highlights': return [{ text: 'Led a team of 5 developers in successful project delivery' }];
      default: return {};
    }
  }

  addExperience(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.push({ title: '', company: '', duration: '', description: '' });
  }

  removeExperience(sectionId: string, index: number) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.splice(index, 1);
  }

  addSkill(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.push({ name: '', level: 'Intermediate' });
  }

  removeSkill(sectionId: string, index: number) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.splice(index, 1);
  }

  addEducation(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.push({ degree: '', institution: '', year: '' });
  }

  removeEducation(sectionId: string, index: number) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.splice(index, 1);
  }

  addProject(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.push({ name: '', description: '', technologies: '' });
  }

  removeProject(sectionId: string, index: number) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.splice(index, 1);
  }

  addCertification(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.push({ name: '', issuer: '', date: '' });
  }

  removeCertification(sectionId: string, index: number) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.splice(index, 1);
  }

  addHighlight(sectionId: string) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.push({ text: '' });
  }

  removeHighlight(sectionId: string, index: number) {
    const section = this.sections.find(s => s.id === sectionId);
    if (section) section.data.splice(index, 1);
  }

  saveTemplate() {
    if (!this.templateName.trim()) {
      alert('Please enter template name');
      return;
    }
    
    const template = {
      name: this.templateName,
      sections: this.sections,
      createdAt: new Date().toISOString()
    };
    
    const templateId = this.editingTemplateId || `my_template_${Date.now()}`;
    localStorage.setItem(templateId, JSON.stringify(template));
    console.log('Template saved with ID:', templateId, template);
    
    alert('Template saved successfully!');
    this.templateSaved.emit();
    this.closeBuilder();
  }

  closeBuilder() {
    this.close.emit();
  }

  previewTemplate() {
    console.log('Preview template:', { name: this.templateName, sections: this.sections });
  }
}