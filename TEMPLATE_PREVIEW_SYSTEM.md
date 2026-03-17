# Template Preview System - Implementation Guide

## Overview
A professional template preview system that displays realistic mini versions of resume templates on the Create Resume page, similar to platforms like Canva and Novoresume.

## Architecture

### Components

#### 1. **TemplateMetadata** (`template-metadata.ts`)
Defines the template structure and metadata.

```typescript
interface TemplateMetadata {
  id: number;
  name: string;
  category: string;
  description: string;
  layoutType: 'executive' | 'sidebar' | 'creative' | 'elegant' | 'bold' | 'minimal' | 'modern';
  primaryColor: string;
  accentColor?: string;
  hasPhoto: boolean;
  hasSidebar: boolean;
}
```

**Layout Types:**
- **Executive**: Two-column layout with header and sidebar
- **Sidebar**: Left sidebar with profile, right main content
- **Creative**: Colorful header with emoji icons
- **Elegant**: Serif typography with top bar
- **Bold**: Strong gradient header with uppercase titles
- **Minimal**: Clean, minimalist design
- **Modern**: Contemporary with accent colors

#### 2. **TemplatePreviewComponent** (`template-preview-enhanced.component.ts`)
Renders mini preview of each template layout.

**Features:**
- 7 different layout styles
- Dynamic color theming using CSS variables
- Lightweight CSS-based rendering
- Responsive scaling
- Realistic section representation

**CSS Variables:**
```css
--primary-color: Template's primary color
--accent-color: Template's accent color (optional)
```

#### 3. **TemplateCardEnhancedComponent** (`template-card-enhanced.component.ts`)
Professional card wrapper with metadata and interactions.

**Features:**
- Template preview display
- Metadata (name, category, description)
- Feature badges (Photo, Sidebar, Layout type)
- Hover effects with overlay
- Select button
- Responsive design

#### 4. **CreateResumeComponent** (Updated)
Main page displaying template grid.

**Changes:**
- Imports enhanced template card component
- Uses TEMPLATE_METADATA for template data
- Responsive grid layout
- Navigation to resume builder on selection

## File Structure

```
src/app/
├── home/
│   ├── template-metadata.ts                    # Template definitions
│   ├── template-preview-enhanced.component.ts  # Preview renderer
│   └── template-card-enhanced.component.ts     # Card wrapper
├── create-resume/
│   ├── create-resume.component.html            # Updated template
│   ├── create-resume.component.ts              # Updated logic
│   └── create-resume.component.css             # Updated styles
```

## Usage

### In Create Resume Page

```html
<app-template-card-enhanced 
  *ngFor="let template of templates" 
  [template]="template"
  (selected)="selectTemplate($event)">
</app-template-card-enhanced>
```

### Component Integration

```typescript
import { TEMPLATE_METADATA, TemplateMetadata } from '../home/template-metadata';
import { TemplateCardEnhancedComponent } from '../home/template-card-enhanced.component';

@Component({
  imports: [TemplateCardEnhancedComponent],
  // ...
})
export class CreateResumeComponent {
  templates: TemplateMetadata[] = TEMPLATE_METADATA;
  
  selectTemplate(templateId: number): void {
    this.router.navigate(['/resume-builder'], { 
      queryParams: { templateId: templateId } 
    });
  }
}
```

## Styling Features

### Card Hover Effects
- **Shadow**: 0 2px 8px → 0 12px 32px
- **Transform**: translateY(-8px)
- **Overlay**: Fade in with semi-transparent background
- **Button**: Scale and shadow animation

### Responsive Grid
```css
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
```

**Breakpoints:**
- Desktop (1024px+): 4-5 cards per row
- Tablet (768px-1024px): 2-3 cards per row
- Mobile (480px-768px): 1-2 cards per row
- Small Mobile (<480px): 1 card per row

### Preview Aspect Ratio
- Uses `aspect-ratio: 8.5 / 11` (A4 paper proportions)
- Maintains consistent preview size across all cards
- Responsive scaling with container

## Template Customization

### Adding a New Template

1. **Add to TEMPLATE_METADATA:**
```typescript
{
  id: 13,
  name: 'Your Template Name',
  category: 'Category',
  description: 'Description',
  layoutType: 'executive', // or other layout type
  primaryColor: '#2563eb',
  accentColor: '#1e40af',
  hasPhoto: true,
  hasSidebar: false
}
```

2. **Update Preview Component** (if new layout type):
Add new `*ngSwitchCase` in template-preview-enhanced.component.ts

### Modifying Colors

Edit template metadata:
```typescript
primaryColor: '#your-color',
accentColor: '#your-accent'
```

Colors automatically apply to preview via CSS variables.

### Changing Grid Layout

Edit CSS:
```css
.templates-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}
```

## Performance Optimizations

1. **Lightweight Rendering**: Pure CSS-based layouts, no images
2. **CSS Variables**: Dynamic theming without re-rendering
3. **Lazy Loading**: Cards render on demand
4. **Minimal DOM**: Simplified structure for fast rendering
5. **CSS Animations**: Hardware-accelerated transforms

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- CSS aspect-ratio support required
- CSS custom properties (variables) required

## Accessibility

- Semantic HTML structure
- Proper color contrast
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus states on buttons

## Future Enhancements

1. **Template Filtering**
   - Filter by category
   - Filter by layout type
   - Search functionality

2. **Template Favorites**
   - Save favorite templates
   - Quick access section

3. **Template Preview Modal**
   - Full-screen preview
   - Template details
   - Feature comparison

4. **Template Ratings**
   - User ratings
   - Popular templates section
   - Trending templates

5. **Template Variations**
   - Color scheme variations
   - Font options
   - Layout customization

## Troubleshooting

### Preview Not Showing
- Check template metadata is imported
- Verify layoutType matches component switch cases
- Check CSS variables are defined

### Colors Not Applying
- Verify primaryColor and accentColor are valid hex codes
- Check CSS variable syntax: `var(--primary-color)`
- Clear browser cache

### Grid Layout Issues
- Check minmax values in grid-template-columns
- Verify gap value is appropriate
- Test responsive breakpoints

### Performance Issues
- Reduce number of templates displayed
- Use virtual scrolling for large lists
- Optimize CSS animations

## Code Examples

### Complete Integration Example

```typescript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { TemplateCardEnhancedComponent } from '../home/template-card-enhanced.component';
import { TEMPLATE_METADATA, TemplateMetadata } from '../home/template-metadata';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-resume',
  standalone: true,
  imports: [HeaderComponent, TemplateCardEnhancedComponent],
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.css']
})
export class CreateResumeComponent implements OnInit {
  loggedIn: boolean = false;
  templates: TemplateMetadata[] = TEMPLATE_METADATA;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  selectTemplate(templateId: number): void {
    this.router.navigate(['/resume-builder'], { 
      queryParams: { templateId: templateId } 
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
```

## Testing

### Unit Tests
```typescript
describe('TemplateCardEnhancedComponent', () => {
  it('should emit selected event on click', () => {
    const component = new TemplateCardEnhancedComponent();
    component.template = TEMPLATE_METADATA[0];
    
    spyOn(component.selected, 'emit');
    component.onSelect();
    
    expect(component.selected.emit).toHaveBeenCalledWith(1);
  });
});
```

### E2E Tests
```typescript
describe('Create Resume Page', () => {
  it('should display all templates', () => {
    cy.visit('/create-resume');
    cy.get('app-template-card-enhanced').should('have.length', 12);
  });

  it('should navigate to resume builder on template selection', () => {
    cy.visit('/create-resume');
    cy.get('app-template-card-enhanced').first().click();
    cy.url().should('include', '/resume-builder');
  });
});
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review component documentation
3. Check browser console for errors
4. Verify all imports are correct
