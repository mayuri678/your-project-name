import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-viewer">
      <div class="viewer-header">
        <h2>{{template.name}}</h2>
        <div class="header-actions">
          <button (click)="editTemplate()" class="edit-btn">Edit</button>
          <button (click)="closeViewer()" class="close-btn">&times;</button>
        </div>
      </div>
      
      <div class="template-content">
        <div *ngFor="let section of template.sections" class="section">
          <h3>{{section.title}}</h3>
          
          <div *ngIf="section.type === 'contact'" class="contact-section">
            <p *ngIf="section.data?.email"><strong>Email:</strong> {{section.data.email}}</p>
            <p *ngIf="section.data?.phone"><strong>Phone:</strong> {{section.data.phone}}</p>
            <p *ngIf="section.data?.location"><strong>Location:</strong> {{section.data.location}}</p>
            <p *ngIf="section.data?.linkedin"><strong>LinkedIn:</strong> {{section.data.linkedin}}</p>
            <p *ngIf="section.data?.github"><strong>GitHub:</strong> {{section.data.github}}</p>
          </div>
          
          <div *ngIf="section.type === 'experience'" class="experience-section">
            <div *ngFor="let exp of section.data" class="exp-item">
              <h4 *ngIf="exp.title || exp.company">{{exp.title}} <span *ngIf="exp.company">at {{exp.company}}</span></h4>
              <p *ngIf="exp.duration">{{exp.duration}}</p>
              <p *ngIf="exp.description">{{exp.description}}</p>
            </div>
            <p *ngIf="!section.data || section.data.length === 0">No experience added yet.</p>
          </div>
          
          <div *ngIf="section.type === 'skills'" class="skills-section">
            <div *ngFor="let skill of section.data" class="skill-item">
              <span class="skill-name" *ngIf="skill.name">{{skill.name}}</span>
              <span class="skill-level" *ngIf="skill.level"> - {{skill.level}}</span>
            </div>
            <p *ngIf="!section.data || section.data.length === 0">No skills added yet.</p>
          </div>
          
          <div *ngIf="section.type === 'education'" class="education-section">
            <div *ngFor="let edu of section.data" class="edu-item">
              <h4 *ngIf="edu.degree">{{edu.degree}}</h4>
              <p *ngIf="edu.institution || edu.year">{{edu.institution}} <span *ngIf="edu.year">- {{edu.year}}</span></p>
            </div>
            <p *ngIf="!section.data || section.data.length === 0">No education added yet.</p>
          </div>
          
          <div *ngIf="section.type === 'projects'" class="projects-section">
            <div *ngFor="let project of section.data" class="project-item">
              <h4 *ngIf="project.name">{{project.name}}</h4>
              <p *ngIf="project.description">{{project.description}}</p>
              <p *ngIf="project.technologies"><strong>Technologies:</strong> {{project.technologies}}</p>
            </div>
            <p *ngIf="!section.data || section.data.length === 0">No projects added yet.</p>
          </div>
          
          <div *ngIf="section.type === 'certifications'" class="certs-section">
            <div *ngFor="let cert of section.data" class="cert-item">
              <h4 *ngIf="cert.name">{{cert.name}}</h4>
              <p *ngIf="cert.issuer || cert.date">{{cert.issuer}} <span *ngIf="cert.date">- {{cert.date}}</span></p>
            </div>
            <p *ngIf="!section.data || section.data.length === 0">No certifications added yet.</p>
          </div>
          
          <div *ngIf="section.type === 'highlights'" class="highlights-section">
            <div *ngFor="let highlight of section.data" class="highlight-item">
              <p *ngIf="highlight.text">{{highlight.text}}</p>
            </div>
            <p *ngIf="!section.data || section.data.length === 0">No highlights added yet.</p>
          </div>
        </div>
        
        <!-- Debug info -->
        <div class="debug-info" style="margin-top: 20px; padding: 10px; background: #f0f0f0; font-size: 12px;">
          <strong>Debug:</strong> Template has {{template.sections?.length || 0}} sections
          <pre>{{template | json}}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-viewer { 
      padding: 20px; 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 8px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .viewer-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .header-actions { display: flex; gap: 10px; }
    .edit-btn { 
      background: #007bff; 
      color: white; 
      border: none; 
      padding: 8px 16px; 
      border-radius: 4px; 
      cursor: pointer; 
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
    .section { 
      margin: 20px 0; 
      padding: 15px; 
      border: 1px solid #ddd; 
      border-radius: 5px; 
    }
    .section h3 { 
      margin: 0 0 15px; 
      color: #333; 
      border-bottom: 1px solid #eee; 
      padding-bottom: 5px; 
    }
    .exp-item, .edu-item, .project-item, .cert-item { 
      margin: 10px 0; 
      padding: 10px; 
      background: #f9f9f9; 
      border-radius: 3px; 
    }
    .skill-item { 
      display: inline-block; 
      margin: 5px; 
      padding: 5px 10px; 
      background: #e3f2fd; 
      border-radius: 15px; 
    }
    .skill-level { 
      font-size: 0.8em; 
      color: #666; 
      margin-left: 5px; 
    }
    .highlight-item { 
      margin: 5px 0; 
      padding: 8px; 
      background: #fff3cd; 
      border-left: 3px solid #ffc107; 
    }
  `]
})
export class TemplateViewerComponent implements OnInit {
  @Input() template: any;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();

  ngOnInit() {
    console.log('Template viewer initialized with:', this.template);
  }

  editTemplate() {
    this.edit.emit(this.template);
  }

  closeViewer() {
    this.close.emit();
  }
}