# Quick Start Guide - Multi-Template Resume System

## Problem
All templates display the same layout instead of their unique designs.

## Solution
Implement dynamic component loading with proper template ID routing.

---

## 🚀 Quick Implementation (5 Steps)

### Step 1: Update Home Component Button
```typescript
// home.component.ts
openResumeOptions(): void {
  this.showTemplateManager = true; // Opens template selection modal
}

onTemplateSelected(templateId: number): void {
  this.router.navigate(['/resume-builder'], { 
    queryParams: { templateId: templateId } 
  });
}
```

```html
<!-- home.component.html -->
<button (click)="openResumeOptions()">Create Resume</button>

<app-template-manager 
  *ngIf="showTemplateManager"
  (closeModal)="closeTemplateManager()"
  (templateSelected)="onTemplateSelected($event)">
</app-template-manager>
```

---

### Step 2: Ensure Template Registry is Complete
```typescript
// resume-templates/template-registry.service.ts
private templates: TemplateInfo[] = [
  { id: 1, name: 'Classic Professional', component: ResumeTemplate01Component, category: 'Professional' },
  { id: 2, name: 'Modern Blue', component: ResumeTemplate2Component, category: 'Modern' },
  { id: 3, name: 'Creative Green', component: ResumeTemplate3Component, category: 'Creative' },
  // ... all 55 templates
];
```

---

### Step 3: Update Resume Builder to Load Templates Dynamically
```typescript
// resume-builder.component.ts
export class ResumeBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('templateContainer', { read: ViewContainerRef }) 
  templateContainer!: ViewContainerRef;
  
  selectedTemplateId: number = 1;

  ngOnInit() {
    // Get template ID from URL
    this.route.queryParams.subscribe(params => {
      this.selectedTemplateId = +params['templateId'] || 1;
    });
  }

  ngAfterViewInit() {
    this.loadTemplate();
  }

  loadTemplate() {
    if (!this.templateContainer) return;
    
    // Clear previous template
    this.templateContainer.clear();
    
    // Get template from registry
    const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
    
    if (template) {
      // Create component dynamically
      const componentRef = this.templateContainer.createComponent(template.component);
      
      // Pass data to template
      componentRef.instance.data = this.resumeData;
      
      // Detect changes
      componentRef.changeDetectorRef.detectChanges();
    }
  }
}
```

```html
<!-- resume-builder.component.html -->
<div class="builder-container">
  <div class="editor-panel">
    <!-- Form inputs for resume data -->
  </div>
  
  <div class="preview-panel">
    <div class="template-preview-container">
      <!-- Dynamic template loads here -->
      <ng-container #templateContainer></ng-container>
    </div>
  </div>
</div>
```

---

### Step 4: Ensure Each Template Has Unique Design
```typescript
// template-01/template-01.component.ts
@Component({
  selector: 'app-resume-template-01',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-01.component.html',
  styleUrls: ['./template-01.component.css'] // Unique styles
})
export class ResumeTemplate01Component {
  @Input() data!: ResumeData;
}
```

**Key Point:** Each template MUST have:
- ✅ Unique HTML structure in its template file
- ✅ Unique CSS styling
- ✅ Same `@Input() data: ResumeData` interface

---

### Step 5: Test Different Templates
```typescript
// Navigate to different templates
this.router.navigate(['/resume-builder'], { 
  queryParams: { templateId: 1 } // Template 1
});

this.router.navigate(['/resume-builder'], { 
  queryParams: { templateId: 2 } // Template 2
});

this.router.navigate(['/resume-builder'], { 
  queryParams: { templateId: 3 } // Template 3
});
```

---

## 🔍 Debugging Checklist

### If templates still look the same:

1. **Check Template Files**
   ```bash
   # Verify each template has unique HTML
   src/app/resume-templates/template-01/template-01.component.html
   src/app/resume-templates/template-2/template-2.component.html
   src/app/resume-templates/template-3/template-3.component.html
   ```

2. **Check Component Registration**
   ```typescript
   // In template-registry.service.ts
   // Ensure each ID maps to correct component
   { id: 1, component: ResumeTemplate01Component }, // ✅ Correct
   { id: 2, component: ResumeTemplate01Component }, // ❌ Wrong - should be ResumeTemplate2Component
   ```

3. **Check Query Parameter**
   ```typescript
   // In resume-builder.component.ts
   this.route.queryParams.subscribe(params => {
     console.log('Template ID:', params['templateId']); // Should change
   });
   ```

4. **Check Dynamic Loading**
   ```typescript
   loadTemplate() {
     const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
     console.log('Loading template:', template?.name); // Should show different names
   }
   ```

---

## 📊 Data Flow Diagram

```
User clicks "Create Resume"
    ↓
Template Selection Modal Opens
    ↓
User selects Template (e.g., Template 5)
    ↓
Navigate to: /resume-builder?templateId=5
    ↓
Resume Builder reads templateId from URL
    ↓
Template Registry returns Template5Component
    ↓
ViewContainerRef dynamically creates Template5Component
    ↓
Template5Component receives ResumeData via @Input
    ↓
Template5 renders with its unique layout
```

---

## 🎨 Making Templates Unique

### Template 1 - Classic
```css
.resume-template-01 {
  font-family: 'Times New Roman', serif;
  color: #2c3e50;
  /* Traditional layout */
}
```

### Template 2 - Modern
```css
.resume-template-02 {
  font-family: 'Arial', sans-serif;
  display: flex; /* Two-column layout */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Template 3 - Creative
```css
.resume-template-03 {
  font-family: 'Segoe UI', sans-serif;
  display: grid; /* Card-based layout */
  background: #f5f5f5;
}
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Template not changing
**Cause:** Query parameter not being read
**Fix:**
```typescript
ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const newTemplateId = +params['templateId'];
    if (newTemplateId && newTemplateId !== this.selectedTemplateId) {
      this.selectedTemplateId = newTemplateId;
      if (this.templateContainer) {
        this.loadTemplate(); // Reload template
      }
    }
  });
}
```

### Issue 2: All templates look identical
**Cause:** Templates sharing the same HTML file
**Fix:** Ensure each template folder has unique files:
```
template-01/
  ├── template-01.component.ts
  ├── template-01.component.html  ← Unique layout
  └── template-01.component.css   ← Unique styles

template-2/
  ├── template-2.component.ts
  ├── template-2.component.html   ← Different layout
  └── template-2.component.css    ← Different styles
```

### Issue 3: Template not found
**Cause:** Component not imported in registry
**Fix:**
```typescript
// At top of template-registry.service.ts
import { ResumeTemplate01Component } from './template-01/template-01.component';
import { ResumeTemplate2Component } from './template-2/template-2.component';
// ... import ALL template components

// In templates array
{ id: 1, component: ResumeTemplate01Component },
{ id: 2, component: ResumeTemplate2Component },
```

---

## 📝 Testing Script

```typescript
// Test in browser console
// 1. Check if templates are registered
console.log(templateRegistry.getAllTemplates());

// 2. Navigate to different templates
router.navigate(['/resume-builder'], { queryParams: { templateId: 1 } });
router.navigate(['/resume-builder'], { queryParams: { templateId: 2 } });
router.navigate(['/resume-builder'], { queryParams: { templateId: 3 } });

// 3. Check current template ID
console.log('Current template:', this.selectedTemplateId);
```

---

## 🎯 Success Criteria

✅ Clicking different templates navigates with different templateId
✅ URL shows: `/resume-builder?templateId=X` (X changes)
✅ Each template displays unique layout and styling
✅ Resume data persists across template switches
✅ Template selection modal shows all available templates

---

## 📚 File Structure

```
src/app/
├── resume-templates/
│   ├── template-01/
│   │   ├── template-01.component.ts
│   │   ├── template-01.component.html  ← Unique design
│   │   └── template-01.component.css
│   ├── template-2/
│   │   ├── template-2.component.ts
│   │   ├── template-2.component.html   ← Different design
│   │   └── template-2.component.css
│   ├── models/
│   │   └── resume-data.interface.ts    ← Shared data structure
│   └── template-registry.service.ts    ← Maps IDs to components
├── resume-builder/
│   ├── resume-builder.component.ts     ← Dynamic loader
│   └── resume-builder.component.html
├── template-manager/
│   └── template-manager.component.ts   ← Selection modal
└── services/
    └── supabase-template.service.ts    ← Database integration
```

---

## 🚀 Next Steps

1. Run Supabase SQL schema
2. Update environment with Supabase credentials
3. Test template selection flow
4. Verify each template renders uniquely
5. Implement save/load functionality with Supabase

---

## 💡 Pro Tips

1. **Use ViewContainerRef** for dynamic component loading
2. **Pass templateId via query params** for shareable URLs
3. **Keep ResumeData interface consistent** across all templates
4. **Use standalone components** for easier lazy loading
5. **Implement change detection** after data updates
