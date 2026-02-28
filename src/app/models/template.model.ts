export interface ResumeTemplate {
  id: string;
  name: string;
  style: 'Professional' | 'Modern' | 'Creative';
  color: string;
  thumbnail: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    style: 'Professional',
    color: '#3b5998',
    thumbnail: 'professional'
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    style: 'Modern',
    color: '#4285f4',
    thumbnail: 'modern'
  },
  {
    id: 'creative-green',
    name: 'Creative Green',
    style: 'Creative',
    color: '#00c853',
    thumbnail: 'creative'
  }
];
