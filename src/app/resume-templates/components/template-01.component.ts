import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-template-01',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-[210mm] mx-auto bg-white p-12 font-sans text-gray-900">
      <header class="text-center border-b-2 border-gray-900 pb-4 mb-6">
        <h1 class="text-4xl font-bold uppercase tracking-wide">{{data.name}}</h1>
        <p class="text-lg text-gray-600 mt-2">{{data.title}}</p>
        <div class="text-sm text-gray-500 mt-3 space-x-3">
          <span>{{data.email}}</span>
          <span>•</span>
          <span>{{data.phone}}</span>
          <span>•</span>
          <span>{{data.location}}</span>
        </div>
      </header>

      <section class="mb-6" *ngIf="data.summary">
        <h2 class="text-xl font-bold uppercase border-b border-gray-300 pb-2 mb-3">Summary</h2>
        <p class="text-sm leading-relaxed">{{data.summary}}</p>
      </section>

      <section class="mb-6" *ngIf="data.experience?.length">
        <h2 class="text-xl font-bold uppercase border-b border-gray-300 pb-2 mb-3">Experience</h2>
        <div *ngFor="let exp of data.experience" class="mb-4">
          <h3 class="font-bold text-base">{{exp.role}}</h3>
          <p class="text-sm text-gray-600">{{exp.company}} | {{exp.duration}}</p>
          <p class="text-sm mt-1">{{exp.description}}</p>
        </div>
      </section>

      <section class="mb-6" *ngIf="data.education?.length">
        <h2 class="text-xl font-bold uppercase border-b border-gray-300 pb-2 mb-3">Education</h2>
        <div *ngFor="let edu of data.education" class="mb-3">
          <h3 class="font-bold text-base">{{edu.degree}}</h3>
          <p class="text-sm text-gray-600">{{edu.institution}} | {{edu.year}}</p>
        </div>
      </section>

      <section class="mb-6" *ngIf="data.skills?.length">
        <h2 class="text-xl font-bold uppercase border-b border-gray-300 pb-2 mb-3">Skills</h2>
        <div class="flex flex-wrap gap-2">
          <span *ngFor="let skill of data.skills" class="text-sm bg-gray-100 px-3 py-1 rounded">{{skill}}</span>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @media print {
      .max-w-\\[210mm\\] { max-width: 210mm; padding: 0; }
    }
  `]
})
export class Template01Component {
  @Input() data: ResumeData = {} as ResumeData;
}
