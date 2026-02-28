const fs = require('fs');
const path = require('path');

const templates = [
  { id: 2, name: 'Modern Blue', color: 'blue-600', layout: 'sidebar' },
  { id: 3, name: 'Creative Green', color: 'green-600', layout: 'header' },
  { id: 4, name: 'Professional Purple', color: 'purple-600', layout: 'sidebar' },
  { id: 5, name: 'Elegant Red', color: 'red-600', layout: 'header' },
  { id: 6, name: 'Minimal Gray', color: 'gray-700', layout: 'clean' },
  { id: 7, name: 'Bold Orange', color: 'orange-600', layout: 'sidebar' },
  { id: 8, name: 'Tech Teal', color: 'teal-600', layout: 'header' },
  { id: 9, name: 'Corporate Navy', color: 'blue-900', layout: 'sidebar' },
  { id: 10, name: 'Fresh Lime', color: 'lime-600', layout: 'header' },
  { id: 11, name: 'Classic Black', color: 'black', layout: 'clean' },
  { id: 12, name: 'Vibrant Pink', color: 'pink-600', layout: 'sidebar' },
  { id: 13, name: 'Sky Blue', color: 'sky-500', layout: 'header' },
  { id: 14, name: 'Forest Green', color: 'emerald-700', layout: 'sidebar' },
  { id: 15, name: 'Sunset Orange', color: 'amber-600', layout: 'header' },
  { id: 16, name: 'Royal Purple', color: 'violet-700', layout: 'sidebar' },
  { id: 17, name: 'Ocean Blue', color: 'cyan-600', layout: 'header' },
  { id: 18, name: 'Crimson Red', color: 'rose-700', layout: 'sidebar' },
  { id: 19, name: 'Mint Green', color: 'green-400', layout: 'clean' },
  { id: 20, name: 'Slate Gray', color: 'slate-600', layout: 'header' },
  { id: 21, name: 'Indigo Pro', color: 'indigo-600', layout: 'sidebar' },
  { id: 22, name: 'Coral Bright', color: 'orange-500', layout: 'header' },
  { id: 23, name: 'Lavender', color: 'purple-400', layout: 'clean' },
  { id: 24, name: 'Charcoal', color: 'gray-800', layout: 'sidebar' },
  { id: 25, name: 'Turquoise', color: 'teal-500', layout: 'header' },
  { id: 26, name: 'Burgundy', color: 'red-800', layout: 'sidebar' },
  { id: 27, name: 'Olive', color: 'green-700', layout: 'header' },
  { id: 28, name: 'Magenta', color: 'fuchsia-600', layout: 'sidebar' },
  { id: 29, name: 'Steel Blue', color: 'blue-500', layout: 'clean' },
  { id: 30, name: 'Amber Gold', color: 'yellow-600', layout: 'header' },
  { id: 31, name: 'Deep Purple', color: 'purple-800', layout: 'sidebar' },
  { id: 32, name: 'Aqua Marine', color: 'cyan-500', layout: 'header' },
  { id: 33, name: 'Ruby Red', color: 'red-700', layout: 'sidebar' },
  { id: 34, name: 'Sage Green', color: 'green-500', layout: 'clean' },
  { id: 35, name: 'Cobalt Blue', color: 'blue-700', layout: 'header' },
  { id: 36, name: 'Peach', color: 'orange-400', layout: 'sidebar' },
  { id: 37, name: 'Plum', color: 'purple-600', layout: 'header' },
  { id: 38, name: 'Graphite', color: 'gray-900', layout: 'sidebar' },
  { id: 39, name: 'Seafoam', color: 'teal-400', layout: 'clean' },
  { id: 40, name: 'Maroon', color: 'red-900', layout: 'header' },
  { id: 41, name: 'Jade', color: 'emerald-600', layout: 'sidebar' },
  { id: 42, name: 'Orchid', color: 'pink-500', layout: 'header' },
  { id: 43, name: 'Midnight', color: 'slate-900', layout: 'sidebar' },
  { id: 44, name: 'Lemon', color: 'yellow-500', layout: 'clean' },
  { id: 45, name: 'Azure', color: 'sky-600', layout: 'header' },
  { id: 46, name: 'Copper', color: 'orange-700', layout: 'sidebar' },
  { id: 47, name: 'Lilac', color: 'violet-400', layout: 'header' },
  { id: 48, name: 'Onyx', color: 'zinc-900', layout: 'sidebar' },
  { id: 49, name: 'Mint', color: 'emerald-400', layout: 'clean' },
  { id: 50, name: 'Sapphire', color: 'blue-800', layout: 'header' },
  { id: 51, name: 'Tangerine', color: 'orange-600', layout: 'sidebar' },
  { id: 52, name: 'Periwinkle', color: 'indigo-400', layout: 'header' },
  { id: 53, name: 'Charcoal Pro', color: 'neutral-800', layout: 'sidebar' },
  { id: 54, name: 'Emerald', color: 'green-600', layout: 'clean' },
  { id: 55, name: 'Crimson Pro', color: 'red-600', layout: 'header' }
];

const generateTS = (id, name) => `import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-${id}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-${id}.component.html'
})
export class ResumeTemplate${id}Component {
  @Input() data!: ResumeData;
}
`;

const generateHTML = (id, color, layout) => {
  if (layout === 'sidebar') {
    return `<div class="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg print:shadow-none flex">
  <aside class="w-1/3 bg-${color} text-white p-8">
    <div class="mb-8" *ngIf="data.photo">
      <img [src]="data.photo" class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white">
    </div>
    <h1 class="text-3xl font-bold mb-2">{{data.name}}</h1>
    <p class="text-lg mb-6 opacity-90">{{data.title}}</p>
    <div class="space-y-3 text-sm mb-8">
      <p>📧 {{data.email}}</p>
      <p>📱 {{data.phone}}</p>
      <p>📍 {{data.location}}</p>
    </div>
    <section class="mb-6" *ngIf="data.skills?.length">
      <h2 class="text-xl font-bold mb-3 border-b border-white/30 pb-2">Skills</h2>
      <div class="space-y-2">
        <span *ngFor="let skill of data.skills" class="block text-sm">• {{skill}}</span>
      </div>
    </section>
  </aside>
  <main class="w-2/3 p-8">
    <section class="mb-6" *ngIf="data.summary">
      <h2 class="text-2xl font-bold text-${color} mb-3">Summary</h2>
      <p class="text-gray-700">{{data.summary}}</p>
    </section>
    <section class="mb-6" *ngIf="data.experience?.length">
      <h2 class="text-2xl font-bold text-${color} mb-3">Experience</h2>
      <div *ngFor="let exp of data.experience" class="mb-4">
        <h3 class="text-lg font-bold">{{exp.role}}</h3>
        <p class="text-gray-600">{{exp.company}} | {{exp.duration}}</p>
        <p class="text-sm text-gray-700 mt-1">{{exp.description}}</p>
      </div>
    </section>
    <section class="mb-6" *ngIf="data.education?.length">
      <h2 class="text-2xl font-bold text-${color} mb-3">Education</h2>
      <div *ngFor="let edu of data.education" class="mb-3">
        <h3 class="font-bold">{{edu.degree}}</h3>
        <p class="text-gray-600">{{edu.institution}} | {{edu.year}}</p>
      </div>
    </section>
  </main>
</div>`;
  } else if (layout === 'header') {
    return `<div class="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-12 shadow-lg print:shadow-none">
  <header class="bg-${color} text-white p-8 -mx-12 -mt-12 mb-8">
    <h1 class="text-4xl font-bold mb-2">{{data.name}}</h1>
    <p class="text-xl mb-4">{{data.title}}</p>
    <div class="flex gap-4 text-sm">
      <span>{{data.email}}</span>
      <span>{{data.phone}}</span>
      <span>{{data.location}}</span>
    </div>
  </header>
  <section class="mb-6" *ngIf="data.summary">
    <h2 class="text-2xl font-bold text-${color} border-b-2 border-${color} pb-2 mb-3">Summary</h2>
    <p class="text-gray-700">{{data.summary}}</p>
  </section>
  <section class="mb-6" *ngIf="data.experience?.length">
    <h2 class="text-2xl font-bold text-${color} border-b-2 border-${color} pb-2 mb-3">Experience</h2>
    <div *ngFor="let exp of data.experience" class="mb-4">
      <div class="flex justify-between">
        <h3 class="text-lg font-bold">{{exp.role}}</h3>
        <span class="text-gray-600">{{exp.duration}}</span>
      </div>
      <p class="text-gray-600 mb-1">{{exp.company}}</p>
      <p class="text-sm text-gray-700">{{exp.description}}</p>
    </div>
  </section>
  <div class="grid grid-cols-2 gap-6">
    <section *ngIf="data.education?.length">
      <h2 class="text-xl font-bold text-${color} border-b border-${color} pb-2 mb-3">Education</h2>
      <div *ngFor="let edu of data.education" class="mb-3">
        <h3 class="font-bold">{{edu.degree}}</h3>
        <p class="text-sm text-gray-600">{{edu.institution}}</p>
        <p class="text-sm text-gray-500">{{edu.year}}</p>
      </div>
    </section>
    <section *ngIf="data.skills?.length">
      <h2 class="text-xl font-bold text-${color} border-b border-${color} pb-2 mb-3">Skills</h2>
      <div class="flex flex-wrap gap-2">
        <span *ngFor="let skill of data.skills" class="px-3 py-1 bg-${color} text-white text-xs rounded-full">{{skill}}</span>
      </div>
    </section>
  </div>
</div>`;
  } else {
    return `<div class="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-16 shadow-lg print:shadow-none">
  <header class="mb-8">
    <h1 class="text-5xl font-light text-${color} mb-2">{{data.name}}</h1>
    <p class="text-xl text-gray-600 mb-4">{{data.title}}</p>
    <div class="text-sm text-gray-500 space-x-3">
      <span>{{data.email}}</span>
      <span>•</span>
      <span>{{data.phone}}</span>
      <span>•</span>
      <span>{{data.location}}</span>
    </div>
  </header>
  <section class="mb-8" *ngIf="data.summary">
    <p class="text-gray-700 leading-relaxed">{{data.summary}}</p>
  </section>
  <section class="mb-8" *ngIf="data.experience?.length">
    <h2 class="text-sm font-bold uppercase tracking-wider text-${color} mb-4">Experience</h2>
    <div *ngFor="let exp of data.experience" class="mb-5">
      <div class="flex justify-between mb-1">
        <h3 class="font-bold">{{exp.role}}</h3>
        <span class="text-sm text-gray-500">{{exp.duration}}</span>
      </div>
      <p class="text-sm text-gray-600 mb-2">{{exp.company}}</p>
      <p class="text-sm text-gray-700">{{exp.description}}</p>
    </div>
  </section>
  <section class="mb-8" *ngIf="data.education?.length">
    <h2 class="text-sm font-bold uppercase tracking-wider text-${color} mb-4">Education</h2>
    <div *ngFor="let edu of data.education" class="mb-3">
      <div class="flex justify-between">
        <h3 class="font-bold">{{edu.degree}}</h3>
        <span class="text-sm text-gray-500">{{edu.year}}</span>
      </div>
      <p class="text-sm text-gray-600">{{edu.institution}}</p>
    </div>
  </section>
  <section *ngIf="data.skills?.length">
    <h2 class="text-sm font-bold uppercase tracking-wider text-${color} mb-4">Skills</h2>
    <p class="text-sm text-gray-700">{{data.skills.join(' • ')}}</p>
  </section>
</div>`;
  }
};

templates.forEach(({ id, name, color, layout }) => {
  const dir = path.join(__dirname, 'src', 'app', 'resume-templates', `template-${id}`);
  
  fs.writeFileSync(
    path.join(dir, `template-${id}.component.ts`),
    generateTS(id, name)
  );
  
  fs.writeFileSync(
    path.join(dir, `template-${id}.component.html`),
    generateHTML(id, color, layout)
  );
});

console.log('✅ Generated 54 templates successfully!');
