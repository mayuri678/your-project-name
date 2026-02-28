import { Injectable, Type } from '@angular/core';
import { ResumeTemplate01Component } from './template-01/template-01.component';
import { ResumeTemplate2Component } from './template-2/template-2.component';
import { ResumeTemplate3Component } from './template-3/template-3.component';
import { ResumeTemplate4Component } from './template-4/template-4.component';
import { ResumeTemplate5Component } from './template-5/template-5.component';
import { ResumeTemplate6Component } from './template-6/template-6.component';
import { ResumeTemplate7Component } from './template-7/template-7.component';
import { ResumeTemplate8Component } from './template-8/template-8.component';
import { ResumeTemplate9Component } from './template-9/template-9.component';
import { ResumeTemplate10Component } from './template-10/template-10.component';
import { ResumeTemplate11Component } from './template-11/template-11.component';
import { ResumeTemplate12Component } from './template-12/template-12.component';
import { ResumeTemplate13Component } from './template-13/template-13.component';
import { ResumeTemplate14Component } from './template-14/template-14.component';
import { ResumeTemplate15Component } from './template-15/template-15.component';
import { ResumeTemplate16Component } from './template-16/template-16.component';
import { ResumeTemplate17Component } from './template-17/template-17.component';
import { ResumeTemplate18Component } from './template-18/template-18.component';
import { ResumeTemplate19Component } from './template-19/template-19.component';
import { ResumeTemplate20Component } from './template-20/template-20.component';
import { ResumeTemplate21Component } from './template-21/template-21.component';
import { ResumeTemplate22Component } from './template-22/template-22.component';
import { ResumeTemplate23Component } from './template-23/template-23.component';
import { ResumeTemplate24Component } from './template-24/template-24.component';
import { ResumeTemplate25Component } from './template-25/template-25.component';
import { ResumeTemplate26Component } from './template-26/template-26.component';
import { ResumeTemplate27Component } from './template-27/template-27.component';
import { ResumeTemplate28Component } from './template-28/template-28.component';
import { ResumeTemplate29Component } from './template-29/template-29.component';
import { ResumeTemplate30Component } from './template-30/template-30.component';
import { ResumeTemplate31Component } from './template-31/template-31.component';
import { ResumeTemplate32Component } from './template-32/template-32.component';
import { ResumeTemplate33Component } from './template-33/template-33.component';
import { ResumeTemplate34Component } from './template-34/template-34.component';
import { ResumeTemplate35Component } from './template-35/template-35.component';
import { ResumeTemplate36Component } from './template-36/template-36.component';
import { ResumeTemplate37Component } from './template-37/template-37.component';
import { ResumeTemplate38Component } from './template-38/template-38.component';
import { ResumeTemplate39Component } from './template-39/template-39.component';
import { ResumeTemplate40Component } from './template-40/template-40.component';
import { ResumeTemplate41Component } from './template-41/template-41.component';
import { ResumeTemplate42Component } from './template-42/template-42.component';
import { ResumeTemplate43Component } from './template-43/template-43.component';
import { ResumeTemplate44Component } from './template-44/template-44.component';
import { ResumeTemplate45Component } from './template-45/template-45.component';
import { ResumeTemplate46Component } from './template-46/template-46.component';
import { ResumeTemplate47Component } from './template-47/template-47.component';
import { ResumeTemplate48Component } from './template-48/template-48.component';
import { ResumeTemplate49Component } from './template-49/template-49.component';
import { ResumeTemplate50Component } from './template-50/template-50.component';
import { ResumeTemplate51Component } from './template-51/template-51.component';
import { ResumeTemplate52Component } from './template-52/template-52.component';
import { ResumeTemplate53Component } from './template-53/template-53.component';
import { ResumeTemplate54Component } from './template-54/template-54.component';
import { ResumeTemplate55Component } from './template-55/template-55.component';

export interface TemplateInfo {
  id: number;
  name: string;
  component: Type<any>;
  category: string;
  thumbnail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateRegistryService {
  private templates: TemplateInfo[] = [
    { id: 1, name: 'Classic Professional', component: ResumeTemplate01Component, category: 'Professional' },
    { id: 2, name: 'Modern Blue', component: ResumeTemplate2Component, category: 'Modern' },
    { id: 3, name: 'Creative Green', component: ResumeTemplate3Component, category: 'Creative' },
    { id: 4, name: 'Professional Purple', component: ResumeTemplate4Component, category: 'Professional' },
    { id: 5, name: 'Elegant Red', component: ResumeTemplate5Component, category: 'Elegant' },
    { id: 6, name: 'Minimal Gray', component: ResumeTemplate6Component, category: 'Minimal' },
    { id: 7, name: 'Bold Orange', component: ResumeTemplate7Component, category: 'Bold' },
    { id: 8, name: 'Tech Teal', component: ResumeTemplate8Component, category: 'Tech' },
    { id: 9, name: 'Corporate Navy', component: ResumeTemplate9Component, category: 'Corporate' },
    { id: 10, name: 'Fresh Lime', component: ResumeTemplate10Component, category: 'Fresh' },
    { id: 11, name: 'Classic Black', component: ResumeTemplate11Component, category: 'Classic' },
    { id: 12, name: 'Vibrant Pink', component: ResumeTemplate12Component, category: 'Vibrant' },
    { id: 13, name: 'Sky Blue', component: ResumeTemplate13Component, category: 'Modern' },
    { id: 14, name: 'Forest Green', component: ResumeTemplate14Component, category: 'Nature' },
    { id: 15, name: 'Sunset Orange', component: ResumeTemplate15Component, category: 'Warm' },
    { id: 16, name: 'Royal Purple', component: ResumeTemplate16Component, category: 'Royal' },
    { id: 17, name: 'Ocean Blue', component: ResumeTemplate17Component, category: 'Ocean' },
    { id: 18, name: 'Crimson Red', component: ResumeTemplate18Component, category: 'Bold' },
    { id: 19, name: 'Mint Green', component: ResumeTemplate19Component, category: 'Fresh' },
    { id: 20, name: 'Slate Gray', component: ResumeTemplate20Component, category: 'Professional' },
    { id: 21, name: 'Indigo Pro', component: ResumeTemplate21Component, category: 'Professional' },
    { id: 22, name: 'Coral Bright', component: ResumeTemplate22Component, category: 'Bright' },
    { id: 23, name: 'Lavender', component: ResumeTemplate23Component, category: 'Soft' },
    { id: 24, name: 'Charcoal', component: ResumeTemplate24Component, category: 'Dark' },
    { id: 25, name: 'Turquoise', component: ResumeTemplate25Component, category: 'Tropical' },
    { id: 26, name: 'Burgundy', component: ResumeTemplate26Component, category: 'Elegant' },
    { id: 27, name: 'Olive', component: ResumeTemplate27Component, category: 'Nature' },
    { id: 28, name: 'Magenta', component: ResumeTemplate28Component, category: 'Vibrant' },
    { id: 29, name: 'Steel Blue', component: ResumeTemplate29Component, category: 'Modern' },
    { id: 30, name: 'Amber Gold', component: ResumeTemplate30Component, category: 'Luxury' },
    { id: 31, name: 'Deep Purple', component: ResumeTemplate31Component, category: 'Deep' },
    { id: 32, name: 'Aqua Marine', component: ResumeTemplate32Component, category: 'Ocean' },
    { id: 33, name: 'Ruby Red', component: ResumeTemplate33Component, category: 'Precious' },
    { id: 34, name: 'Sage Green', component: ResumeTemplate34Component, category: 'Natural' },
    { id: 35, name: 'Cobalt Blue', component: ResumeTemplate35Component, category: 'Bold' },
    { id: 36, name: 'Peach', component: ResumeTemplate36Component, category: 'Soft' },
    { id: 37, name: 'Plum', component: ResumeTemplate37Component, category: 'Rich' },
    { id: 38, name: 'Graphite', component: ResumeTemplate38Component, category: 'Dark' },
    { id: 39, name: 'Seafoam', component: ResumeTemplate39Component, category: 'Ocean' },
    { id: 40, name: 'Maroon', component: ResumeTemplate40Component, category: 'Classic' },
    { id: 41, name: 'Jade', component: ResumeTemplate41Component, category: 'Precious' },
    { id: 42, name: 'Orchid', component: ResumeTemplate42Component, category: 'Floral' },
    { id: 43, name: 'Midnight', component: ResumeTemplate43Component, category: 'Dark' },
    { id: 44, name: 'Lemon', component: ResumeTemplate44Component, category: 'Bright' },
    { id: 45, name: 'Azure', component: ResumeTemplate45Component, category: 'Sky' },
    { id: 46, name: 'Copper', component: ResumeTemplate46Component, category: 'Metallic' },
    { id: 47, name: 'Lilac', component: ResumeTemplate47Component, category: 'Soft' },
    { id: 48, name: 'Onyx', component: ResumeTemplate48Component, category: 'Dark' },
    { id: 49, name: 'Mint', component: ResumeTemplate49Component, category: 'Fresh' },
    { id: 50, name: 'Sapphire', component: ResumeTemplate50Component, category: 'Precious' },
    { id: 51, name: 'Tangerine', component: ResumeTemplate51Component, category: 'Citrus' },
    { id: 52, name: 'Periwinkle', component: ResumeTemplate52Component, category: 'Soft' },
    { id: 53, name: 'Charcoal Pro', component: ResumeTemplate53Component, category: 'Professional' },
    { id: 54, name: 'Emerald', component: ResumeTemplate54Component, category: 'Precious' },
    { id: 55, name: 'Crimson Pro', component: ResumeTemplate55Component, category: 'Professional' }
  ];

  getAllTemplates(): TemplateInfo[] {
    return this.templates;
  }

  getTemplateById(id: number): TemplateInfo | undefined {
    return this.templates.find(t => t.id === id);
  }

  getTemplatesByCategory(category: string): TemplateInfo[] {
    return this.templates.filter(t => t.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.templates.map(t => t.category))];
  }
}
