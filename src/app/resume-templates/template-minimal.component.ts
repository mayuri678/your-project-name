import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-minimal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-template minimal-template">
      <div class="header">
        <h1>{{resumeData.name}}</h1>
        <p class="title">{{resumeData.title}}</p>
        <div class="contact">
          <span>{{resumeData.email}}</span> | 
          <span>{{resumeData.phone}}</span> | 
          <span>{{resumeData.location}}</span>
        </div>
      </div>

      <div class="section" *ngIf="resumeData.summary">
        <h2>Summary</h2>
        <p>{{resumeData.summary}}</p>
      </div>

      <div class="section" *ngIf="resumeData.experience?.length">
        <h2>Experience</h2>
        <div *ngFor="let exp of resumeData.experience" class="item">
          <h3>{{exp.position}}</h3>
          <p class="company">{{exp.company}} | {{exp.duration}}</p>
          <p>{{exp.description}}</p>
        </div>
      </div>

      <div class="section" *ngIf="resumeData.education?.length">
        <h2>Education</h2>
        <div *ngFor="let edu of resumeData.education" class="item">
          <h3>{{edu.degree}}</h3>
          <p>{{edu.institution}} | {{edu.year}}</p>
        </div>
      </div>

      <div class="section" *ngIf="resumeData.skills?.length">
        <h2>Skills</h2>
        <div class="skills">
          <span *ngFor="let skill of resumeData.skills" class="skill">{{skill}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .minimal-template {
      background: white;
      padding: 2rem;
      max-width: 210mm;
      margin: 0 auto;
      font-family: 'Arial', sans-serif;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
      border-bottom: 2px solid #333;
      padding-bottom: 1rem;
    }
    .header h1 {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }
    .title {
      font-size: 1.2rem;
      color: #666;
      margin: 0.5rem 0;
    }
    .contact {
      font-size: 0.9rem;
      color: #666;
    }
    .section {
      margin-bottom: 1.5rem;
    }
    .section h2 {
      font-size: 1.3rem;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.3rem;
      margin-bottom: 1rem;
    }
    .item {
      margin-bottom: 1rem;
    }
    .item h3 {
      font-size: 1.1rem;
      margin: 0;
      color: #333;
    }
    .company {
      color: #666;
      font-size: 0.9rem;
      margin: 0.2rem 0;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .skill {
      background: #f0f0f0;
      padding: 0.3rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    @media print {
      .minimal-template {
        padding: 0;
      }
    }
  `]
})
export class TemplateMinimalComponent {
  @Input() resumeData: any = {};
}
