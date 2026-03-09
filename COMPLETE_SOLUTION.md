# Complete Solution: Dynamic Template Loading

## Problem
All templates open with the same layout in the editor page.

## Solution
Pass templateId via routing and dynamically load the correct component.

---

## 1. Supabase Table

```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  template_id INTEGER NOT NULL,
  resume_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 2. Template Selection (Click Handler)

```typescript
// In your template selection component
selectTemplate(templateId: number) {
  this.router.navigate(['/resume-builder'], {
    queryParams: { templateId: templateId }
  });
}
```

```html
<!-- Template selection HTML -->
<div *ngFor="let template of templates" 
     (click)="selectTemplate(template.id)">
  {{ template.name }}
</div>
```

---

## 3. Resume Builder Component (Dynamic Loading)

```typescript
import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateRegistryService } from '../services/template-registry.service';

@Component({
  selector: 'app-resume-builder',
  template: `
    <div class="builder">
      <div class="editor">
        <!-- Your form fields -->
      </div>
      <div class="preview">
        <ng-container #templateContainer></ng-container>
      </div>
    </div>
  `
})
export class ResumeBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('templateContainer', { read: ViewContainerRef }) 
  container!: ViewContainerRef;

  templateId: number = 1;
  resumeData: any = {};

  constructor(
    private route: ActivatedRoute,
    private templateRegistry: TemplateRegistryService
  ) {}

  ngOnInit() {
    // Read templateId from URL
    this.route.queryParams.subscribe(params => {
      this.templateId = +params['templateId'] || 1;
      if (this.container) {
        this.loadTemplate();
      }
    });
  }

  ngAfterViewInit() {
    this.loadTemplate();
  }

  loadTemplate() {
    if (!this.container) return;

    // Clear previous
    this.container.clear();

    // Get template component
    const template = this.templateRegistry.getTemplateById(this.templateId);
    
    if (template) {
      // Create component dynamically
      const componentRef = this.container.createComponent(template.component);
      
      // Pass data
      componentRef.instance.data = this.resumeData;
      
      // Trigger change detection
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  updatePreview() {
    this.loadTemplate();
  }
}
```

---

## 4. Template Registry Service

```typescript
import { Injectable, Type } from '@angular/core';
import { ResumeTemplate01Component } from '../templates/template-01.component';
import { ResumeTemplate02Component } from '../templates/template-02.component';
import { ResumeTemplate03Component } from '../templates/template-03.component';

interface TemplateInfo {
  id: number;
  name: string;
  component: Type<any>;
}

@Injectable({ providedIn: 'root' })
export class TemplateRegistryService {
  private templates: TemplateInfo[] = [
    { id: 1, name: 'Classic', component: ResumeTemplate01Component },
    { id: 2, name: 'Modern', component: ResumeTemplate02Component },
    { id: 3, name: 'Creative', component: ResumeTemplate03Component }
  ];

  getTemplateById(id: number) {
    return this.templates.find(t => t.id === id);
  }

  getAllTemplates() {
    return this.templates;
  }
}
```

---

## 5. Template Component Structure

Each template must have:

### Template 1 (Classic)
```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-01',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-classic">
      <h1>{{ data.name }}</h1>
      <p>{{ data.email }}</p>
      <!-- Classic layout -->
    </div>
  `,
  styles: [`
    .template-classic {
      font-family: 'Times New Roman', serif;
      color: black;
    }
  `]
})
export class ResumeTemplate01Component {
  @Input() data: any;
}
```

### Template 2 (Modern)
```typescript
@Component({
  selector: 'app-template-02',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-modern">
      <div class="sidebar">
        <h1>{{ data.name }}</h1>
      </div>
      <div class="main">
        <p>{{ data.email }}</p>
      </div>
    </div>
  `,
  styles: [`
    .template-modern {
      display: flex;
      font-family: Arial, sans-serif;
    }
    .sidebar {
      width: 30%;
      background: #4285f4;
      color: white;
    }
  `]
})
export class ResumeTemplate02Component {
  @Input() data: any;
}
```

---

## 6. Routing Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'template-selection', component: TemplateSelectionComponent },
  { path: 'resume-builder', component: ResumeBuilderComponent }
];
```

---

## 7. Save to Supabase

```typescript
import { createClient } from '@supabase/supabase-js';

async saveResume() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      template_id: this.templateId,
      resume_data: this.resumeData
    });
}
```

---

## Key Points

✅ **templateId** is passed via URL query params
✅ **ViewContainerRef** dynamically creates components
✅ Each template has **unique HTML and CSS**
✅ Template registry **maps IDs to components**
✅ Supabase stores **template_id** with resume data

---

## Testing

1. Click template → URL should be `/resume-builder?templateId=2`
2. Console log: `console.log('Loading template:', this.templateId)`
3. Verify different templates show different layouts
4. Check Supabase table has correct template_id

---

## Common Issues

**Issue**: All templates look the same
**Fix**: Ensure each template component has unique HTML/CSS

**Issue**: Template not loading
**Fix**: Check ViewContainerRef is initialized in ngAfterViewInit

**Issue**: Data not updating
**Fix**: Call changeDetectorRef.detectChanges() after data changes
