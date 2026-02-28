import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resume-template sidebar-template">
      <div class="sidebar">
        <div class="photo" *ngIf="resumeData.photo">
          <img [src]="resumeData.photo" alt="Profile">
        </div>
        <div class="contact-section">
          <h3>Contact</h3>
          <p>{{resumeData.email}}</p>
          <p>{{resumeData.phone}}</p>
          <p>{{resumeData.location}}</p>
        </div>
        <div class="skills-section" *ngIf="resumeData.skills?.length">
          <h3>Skills</h3>
          <div *ngFor="let skill of resumeData.skills" class="skill-item">{{skill}}</div>
        </div>
      </div>
      <div class="main-content">
        <div class="header">
          <h1>{{resumeData.name}}</h1>
          <p class="title">{{resumeData.title}}</p>
        </div>
        <div class="section" *ngIf="resumeData.summary">
          <h2>About Me</h2>
          <p>{{resumeData.summary}}</p>
        </div>
        <div class="section" *ngIf="resumeData.experience?.length">
          <h2>Experience</h2>
          <div *ngFor="let exp of resumeData.experience" class="item">
            <h3>{{exp.position}}</h3>
            <p class="meta">{{exp.company}} | {{exp.duration}}</p>
            <p>{{exp.description}}</p>
          </div>
        </div>
        <div class="section" *ngIf="resumeData.education?.length">
          <h2>Education</h2>
          <div *ngFor="let edu of resumeData.education" class="item">
            <h3>{{edu.degree}}</h3>
            <p class="meta">{{edu.institution}} | {{edu.year}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-template {
      display: flex;
      max-width: 210mm;
      margin: 0 auto;
      background: white;
    }
    .sidebar {
      width: 35%;
      background: #2c3e50;
      color: white;
      padding: 2rem 1.5rem;
    }
    .photo {
      text-align: center;
      margin-bottom: 2rem;
    }
    .photo img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid white;
    }
    .sidebar h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.5rem;
    }
    .contact-section, .skills-section {
      margin-bottom: 2rem;
    }
    .contact-section p {
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }
    .skill-item {
      background: #34495e;
      padding: 0.4rem 0.8rem;
      margin: 0.5rem 0;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .main-content {
      width: 65%;
      padding: 2rem;
    }
    .header h1 {
      font-size: 2.2rem;
      color: #2c3e50;
      margin: 0;
    }
    .title {
      font-size: 1.2rem;
      color: #3498db;
      margin: 0.5rem 0 2rem;
    }
    .section {
      margin-bottom: 2rem;
    }
    .section h2 {
      font-size: 1.4rem;
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    .item {
      margin-bottom: 1.5rem;
    }
    .item h3 {
      font-size: 1.1rem;
      color: #2c3e50;
      margin: 0;
    }
    .meta {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0.3rem 0;
    }
  `]
})
export class TemplateSidebarComponent {
  @Input() resumeData: any = {};
}
