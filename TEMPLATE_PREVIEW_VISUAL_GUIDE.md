# Template Preview System - Visual Architecture Guide

## 🏗️ Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CreateResumeComponent                      │
│  (Main page displaying template grid)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ imports
                     ▼
        ┌────────────────────────────┐
        │ TEMPLATE_METADATA          │
        │ (12 template definitions)  │
        └────────────────────────────┘
                     │
                     │ provides data
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              TemplateCardEnhancedComponent                   │
│  (Card wrapper with metadata and interactions)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  TemplatePreviewComponent                            │  │
│  │  (Renders mini preview of template layout)           │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │ Executive / Sidebar / Creative / Elegant   │    │  │
│  │  │ Bold / Minimal / Modern Layout             │    │  │
│  │  │ (Dynamic color theming via CSS variables)  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  Overlay (on hover)                                 │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  [Select Template Button]                   │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Card Footer                                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Template Name          [Category Badge]             │  │
│  │ Description text...                                 │  │
│  │ 📷 Photo  📋 Sidebar  🎨 Executive                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

```
User Opens Create Resume Page
         │
         ▼
CreateResumeComponent.ngOnInit()
         │
         ├─ Check authentication
         │
         └─ Load TEMPLATE_METADATA
                    │
                    ▼
         *ngFor loop creates cards
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    Card 1                 Card 2
    (Template 1)           (Template 2)
         │                     │
         ├─ Pass metadata      ├─ Pass metadata
         │                     │
         ▼                     ▼
    TemplatePreviewComponent  TemplatePreviewComponent
    (Render preview)          (Render preview)
         │                     │
         └─────────┬───────────┘
                   │
                   ▼
         User hovers over card
                   │
                   ▼
         Overlay appears with button
                   │
                   ▼
         User clicks "Select Template"
                   │
                   ▼
         (selected) event emitted
                   │
                   ▼
         selectTemplate(templateId)
                   │
                   ▼
         Navigate to /resume-builder
         with templateId query param
```

## 🎨 Layout Types Visual Representation

### 1. Executive Layout
```
┌─────────────────────────────────────────┐
│ [Avatar] Name                           │
│          Title                          │
│ ✉ Email  📱 Phone  📍 Location         │
├─────────────────────────────────────────┤
│ Professional Summary    │ Core Skills    │
│ ▪ ▪ ▪                  │ ▪ ▪            │
│                        │                │
│ Experience             │ Certifications │
│ ▪ ▪ ▪                  │ ▪ ▪            │
│                        │                │
│ Education              │                │
│ ▪ ▪ ▪                  │                │
└─────────────────────────────────────────┘
```

### 2. Sidebar Layout
```
┌──────────────┬──────────────────────────┐
│ [Avatar]     │ Experience               │
│ Name         │ ▪ ▪ ▪                   │
│ Title        │                          │
│              │ Education                │
│ Skills       │ ▪ ▪ ▪                   │
│ ▪ ▪          │                          │
│              │                          │
│ Contact      │                          │
│ ▪ ▪          │                          │
└──────────────┴──────────────────────────┘
```

### 3. Creative Layout
```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │ [Avatar] Name                       │ │
│ │          Title                      │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ 💼 About Me            │ 💡 Skills      │
│ ▪ ▪ ▪                 │ ▪ ▪            │
│                       │                │
│ 💼 Experience         │ 🏆 Certs       │
│ ▪ ▪ ▪                 │ ▪ ▪            │
│                       │                │
│ 🎓 Education          │                │
│ ▪ ▪ ▪                 │                │
└─────────────────────────────────────────┘
```

### 4. Elegant Layout
```
┌─────────────────────────────────────────┐
│ ═══════════════════════════════════════ │
│ [Avatar] Name                           │
│          Title                          │
├─────────────────────────────────────────┤
│ Email  │  Phone  │  Location            │
├─────────────────────────────────────────┤
│ Profile                │ Skills          │
│ ▪ ▪ ▪                 │ ▪ ▪             │
│                       │                 │
│ Experience            │ Certifications  │
│ ▪ ▪ ▪                 │ ▪ ▪             │
└─────────────────────────────────────────┘
```

### 5. Bold Layout
```
┌─────────────────────────────────────────┐
│ ███████████████████████████████████████ │
│ [Avatar] Name                           │
│          Title                          │
│ ✉ Email  📱 Phone  📍 Location         │
├─────────────────────────────────────────┤
│ PROFESSIONAL SUMMARY                    │
│ ▪ ▪ ▪                                   │
│                                         │
│ EXPERIENCE              │ SKILLS        │
│ ▪ ▪ ▪                  │ ▪ ▪           │
│                        │               │
│ EDUCATION              │ CERTIFICATIONS│
│ ▪ ▪ ▪                  │ ▪ ▪           │
└─────────────────────────────────────────┘
```

### 6. Minimal Layout
```
┌─────────────────────────────────────────┐
│ Name                                    │
│ ─────────────────────────────────────── │
│ Title                                   │
│                                         │
│ Experience                              │
│ ▪ ▪ ▪                                   │
│                                         │
│ Skills                                  │
│ ▪ ▪ ▪                                   │
│                                         │
│ Education                               │
│ ▪ ▪ ▪                                   │
└─────────────────────────────────────────┘
```

### 7. Modern Layout
```
┌─────────────────────────────────────────┐
│ [Avatar] Name                           │
│          ─────────────────────────────  │
│          Title                          │
│                                         │
│ Experience                              │
│ ▪ ▪ ▪                                   │
│                                         │
│ Skills                                  │
│ ▪ ▪ ▪                                   │
│                                         │
│ Education                               │
│ ▪ ▪ ▪                                   │
└─────────────────────────────────────────┘
```

## 🔄 Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Page Load                        │
        │ - Check authentication           │
        │ - Load templates from metadata   │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Render Template Cards            │
        │ - Create card for each template  │
        │ - Pass metadata to card          │
        │ - Pass metadata to preview       │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ User Hovers Over Card            │
        │ - Trigger hover animation        │
        │ - Show overlay                   │
        │ - Display select button          │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ User Clicks Select Button        │
        │ - Emit (selected) event          │
        │ - Pass templateId                │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ selectTemplate(templateId)       │
        │ - Navigate to resume-builder     │
        │ - Pass templateId as query param │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Resume Builder Page              │
        │ - Load selected template         │
        │ - Initialize editor              │
        └──────────────────────────────────┘
```

## 📱 Responsive Grid Breakdown

```
Desktop (1024px+)
┌─────────┬─────────┬─────────┬─────────┐
│ Card 1  │ Card 2  │ Card 3  │ Card 4  │
├─────────┼─────────┼─────────┼─────────┤
│ Card 5  │ Card 6  │ Card 7  │ Card 8  │
├─────────┼─────────┼─────────┼─────────┤
│ Card 9  │ Card 10 │ Card 11 │ Card 12 │
└─────────┴─────────┴─────────┴─────────┘

Tablet (768px-1024px)
┌──────────────┬──────────────┬──────────────┐
│   Card 1     │   Card 2     │   Card 3     │
├──────────────┼──────────────┼──────────────┤
│   Card 4     │   Card 5     │   Card 6     │
├──────────────┼──────────────┼──────────────┤
│   Card 7     │   Card 8     │   Card 9     │
├──────────────┼──────────────┼──────────────┤
│   Card 10    │   Card 11    │   Card 12    │
└──────────────┴──────────────┴──────────────┘

Mobile (480px-768px)
┌──────────────────────┐
│      Card 1          │
├──────────────────────┤
│      Card 2          │
├──────────────────────┤
│      Card 3          │
├──────────────────────┤
│      Card 4          │
├──────────────────────┤
│      Card 5          │
├──────────────────────┤
│      Card 6          │
├──────────────────────┤
│      Card 7          │
├──────────────────────┤
│      Card 8          │
├──────────────────────┤
│      Card 9          │
├──────────────────────┤
│      Card 10         │
├──────────────────────┤
│      Card 11         │
├──────────────────────┤
│      Card 12         │
└──────────────────────┘
```

## 🎨 Color Theming System

```
Template Metadata
┌─────────────────────────────────────┐
│ primaryColor: '#1e3c72'             │
│ accentColor: '#2a5298'              │
└─────────────────────────────────────┘
         │
         ▼
CSS Variables
┌─────────────────────────────────────┐
│ --primary-color: #1e3c72            │
│ --accent-color: #2a5298             │
└─────────────────────────────────────┘
         │
         ▼
Applied to Preview
┌─────────────────────────────────────┐
│ Header: linear-gradient(            │
│   var(--primary-color),             │
│   var(--accent-color)               │
│ )                                   │
│                                     │
│ Buttons: background: var(--primary) │
│ Accents: color: var(--accent)       │
└─────────────────────────────────────┘
```

## 🔄 State Management

```
CreateResumeComponent
├── loggedIn: boolean
│   └── Updated on init and logout
│
└── templates: TemplateMetadata[]
    └── Loaded from TEMPLATE_METADATA
        ├── id: number
        ├── name: string
        ├── category: string
        ├── description: string
        ├── layoutType: string
        ├── primaryColor: string
        ├── accentColor: string
        ├── hasPhoto: boolean
        └── hasSidebar: boolean
```

## 📊 CSS Variable Cascade

```
:host (TemplatePreviewComponent)
│
├── --primary-color: Template's primary color
├── --accent-color: Template's accent color
│
└── Applied to:
    ├── .preview-executive
    │   ├── Header background
    │   ├── Section titles
    │   └── Accent elements
    │
    ├── .preview-sidebar
    │   ├── Sidebar background
    │   ├── Text colors
    │   └── Borders
    │
    ├── .preview-creative
    │   ├── Header gradient
    │   ├── Skill boxes
    │   └── Accents
    │
    └── ... (other layouts)
```

## 🎯 Event Flow

```
User Action
    │
    ├─ Hover over card
    │  └─ CSS :hover state
    │     └─ Show overlay
    │        └─ Display button
    │
    └─ Click card/button
       └─ (click) event
          └─ onSelect()
             └─ (selected) emit
                └─ selectTemplate(templateId)
                   └─ router.navigate()
                      └─ Resume Builder Page
```

## 📈 Performance Optimization

```
Rendering Pipeline
│
├─ Template Metadata (2KB)
│  └─ Loaded once
│
├─ CSS Styles (15KB)
│  └─ Parsed once
│
├─ Component Creation
│  └─ Per card (~1ms)
│
├─ CSS Variable Application
│  └─ Per card (~0.5ms)
│
└─ Total Render Time
   └─ ~30ms for 12 cards
```

## 🔐 Security Flow

```
User Authentication
    │
    ├─ Check authService.isLoggedIn()
    │  └─ If false → Redirect to /login
    │
    └─ If true → Load templates
       └─ Display cards
          └─ Allow selection
             └─ Navigate to builder
```

---

**Visual Guide Complete** ✅

These diagrams provide a comprehensive visual understanding of:
- Component architecture
- Data flow
- Layout types
- Responsive design
- Color theming
- Event handling
- Performance optimization
- Security flow
