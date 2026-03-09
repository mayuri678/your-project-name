# Quick Template Update Guide

## ✅ Templates Updated (Professional Designs):
- Template 1: Executive Blue (Professional with gradient header)
- Template 2: Modern Sidebar (Blue sidebar layout)
- Template 3: Creative Green (Modern with green theme)
- Template 4: Elegant Purple (Classic with purple accents)
- Template 5: Bold Red (Strong red theme)

## 🔄 To Update Remaining Templates (6-55):

### Option 1: Copy & Modify Colors
Each template 6-55 can use one of the 5 base designs with different colors:

**Template 6** - Copy Template 1, change blue to gray
**Template 7** - Copy Template 2, change blue to orange
**Template 8** - Copy Template 3, change green to teal
**Template 9** - Copy Template 4, change purple to navy
**Template 10** - Copy Template 5, change red to maroon

### Option 2: Quick Color Variables

For each template, just change these CSS colors:

```css
/* Template 6 - Gray Theme */
--primary-color: #6b7280;
--secondary-color: #9ca3af;
--bg-color: #f9fafb;

/* Template 7 - Orange Theme */
--primary-color: #ea580c;
--secondary-color: #fb923c;
--bg-color: #fff7ed;

/* Template 8 - Teal Theme */
--primary-color: #0d9488;
--secondary-color: #14b8a6;
--bg-color: #f0fdfa;
```

### Option 3: Automated Script

Run this in your terminal to copy templates:

```bash
# Copy template 1 to templates 6, 11, 16, 21, etc.
for i in 6 11 16 21 26 31 36 41 46 51; do
  cp -r src/app/resume-templates/template-01/* src/app/resume-templates/template-$i/
done

# Copy template 2 to templates 7, 12, 17, 22, etc.
for i in 7 12 17 22 27 32 37 42 47 52; do
  cp -r src/app/resume-templates/template-2/* src/app/resume-templates/template-$i/
done

# Copy template 3 to templates 8, 13, 18, 23, etc.
for i in 8 13 18 23 28 33 38 43 48 53; do
  cp -r src/app/resume-templates/template-3/* src/app/resume-templates/template-$i/
done

# Copy template 4 to templates 9, 14, 19, 24, etc.
for i in 9 14 19 24 29 34 39 44 49 54; do
  cp -r src/app/resume-templates/template-4/* src/app/resume-templates/template-$i/
done

# Copy template 5 to templates 10, 15, 20, 25, etc.
for i in 10 15 20 25 30 35 40 45 50 55; do
  cp -r src/app/resume-templates/template-5/* src/app/resume-templates/template-$i/
done
```

## 🎨 Color Palette for Templates:

Template 1-5: Base designs
Template 6-10: Gray, Orange, Teal, Navy, Maroon
Template 11-15: Indigo, Coral, Lavender, Charcoal, Turquoise
Template 16-20: Royal Purple, Ocean Blue, Crimson, Mint, Slate
Template 21-25: Deep Purple, Aqua, Ruby, Sage, Cobalt
Template 26-30: Burgundy, Olive, Magenta, Steel Blue, Amber
Template 31-35: Plum, Seafoam, Jade, Peach, Graphite
Template 36-40: Orchid, Maroon, Copper, Midnight, Lemon
Template 41-45: Azure, Lilac, Onyx, Tangerine, Periwinkle
Template 46-50: Emerald, Sapphire, Rose, Forest, Sky
Template 51-55: Sunset, Dawn, Dusk, Autumn, Spring

## 🚀 Current Status:
✅ Templates 1-5: Professional & Unique
⏳ Templates 6-55: Need color updates

## 📝 Next Steps:
1. Test templates 1-5 first
2. Verify they look different
3. Then update remaining templates using copy method
4. Change colors in each copied template
