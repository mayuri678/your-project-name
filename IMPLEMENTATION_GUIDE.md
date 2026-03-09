# Multi-Template Resume System - Implementation Guide

## Overview
This implementation allows users to select from multiple resume templates, with each template displaying its unique layout and design.

## Architecture

### 1. Template Registry Service
**File:** `src/app/resume-templates/template-registry.service.ts`

- Maintains a registry of all 55 template components
- Maps template IDs to their corresponding Angular components
- Provides methods to retrieve templates by ID or category

### 2. Supabase Integration
**File:** `src/app/services/supabase-template.service.ts`

Handles:
- Fetching template metadata from Supabase
- Saving user resumes with template associations
- Retrieving user's saved resumes

### 3. Template Selection Flow

```
Home Page → "Create Resume" Button → Template Selection Page → Resume Builder
```

**Query Parameter:** `templateId` is passed via URL
Example: `/resume-builder?templateId=5`

## Database Schema (Supabase)

### Tables

#### 1. `templates` table
```sql
- id (SERIAL PRIMARY KEY)
- template_id (INTEGER UNIQUE) - Maps to Angular component
- name (VARCHAR)
- category (VARCHAR)
- thumbnail_url (TEXT)
- is_active (BOOLEAN)
```

#### 2. `user_resumes` table
```sql
- id (UUID PRIMARY KEY)
- user_id (UUID) - References auth.users
- template_id (INTEGER) - References templates
- resume_name (VARCHAR)
- resume_data (JSONB) - Stores all resume content
- status (VARCHAR) - draft/completed
```

## Implementation Steps

### Step 1: Set up Supabase Database
Run the SQL script: `SUPABASE_SCHEMA.sql`

```bash
# In Supabase SQL Editor, execute:
SUPABASE_SCHEMA.sql
```

### Step 2: Update Environment Configuration
Add Supabase credentials to your environment file:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

### Step 3: Update Home Component
The home component already has the template manager integration. When user clicks "Create Resume":

```typescript
goToTemplates(): void {
  this.showTemplateManager = true;
}

onTemplateSelected(templateId: string): void {
  this.router.navigate(['/resume-builder'], { 
    queryParams: { templateId: templateId } 
  });
}
```

### Step 4: Template Selection Component
Displays all templates in a grid with category filters.

**Features:**
- Category-based filtering
- Visual template previews
- Click to select and navigate to builder

### Step 5: Resume Builder Component
Dynamically loads the selected template component.

**Key Method:**
```typescript
loadTemplate() {
  const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
  if (template) {
    this.templateComponent = this.templateContainer.createComponent(template.component);
    this.templateComponent.instance.data = this.resumeData;
  }
}
```

## How It Works

### 1. User Selects Template
```typescript
// Template Selection Component
selectTemplate(templateId: number) {
  this.router.navigate(['/resume-builder'], {
    queryParams: { templateId: templateId }
  });
}
```

### 2. Resume Builder Receives Template ID
```typescript
// Resume Builder Component
ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.selectedTemplateId = +params['templateId'];
    this.loadTemplate();
  });
}
```

### 3. Dynamic Component Loading
```typescript
loadTemplate() {
  // Get template component from registry
  const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
  
  // Create component dynamically
  this.templateComponent = this.templateContainer.createComponent(template.component);
  
  // Pass data to template
  this.templateComponent.instance.data = this.resumeData;
}
```

### 4. Template Renders with Data
Each template component receives `ResumeData` via `@Input()`:

```typescript
@Component({
  selector: 'app-resume-template-01',
  template: `...unique layout...`
})
export class ResumeTemplate01Component {
  @Input() data!: ResumeData;
}
```

## Adding New Templates

### 1. Create Template Component
```typescript
// src/app/resume-templates/template-56/template-56.component.ts
import { Component, Input } from '@angular/core';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-56',
  standalone: true,
  templateUrl: './template-56.component.html'
})
export class ResumeTemplate56Component {
  @Input() data!: ResumeData;
}
```

### 2. Register in Template Registry
```typescript
// template-registry.service.ts
import { ResumeTemplate56Component } from './template-56/template-56.component';

private templates: TemplateInfo[] = [
  // ... existing templates
  { id: 56, name: 'New Design', component: ResumeTemplate56Component, category: 'Modern' }
];
```

### 3. Add to Supabase
```sql
INSERT INTO public.templates (template_id, name, category) 
VALUES (56, 'New Design', 'Modern');
```

## Saving Resumes with Template Selection

```typescript
async saveResume() {
  const resume: UserResume = {
    template_id: this.selectedTemplateId,
    resume_name: this.resumeData.name,
    resume_data: this.resumeData,
    status: 'completed'
  };
  
  const result = await this.supabaseTemplateService.saveUserResume(resume);
  if (result.success) {
    console.log('Resume saved with ID:', result.id);
  }
}
```

## Loading Saved Resumes

```typescript
async loadSavedResume(resumeId: string) {
  const resume = await this.supabaseTemplateService.getResumeById(resumeId);
  if (resume) {
    this.selectedTemplateId = resume.template_id;
    this.resumeData = resume.resume_data;
    this.loadTemplate();
  }
}
```

## Routing Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'template-selection', component: TemplateSelectionComponent },
  { path: 'resume-builder', component: ResumeBuilderComponent },
  // ... other routes
];
```

## Testing the Implementation

### 1. Test Template Selection
- Navigate to home page
- Click "Create Resume"
- Verify all templates are displayed
- Click different templates
- Verify navigation to resume builder with correct templateId

### 2. Test Template Rendering
- Open resume builder with different templateId values
- Verify each template displays its unique layout
- Example URLs:
  - `/resume-builder?templateId=1`
  - `/resume-builder?templateId=2`
  - `/resume-builder?templateId=3`

### 3. Test Data Persistence
- Fill in resume data
- Switch between templates
- Verify data persists across template changes

## Troubleshooting

### Issue: All templates look the same
**Solution:** Ensure each template component has unique HTML/CSS in its template file.

### Issue: Template not loading
**Solution:** Check that:
1. Template ID exists in registry
2. Component is imported in registry service
3. Query parameter is being passed correctly

### Issue: Data not updating
**Solution:** Call `updatePreview()` after data changes to trigger change detection.

## Best Practices

1. **Consistent Data Structure:** All templates use the same `ResumeData` interface
2. **Standalone Components:** Each template is a standalone Angular component
3. **Dynamic Loading:** Templates are loaded dynamically based on user selection
4. **State Management:** Resume data is stored in localStorage and Supabase
5. **Type Safety:** Use TypeScript interfaces for all data structures

## Next Steps

1. Add template thumbnails/previews
2. Implement template preview before selection
3. Add template customization options (colors, fonts)
4. Create template categories and filters
5. Add template rating and popularity
