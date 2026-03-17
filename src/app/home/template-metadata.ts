export interface TemplateMetadata {
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

export const TEMPLATE_METADATA: TemplateMetadata[] = [
  {
    id: 1,
    name: 'Classic Blue',
    category: 'Professional',
    description: 'Traditional professional look with two-column layout',
    layoutType: 'executive',
    primaryColor: '#1e3c72',
    accentColor: '#2a5298',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 2,
    name: 'Modern Sidebar',
    category: 'Creative',
    description: 'Contemporary design with left sidebar',
    layoutType: 'sidebar',
    primaryColor: '#2563eb',
    accentColor: '#1e40af',
    hasPhoto: true,
    hasSidebar: true
  },
  {
    id: 3,
    name: 'Creative Green',
    category: 'Creative',
    description: 'Vibrant green with emoji icons and modern styling',
    layoutType: 'creative',
    primaryColor: '#10b981',
    accentColor: '#059669',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 4,
    name: 'Elegant Purple',
    category: 'Professional',
    description: 'Sophisticated serif typography with purple accents',
    layoutType: 'elegant',
    primaryColor: '#7c3aed',
    accentColor: '#a78bfa',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 5,
    name: 'Bold Red',
    category: 'Executive',
    description: 'Eye-catching red gradient with strong typography',
    layoutType: 'bold',
    primaryColor: '#dc2626',
    accentColor: '#991b1b',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 6,
    name: 'Executive Gray',
    category: 'Professional',
    description: 'Professional gray with two-column layout',
    layoutType: 'executive',
    primaryColor: '#6b7280',
    accentColor: '#4b5563',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 7,
    name: 'Tech Modern',
    category: 'Technology',
    description: 'Modern tech-focused design',
    layoutType: 'modern',
    primaryColor: '#0891b2',
    accentColor: '#06b6d4',
    hasPhoto: true,
    hasSidebar: true
  },
  {
    id: 8,
    name: 'Academic Dark',
    category: 'Academic',
    description: 'Academic-focused with dark blue theme',
    layoutType: 'executive',
    primaryColor: '#1e3a8a',
    accentColor: '#1e40af',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 9,
    name: 'Startup Green',
    category: 'Creative',
    description: 'Dynamic startup vibe with green accents',
    layoutType: 'creative',
    primaryColor: '#16a34a',
    accentColor: '#15803d',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 10,
    name: 'Corporate Navy',
    category: 'Professional',
    description: 'Corporate standard navy design',
    layoutType: 'executive',
    primaryColor: '#1e3a8a',
    accentColor: '#1e40af',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 11,
    name: 'Artistic Purple',
    category: 'Creative',
    description: 'Artistic and creative layout',
    layoutType: 'creative',
    primaryColor: '#a855f7',
    accentColor: '#9333ea',
    hasPhoto: true,
    hasSidebar: false
  },
  {
    id: 12,
    name: 'Fresh Graduate',
    category: 'Entry Level',
    description: 'Perfect for new graduates',
    layoutType: 'minimal',
    primaryColor: '#3b82f6',
    accentColor: '#2563eb',
    hasPhoto: false,
    hasSidebar: false
  }
];
