# Resume Templates - UI Files Location Guide

## 📁 Template UI Files Structure

All template UI files are located in: `src/app/resume-templates/`

---

## 🎨 Template Files List (1-55)

### **Template 01**
```
📁 template-01/
├── template-01.component.ts       (Component logic)
├── template-01.component.html     (UI/Layout)
├── template-02.component.ts       (Variant)
└── template-02.component.html     (Variant UI)
```
**File Path:** `src/app/resume-templates/template-01/`
**Component Name:** `ResumeTemplate01Component`
**Selector:** `app-resume-template-01`

---

### **Template 02**
```
📁 template-2/
├── template-2.component.ts        (Component logic)
└── template-2.component.html      (UI/Layout)
```
**File Path:** `src/app/resume-templates/template-2/`
**Component Name:** `ResumeTemplate2Component`
**Selector:** `app-resume-template-2`

---

### **Template 03 - 10**
```
📁 template-03/
├── template-3.component.ts
└── template-3.component.html

📁 template-04/
├── template-4.component.ts
└── template-4.component.html

📁 template-05/
├── template-5.component.ts
└── template-5.component.html

📁 template-06/
├── template-6.component.ts
└── template-6.component.html

📁 template-07/
├── template-01.component.ts
├── template-01.component.html
├── template-02.component.ts
├── template-02.component.html
├── template-7.component.ts
└── template-7.component.html

📁 template-08/
├── template-01.component.ts
├── template-01.component.html
├── template-02.component.ts
├── template-02.component.html
├── template-8.component.ts
└── template-8.component.html

📁 template-09/
├── template-01.component.ts
├── template-01.component.html
├── template-02.component.ts
├── template-02.component.html
├── template-9.component.ts
└── template-9.component.html

📁 template-10/
├── template-01.component.ts
├── template-01.component.html
├── template-02.component.ts
├── template-02.component.html
├── template-10.component.ts
└── template-10.component.html
```

---

### **Template 11 - 55**
```
📁 template-11/
├── template-11.component.ts
└── template-11.component.html

📁 template-12/
├── template-12.component.ts
└── template-12.component.html

📁 template-13/
├── template-13.component.ts
└── template-13.component.html

... (continues for template-14 through template-55)

📁 template-55/
├── template-55.component.ts
└── template-55.component.html
```

---

## 📋 Complete File Listing

| Template | TypeScript File | HTML File | Path |
|----------|-----------------|-----------|------|
| 1 | template-01.component.ts | template-01.component.html | `template-01/` |
| 2 | template-2.component.ts | template-2.component.html | `template-2/` |
| 3 | template-3.component.ts | template-3.component.html | `template-3/` |
| 4 | template-4.component.ts | template-4.component.html | `template-4/` |
| 5 | template-5.component.ts | template-5.component.html | `template-5/` |
| 6 | template-6.component.ts | template-6.component.html | `template-6/` |
| 7 | template-7.component.ts | template-7.component.html | `template-7/` |
| 8 | template-8.component.ts | template-8.component.html | `template-8/` |
| 9 | template-9.component.ts | template-9.component.html | `template-9/` |
| 10 | template-10.component.ts | template-10.component.html | `template-10/` |
| 11 | template-11.component.ts | template-11.component.html | `template-11/` |
| 12 | template-12.component.ts | template-12.component.html | `template-12/` |
| ... | ... | ... | ... |
| 55 | template-55.component.ts | template-55.component.html | `template-55/` |

---

## 🔍 Template File Structure

### **TypeScript Component File** (`.component.ts`)
```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-01',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-01.component.html',
  styles: []
})
export class ResumeTemplate01Component {
  @Input() data!: ResumeData;
}
```

**Key Points:**
- `@Input() data` - Receives resume data from parent
- `standalone: true` - Standalone component
- `templateUrl` - Points to HTML file
- `selector` - Used to render component

---

### **HTML Template File** (`.component.html`)
```html
<div class="executive-template">
  <div class="header-section">
    <div class="profile-area">
      <div class="profile-photo" *ngIf="data.photo">
        <img [src]="data.photo" alt="Profile">
      </div>
      <div class="header-text">
        <h1 class="name">{{data.name}}</h1>
        <h2 class="title">{{data.title}}</h2>
      </div>
    </div>
    <div class="contact-bar">
      <span *ngIf="data.email">✉ {{data.email}}</span>
      <span *ngIf="data.phone">📱 {{data.phone}}</span>
      <span *ngIf="data.location">📍 {{data.location}}</span>
      <span *ngIf="data.linkedin">🔗 {{data.linkedin}}</span>
    </div>
  </div>

  <div class="content-grid">
    <!-- Main content sections -->
    <div class="main-column">
      <!-- Summary, Experience, Education -->
    </div>
    
    <!-- Sidebar -->
    <div class="side-column">
      <!-- Skills, Certifications -->
    </div>
  </div>
</div>

<style>
  /* Inline CSS styles */
</style>
```

**Key Sections:**
- Header with profile photo and contact info
- Content grid (main + sidebar)
- Summary section
- Experience section
- Education section
- Skills section
- Certifications section

---

## 🎯 How Templates Are Used

### **1. Template Registry** (Maps ID to Component)
**File:** `src/app/resume-templates/template-registry.service.ts`

```typescript
getTemplateById(id: number): TemplateInfo {
  // Returns template component based on ID
  // Example: ID 1 → ResumeTemplate01Component
}
```

---

### **2. Resume Builder** (Loads Template)
**File:** `src/app/resume-builder/resume-builder.component.ts`

```typescript
loadTemplate() {
  const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
  this.templateComponent = this.templateContainer.createComponent(template.component);
  this.templateComponent.instance.data = this.resumeData;
}
```

---

### **3. Template Selector** (Displays All Templates)
**File:** `src/app/templates-page/templates-page.component.ts`

```typescript
templates = [
  { id: 1, name: 'Classic Blue', category: 'Professional', ... },
  { id: 2, name: 'Modern Sidebar', category: 'Creative', ... },
  // ... 55 templates total
];

selectTemplate(templateId: number) {
  this.router.navigate(['/resume-builder'], { 
    queryParams: { templateId: templateId } 
  });
}
```

---

## 📂 Full Directory Tree

```
src/app/resume-templates/
├── template-01/
│   ├── template-01.component.ts
│   ├── template-01.component.html
│   ├── template-02.component.ts
│   └── template-02.component.html
├── template-2/
│   ├── template-2.component.ts
│   └── template-2.component.html
├── template-3/
│   ├── template-3.component.ts
│   └── template-3.component.html
├── template-4/
│   ├── template-4.component.ts
│   └── template-4.component.html
├── template-5/
│   ├── template-5.component.ts
│   └── template-5.component.html
├── template-6/
│   ├── template-6.component.ts
│   └── template-6.component.html
├── template-7/
│   ├── template-01.component.ts
│   ├── template-01.component.html
│   ├── template-02.component.ts
│   ├── template-02.component.html
│   ├── template-7.component.ts
│   └── template-7.component.html
├── template-8/
│   ├── template-01.component.ts
│   ├── template-01.component.html
│   ├── template-02.component.ts
│   ├── template-02.component.html
│   ├── template-8.component.ts
│   └── template-8.component.html
├── template-9/
│   ├── template-01.component.ts
│   ├── template-01.component.html
│   ├── template-02.component.ts
│   ├── template-02.component.html
│   ├── template-9.component.ts
│   └── template-9.component.html
├── template-10/
│   ├── template-01.component.ts
│   ├── template-01.component.html
│   ├── template-02.component.ts
│   ├── template-02.component.html
│   ├── template-10.component.ts
│   └── template-10.component.html
├── template-11/ through template-55/
│   ├── template-[number].component.ts
│   └── template-[number].component.html
├── components/
│   └── template-01.component.ts
├── models/
│   └── resume-data.interface.ts
├── template-registry.service.ts
├── template-selector.component.ts
├── template-sidebar.component.ts
├── template-minimal.component.ts
└── README.md
```

---

## 🔗 Related Files

### **Resume Data Interface**
**File:** `src/app/resume-templates/models/resume-data.interface.ts`

```typescript
export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: string[];
  photo: string;
}
```

---

### **Template Registry Service**
**File:** `src/app/resume-templates/template-registry.service.ts`

Maps template IDs to their components for dynamic loading.

---

### **Resume Builder**
**File:** `src/app/resume-builder/resume-builder.component.ts`
**File:** `src/app/resume-builder/resume-builder.component.html`

Main component that loads and displays templates.

---

### **Templates Page**
**File:** `src/app/templates-page/templates-page.component.ts`
**File:** `src/app/templates-page/templates-page.component.html`

Displays all 55 templates for user selection.

---

## 🎨 Template Styling

Each template has inline CSS in the HTML file with:
- Header styling
- Content grid layout
- Section styling
- Typography
- Colors and gradients
- Print-friendly styles

---

## 📝 Quick Access Guide

| Need | File Location |
|------|---------------|
| View Template 1 UI | `src/app/resume-templates/template-01/template-01.component.html` |
| Edit Template 1 Logic | `src/app/resume-templates/template-01/template-01.component.ts` |
| View All Templates | `src/app/templates-page/templates-page.component.html` |
| Template Registry | `src/app/resume-templates/template-registry.service.ts` |
| Resume Builder | `src/app/resume-builder/resume-builder.component.ts` |
| Resume Data Model | `src/app/resume-templates/models/resume-data.interface.ts` |

---

## 🚀 How to Modify a Template

1. **Open Template HTML:** `src/app/resume-templates/template-XX/template-XX.component.html`
2. **Edit Layout/Styling:** Modify HTML and inline CSS
3. **Update Logic:** Edit `template-XX.component.ts` if needed
4. **Test:** Load template in resume builder
5. **Save:** Changes apply immediately

---

## 💡 Template Naming Convention

- **Template 01:** Has variants (template-01, template-02)
- **Template 2-6:** Single file each
- **Template 7-10:** Have variants (template-01, template-02, main)
- **Template 11-55:** Single file each

**Pattern:**
- Odd templates (1, 7, 9) often have multiple variants
- Even templates (2, 4, 6) usually single file
- Higher numbers (11-55) mostly single file
