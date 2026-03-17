# Template Preview System - Quick Reference

## 🚀 Quick Start

### 1. Import Components
```typescript
import { TemplateCardEnhancedComponent } from '../home/template-card-enhanced.component';
import { TEMPLATE_METADATA } from '../home/template-metadata';
```

### 2. Add to Component
```typescript
@Component({
  imports: [TemplateCardEnhancedComponent],
  // ...
})
export class MyComponent {
  templates = TEMPLATE_METADATA;
}
```

### 3. Use in Template
```html
<app-template-card-enhanced 
  *ngFor="let template of templates" 
  [template]="template"
  (selected)="selectTemplate($event)">
</app-template-card-enhanced>
```

## 📋 Template Metadata Structure

```typescript
{
  id: 1,                              // Unique identifier
  name: 'Classic Blue',               // Display name
  category: 'Professional',           // Category badge
  description: 'Traditional...',      // Short description
  layoutType: 'executive',            // Layout style
  primaryColor: '#1e3c72',            // Main color
  accentColor: '#2a5298',             // Secondary color
  hasPhoto: true,                     // Show photo placeholder
  hasSidebar: false                   // Has sidebar layout
}
```

## 🎨 Layout Types

| Type | Description | Use Case |
|------|-------------|----------|
| `executive` | Two-column with header | Professional roles |
| `sidebar` | Left sidebar layout | Creative professionals |
| `creative` | Colorful with icons | Creative industries |
| `elegant` | Serif typography | Academic/formal |
| `bold` | Strong gradient header | Executive level |
| `minimal` | Clean, simple | Entry level |
| `modern` | Contemporary design | Tech professionals |

## 🎯 Key Features

### Card Component
- ✅ Realistic preview rendering
- ✅ Metadata display (name, category, description)
- ✅ Feature badges (Photo, Sidebar, Layout)
- ✅ Hover effects with overlay
- ✅ Select button
- ✅ Responsive design

### Preview Component
- ✅ 7 layout styles
- ✅ Dynamic color theming
- ✅ Lightweight CSS rendering
- ✅ A4 aspect ratio (8.5:11)
- ✅ Realistic section representation

## 🔧 Customization

### Change Colors
```typescript
{
  primaryColor: '#your-color',
  accentColor: '#your-accent'
}
```

### Add New Template
```typescript
{
  id: 13,
  name: 'New Template',
  category: 'Category',
  description: 'Description',
  layoutType: 'executive',
  primaryColor: '#2563eb',
  accentColor: '#1e40af',
  hasPhoto: true,
  hasSidebar: false
}
```

### Modify Grid
```css
.templates-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}
```

## 📱 Responsive Breakpoints

| Screen | Columns | Gap |
|--------|---------|-----|
| Desktop (1024px+) | 4-5 | 28px |
| Tablet (768px-1024px) | 2-3 | 24px |
| Mobile (480px-768px) | 1-2 | 20px |
| Small (<480px) | 1 | 16px |

## 🎬 Animations

### Card Hover
- Shadow: `0 2px 8px` → `0 12px 32px`
- Transform: `translateY(-8px)`
- Duration: `0.3s`
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Overlay
- Opacity: `0` → `1`
- Background: `rgba(0, 0, 0, 0)` → `rgba(0, 0, 0, 0.4)`
- Duration: `0.3s`

### Button
- Scale: `1` → `1.05` on hover
- Scale: `1.05` → `0.98` on click

## 🔍 CSS Variables

```css
--primary-color: Template's primary color
--accent-color: Template's accent color
```

Used in preview for dynamic theming.

## 📊 File Sizes

| File | Size | Purpose |
|------|------|---------|
| template-metadata.ts | ~2KB | Template definitions |
| template-preview-enhanced.component.ts | ~15KB | Preview renderer |
| template-card-enhanced.component.ts | ~8KB | Card wrapper |

## ⚡ Performance Tips

1. **Lazy Load**: Cards render on demand
2. **CSS Variables**: No re-renders for color changes
3. **Hardware Acceleration**: Use `transform` for animations
4. **Minimal DOM**: Simplified structure
5. **No Images**: Pure CSS rendering

## 🐛 Common Issues

### Preview Not Showing
```
✓ Check template metadata imported
✓ Verify layoutType in switch cases
✓ Check CSS variables defined
```

### Colors Not Applying
```
✓ Verify hex color format
✓ Check CSS variable syntax
✓ Clear browser cache
```

### Grid Layout Wrong
```
✓ Check minmax values
✓ Verify gap value
✓ Test responsive breakpoints
```

## 📚 Related Files

- `template-metadata.ts` - Template definitions
- `template-preview-enhanced.component.ts` - Preview renderer
- `template-card-enhanced.component.ts` - Card component
- `create-resume.component.html` - Usage example
- `create-resume.component.ts` - Integration example
- `create-resume.component.css` - Grid styling

## 🔗 Integration Points

```
Home Page
    ↓
Create Resume Page
    ↓
Template Card Component
    ├── Template Preview Component
    └── Template Metadata
    ↓
Resume Builder (on selection)
```

## 💡 Pro Tips

1. **Batch Updates**: Update multiple templates at once
2. **Color Consistency**: Use brand colors for primary/accent
3. **Category Naming**: Keep categories consistent
4. **Description Length**: Keep descriptions under 60 characters
5. **Feature Flags**: Use hasPhoto/hasSidebar for variations

## 🎓 Learning Resources

- Angular Components: https://angular.io/guide/component-overview
- CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- CSS Variables: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- Responsive Design: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

## 📞 Support

For questions or issues:
1. Check TEMPLATE_PREVIEW_SYSTEM.md for detailed docs
2. Review component source code
3. Check browser console for errors
4. Verify all imports are correct
