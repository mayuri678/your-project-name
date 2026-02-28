# Resume Templates - 55 Professional Designs

This project includes **55 unique resume templates** with different styles, colors, and layouts.

## Template Categories

### Professional (7 templates)
- Template 1: Classic Professional
- Template 4: Professional Purple
- Template 20: Slate Gray
- Template 21: Indigo Pro
- Template 53: Charcoal Pro
- Template 55: Crimson Pro

### Modern (3 templates)
- Template 2: Modern Blue
- Template 13: Sky Blue
- Template 29: Steel Blue

### Creative & Bold (5 templates)
- Template 3: Creative Green
- Template 7: Bold Orange
- Template 18: Crimson Red
- Template 35: Cobalt Blue

### Elegant & Luxury (3 templates)
- Template 5: Elegant Red
- Template 26: Burgundy
- Template 30: Amber Gold

### Minimal & Clean (5 templates)
- Template 6: Minimal Gray
- Template 11: Classic Black
- Template 19: Mint Green
- Template 29: Steel Blue
- Template 44: Lemon

### Nature & Fresh (6 templates)
- Template 10: Fresh Lime
- Template 14: Forest Green
- Template 19: Mint Green
- Template 27: Olive
- Template 34: Sage Green
- Template 49: Mint

### Ocean & Tropical (5 templates)
- Template 17: Ocean Blue
- Template 25: Turquoise
- Template 32: Aqua Marine
- Template 39: Seafoam

### Vibrant & Bright (5 templates)
- Template 12: Vibrant Pink
- Template 22: Coral Bright
- Template 28: Magenta
- Template 44: Lemon

### Precious & Rich (5 templates)
- Template 33: Ruby Red
- Template 41: Jade
- Template 50: Sapphire
- Template 54: Emerald

### Soft & Gentle (5 templates)
- Template 23: Lavender
- Template 36: Peach
- Template 47: Lilac
- Template 52: Periwinkle

### Dark & Professional (5 templates)
- Template 24: Charcoal
- Template 38: Graphite
- Template 43: Midnight
- Template 48: Onyx

### Additional Styles (6 templates)
- Template 8: Tech Teal
- Template 9: Corporate Navy
- Template 16: Royal Purple
- Template 31: Deep Purple
- Template 42: Orchid
- Template 46: Copper
- Template 51: Tangerine

## Template Layouts

### Sidebar Layout (27 templates)
Templates with a colored sidebar containing contact info and skills:
- Templates: 2, 4, 7, 9, 12, 14, 16, 18, 21, 24, 26, 28, 31, 33, 36, 38, 41, 43, 46, 48, 51, 53

### Header Layout (22 templates)
Templates with a colored header banner:
- Templates: 3, 5, 8, 10, 13, 15, 17, 20, 22, 25, 27, 30, 32, 35, 37, 40, 42, 45, 47, 50, 52, 55

### Clean/Minimal Layout (11 templates)
Templates with minimal design and clean typography:
- Templates: 1, 6, 11, 19, 23, 29, 34, 39, 44, 49, 54

## Color Palette

Each template uses a unique color scheme:
- Blues: 2, 9, 13, 17, 29, 35, 45, 50
- Greens: 3, 10, 14, 19, 27, 34, 41, 49, 54
- Purples: 4, 16, 23, 28, 31, 37, 47, 52
- Reds: 5, 18, 26, 33, 40, 55
- Oranges: 7, 15, 22, 36, 46, 51
- Teals/Cyans: 8, 25, 32, 39
- Grays/Blacks: 6, 11, 20, 24, 38, 43, 48, 53
- Pinks: 12, 42
- Yellows: 30, 44

## Usage

### In Template Selection Component
```typescript
import { TemplateRegistryService } from './resume-templates/template-registry.service';

constructor(private templateRegistry: TemplateRegistryService) {}

ngOnInit() {
  const allTemplates = this.templateRegistry.getAllTemplates();
  const template = this.templateRegistry.getTemplateById(5);
  const categories = this.templateRegistry.getCategories();
}
```

### In Resume Builder
```typescript
import { ResumeTemplate5Component } from './resume-templates';

// Use the template component dynamically
const templateComponent = this.templateRegistry.getTemplateById(5)?.component;
```

## Template Structure

Each template includes:
- **Personal Information**: Name, title, contact details
- **Professional Summary**: Brief overview
- **Work Experience**: Job history with descriptions
- **Education**: Academic background
- **Skills**: Technical and soft skills
- **Certifications**: Optional certifications section
- **Photo**: Optional profile photo (some templates)

## Customization

All templates support:
- ✅ Custom colors via Tailwind CSS classes
- ✅ Responsive design for different screen sizes
- ✅ Print-optimized layouts (A4 size: 210mm x 297mm)
- ✅ Dynamic content binding
- ✅ Conditional sections (show/hide based on data)

## Adding New Templates

To add a new template:

1. Create a new folder: `template-XX`
2. Create component file: `template-XX.component.ts`
3. Create HTML template: `template-XX.component.html`
4. Register in `template-registry.service.ts`
5. Export in `index.ts`

## Technical Details

- **Framework**: Angular 20.1.0
- **Styling**: Tailwind CSS
- **Component Type**: Standalone components
- **Data Interface**: ResumeData interface
- **Print Support**: CSS print media queries

## License

All templates are part of the YourProjectName application.
