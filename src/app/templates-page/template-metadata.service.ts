import { Injectable } from '@angular/core';
import { TemplateCardData } from './template-preview-card.component';

@Injectable({
  providedIn: 'root'
})
export class TemplateMetadataService {
  private templates: TemplateCardData[] = [
    { id: 1, name: 'Classic Professional', category: 'Professional', description: 'Traditional two-column layout', layoutType: 'executive', primaryColor: '#1e3c72', accentColor: '#2a5298', hasPhoto: true, hasSidebar: false },
    { id: 2, name: 'Modern Sidebar', category: 'Modern', description: 'Contemporary design with left sidebar', layoutType: 'sidebar', primaryColor: '#2563eb', accentColor: '#1e40af', hasPhoto: true, hasSidebar: true },
    { id: 3, name: 'Creative Green', category: 'Creative', description: 'Vibrant green with modern styling', layoutType: 'creative', primaryColor: '#10b981', accentColor: '#059669', hasPhoto: true, hasSidebar: false },
    { id: 4, name: 'Elegant Purple', category: 'Professional', description: 'Sophisticated serif typography', layoutType: 'elegant', primaryColor: '#7c3aed', accentColor: '#a78bfa', hasPhoto: true, hasSidebar: false },
    { id: 5, name: 'Bold Red', category: 'Executive', description: 'Eye-catching red gradient', layoutType: 'bold', primaryColor: '#dc2626', accentColor: '#991b1b', hasPhoto: true, hasSidebar: false },
    { id: 6, name: 'Executive Gray', category: 'Professional', description: 'Professional gray two-column', layoutType: 'executive', primaryColor: '#6b7280', accentColor: '#4b5563', hasPhoto: true, hasSidebar: false },
    { id: 7, name: 'Tech Modern', category: 'Technology', description: 'Modern tech-focused design', layoutType: 'modern', primaryColor: '#0891b2', accentColor: '#06b6d4', hasPhoto: true, hasSidebar: true },
    { id: 8, name: 'Academic Dark', category: 'Academic', description: 'Academic-focused dark blue', layoutType: 'executive', primaryColor: '#1e3a8a', accentColor: '#1e40af', hasPhoto: true, hasSidebar: false },
    { id: 9, name: 'Startup Green', category: 'Creative', description: 'Dynamic startup vibe', layoutType: 'creative', primaryColor: '#16a34a', accentColor: '#15803d', hasPhoto: true, hasSidebar: false },
    { id: 10, name: 'Corporate Navy', category: 'Professional', description: 'Corporate standard navy', layoutType: 'executive', primaryColor: '#1e3a8a', accentColor: '#1e40af', hasPhoto: true, hasSidebar: false },
    { id: 11, name: 'Artistic Purple', category: 'Creative', description: 'Artistic and creative layout', layoutType: 'creative', primaryColor: '#a855f7', accentColor: '#9333ea', hasPhoto: true, hasSidebar: false },
    { id: 12, name: 'Fresh Graduate', category: 'Entry Level', description: 'Perfect for new graduates', layoutType: 'minimal', primaryColor: '#3b82f6', accentColor: '#2563eb', hasPhoto: false, hasSidebar: false },
    { id: 13, name: 'Sky Blue', category: 'Modern', description: 'Light and airy design', layoutType: 'modern', primaryColor: '#0ea5e9', accentColor: '#0284c7', hasPhoto: true, hasSidebar: true },
    { id: 14, name: 'Forest Green', category: 'Nature', description: 'Natural green theme', layoutType: 'executive', primaryColor: '#15803d', accentColor: '#166534', hasPhoto: true, hasSidebar: false },
    { id: 15, name: 'Sunset Orange', category: 'Warm', description: 'Warm orange tones', layoutType: 'creative', primaryColor: '#ea580c', accentColor: '#c2410c', hasPhoto: true, hasSidebar: false },
    { id: 16, name: 'Royal Purple', category: 'Royal', description: 'Regal purple design', layoutType: 'elegant', primaryColor: '#9333ea', accentColor: '#7e22ce', hasPhoto: true, hasSidebar: false },
    { id: 17, name: 'Ocean Blue', category: 'Ocean', description: 'Deep ocean blue', layoutType: 'sidebar', primaryColor: '#0369a1', accentColor: '#0c4a6e', hasPhoto: true, hasSidebar: true },
    { id: 18, name: 'Crimson Red', category: 'Bold', description: 'Bold crimson design', layoutType: 'bold', primaryColor: '#be123c', accentColor: '#831843', hasPhoto: true, hasSidebar: false },
    { id: 19, name: 'Mint Green', category: 'Fresh', description: 'Fresh mint theme', layoutType: 'modern', primaryColor: '#0d9488', accentColor: '#0f766e', hasPhoto: true, hasSidebar: true },
    { id: 20, name: 'Slate Gray', category: 'Professional', description: 'Professional slate', layoutType: 'executive', primaryColor: '#475569', accentColor: '#334155', hasPhoto: true, hasSidebar: false },
    { id: 21, name: 'Indigo Pro', category: 'Professional', description: 'Deep indigo professional', layoutType: 'executive', primaryColor: '#4f46e5', accentColor: '#4338ca', hasPhoto: true, hasSidebar: false },
    { id: 22, name: 'Coral Bright', category: 'Bright', description: 'Bright coral design', layoutType: 'creative', primaryColor: '#f97316', accentColor: '#ea580c', hasPhoto: true, hasSidebar: false },
    { id: 23, name: 'Lavender', category: 'Soft', description: 'Soft lavender theme', layoutType: 'minimal', primaryColor: '#c084fc', accentColor: '#b78bfa', hasPhoto: false, hasSidebar: false },
    { id: 24, name: 'Charcoal', category: 'Dark', description: 'Dark charcoal design', layoutType: 'executive', primaryColor: '#1f2937', accentColor: '#111827', hasPhoto: true, hasSidebar: false },
    { id: 25, name: 'Turquoise', category: 'Tropical', description: 'Tropical turquoise', layoutType: 'creative', primaryColor: '#06b6d4', accentColor: '#0891b2', hasPhoto: true, hasSidebar: false },
    { id: 26, name: 'Burgundy', category: 'Elegant', description: 'Elegant burgundy', layoutType: 'elegant', primaryColor: '#7c2d12', accentColor: '#92400e', hasPhoto: true, hasSidebar: false },
    { id: 27, name: 'Olive', category: 'Nature', description: 'Natural olive tone', layoutType: 'executive', primaryColor: '#713f12', accentColor: '#854d0e', hasPhoto: true, hasSidebar: false },
    { id: 28, name: 'Magenta', category: 'Vibrant', description: 'Vibrant magenta', layoutType: 'creative', primaryColor: '#d946ef', accentColor: '#c026d3', hasPhoto: true, hasSidebar: false },
    { id: 29, name: 'Steel Blue', category: 'Modern', description: 'Modern steel blue', layoutType: 'modern', primaryColor: '#1e40af', accentColor: '#1e3a8a', hasPhoto: true, hasSidebar: true },
    { id: 30, name: 'Amber Gold', category: 'Luxury', description: 'Luxury gold accents', layoutType: 'elegant', primaryColor: '#b45309', accentColor: '#92400e', hasPhoto: true, hasSidebar: false },
    { id: 31, name: 'Deep Purple', category: 'Deep', description: 'Deep purple design', layoutType: 'bold', primaryColor: '#6d28d9', accentColor: '#5b21b6', hasPhoto: true, hasSidebar: false },
    { id: 32, name: 'Aqua Marine', category: 'Ocean', description: 'Aqua marine theme', layoutType: 'sidebar', primaryColor: '#0891b2', accentColor: '#0e7490', hasPhoto: true, hasSidebar: true },
    { id: 33, name: 'Ruby Red', category: 'Precious', description: 'Precious ruby red', layoutType: 'executive', primaryColor: '#be185d', accentColor: '#9d174d', hasPhoto: true, hasSidebar: false },
    { id: 34, name: 'Sage Green', category: 'Natural', description: 'Natural sage green', layoutType: 'creative', primaryColor: '#65a30d', accentColor: '#4d7c0f', hasPhoto: true, hasSidebar: false },
    { id: 35, name: 'Cobalt Blue', category: 'Bold', description: 'Bold cobalt blue', layoutType: 'bold', primaryColor: '#1e3a8a', accentColor: '#1e40af', hasPhoto: true, hasSidebar: false },
    { id: 36, name: 'Peach', category: 'Soft', description: 'Soft peach theme', layoutType: 'minimal', primaryColor: '#fb923c', accentColor: '#f97316', hasPhoto: false, hasSidebar: false },
    { id: 37, name: 'Plum', category: 'Rich', description: 'Rich plum design', layoutType: 'elegant', primaryColor: '#7c3aed', accentColor: '#6d28d9', hasPhoto: true, hasSidebar: false },
    { id: 38, name: 'Graphite', category: 'Dark', description: 'Dark graphite', layoutType: 'executive', primaryColor: '#374151', accentColor: '#1f2937', hasPhoto: true, hasSidebar: false },
    { id: 39, name: 'Seafoam', category: 'Ocean', description: 'Ocean seafoam', layoutType: 'creative', primaryColor: '#14b8a6', accentColor: '#0d9488', hasPhoto: true, hasSidebar: false },
    { id: 40, name: 'Maroon', category: 'Classic', description: 'Classic maroon', layoutType: 'executive', primaryColor: '#991b1b', accentColor: '#7f1d1d', hasPhoto: true, hasSidebar: false },
    { id: 41, name: 'Jade', category: 'Precious', description: 'Precious jade', layoutType: 'modern', primaryColor: '#059669', accentColor: '#047857', hasPhoto: true, hasSidebar: true },
    { id: 42, name: 'Orchid', category: 'Floral', description: 'Floral orchid', layoutType: 'creative', primaryColor: '#d946ef', accentColor: '#c026d3', hasPhoto: true, hasSidebar: false },
    { id: 43, name: 'Midnight', category: 'Dark', description: 'Dark midnight', layoutType: 'bold', primaryColor: '#0f172a', accentColor: '#1e293b', hasPhoto: true, hasSidebar: false },
    { id: 44, name: 'Lemon', category: 'Bright', description: 'Bright lemon', layoutType: 'creative', primaryColor: '#eab308', accentColor: '#ca8a04', hasPhoto: true, hasSidebar: false },
    { id: 45, name: 'Azure', category: 'Sky', description: 'Sky azure', layoutType: 'modern', primaryColor: '#0284c7', accentColor: '#0369a1', hasPhoto: true, hasSidebar: true },
    { id: 46, name: 'Copper', category: 'Metallic', description: 'Metallic copper', layoutType: 'elegant', primaryColor: '#b45309', accentColor: '#a16207', hasPhoto: true, hasSidebar: false },
    { id: 47, name: 'Lilac', category: 'Soft', description: 'Soft lilac', layoutType: 'minimal', primaryColor: '#a78bfa', accentColor: '#9f7aea', hasPhoto: false, hasSidebar: false },
    { id: 48, name: 'Onyx', category: 'Dark', description: 'Dark onyx', layoutType: 'executive', primaryColor: '#0f172a', accentColor: '#1e293b', hasPhoto: true, hasSidebar: false },
    { id: 49, name: 'Mint', category: 'Fresh', description: 'Fresh mint', layoutType: 'creative', primaryColor: '#10b981', accentColor: '#059669', hasPhoto: true, hasSidebar: false },
    { id: 50, name: 'Sapphire', category: 'Precious', description: 'Precious sapphire', layoutType: 'sidebar', primaryColor: '#1e40af', accentColor: '#1e3a8a', hasPhoto: true, hasSidebar: true },
    { id: 51, name: 'Tangerine', category: 'Citrus', description: 'Citrus tangerine', layoutType: 'bold', primaryColor: '#f97316', accentColor: '#ea580c', hasPhoto: true, hasSidebar: false },
    { id: 52, name: 'Periwinkle', category: 'Soft', description: 'Soft periwinkle', layoutType: 'minimal', primaryColor: '#6366f1', accentColor: '#4f46e5', hasPhoto: false, hasSidebar: false },
    { id: 53, name: 'Charcoal Pro', category: 'Professional', description: 'Professional charcoal', layoutType: 'executive', primaryColor: '#1f2937', accentColor: '#111827', hasPhoto: true, hasSidebar: false },
    { id: 54, name: 'Emerald', category: 'Precious', description: 'Precious emerald', layoutType: 'creative', primaryColor: '#059669', accentColor: '#047857', hasPhoto: true, hasSidebar: false },
    { id: 55, name: 'Crimson Pro', category: 'Professional', description: 'Professional crimson', layoutType: 'bold', primaryColor: '#be123c', accentColor: '#831843', hasPhoto: true, hasSidebar: false }
  ];

  getAllTemplates(): TemplateCardData[] {
    return this.templates;
  }

  getTemplateById(id: number): TemplateCardData | undefined {
    return this.templates.find(t => t.id === id);
  }

  getTemplatesByCategory(category: string): TemplateCardData[] {
    return this.templates.filter(t => t.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.templates.map(t => t.category))].sort();
  }
}
