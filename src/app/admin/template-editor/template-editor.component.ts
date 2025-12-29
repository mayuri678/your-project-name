import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ResumeTemplate } from '../../models/admin.models';

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  profilePhoto?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.css']
})
export class TemplateEditorComponent implements OnInit {
  template: ResumeTemplate | null = null;
  selectedTemplate: string = 'template1';
  resumeData: ResumeData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    profilePhoto: '',
    experience: [],
    education: [],
    skills: []
  };
  skillsText: string = '';
  isLoading = false;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const templateId = this.route.snapshot.paramMap.get('id');
    console.log('Template Editor - Template ID from route:', templateId);
    if (templateId) {
      this.loadTemplate(templateId);
    } else {
      console.error('No template ID provided in route');
    }
  }

  loadTemplate(templateId: string): void {
    this.isLoading = true;
    this.adminService.getTemplateById(templateId).subscribe({
      next: (template) => {
        this.template = {
          ...template,
          color: template.color || 'Blue',
          layout: template.layout || '1 Column',
          templateFeatures: template.templateFeatures || ['Photo', 'Skills Bar', 'Charts', 'Icons', 'Timeline', 'Portfolio']
        };
        
        // Set selectedTemplate for preview
        const categoryMap: {[key: string]: string} = {
          'Professional': 'template1',
          'Creative': 'template2', 
          'Modern': 'template3',
          'Classic': 'template4',
          'Technical': 'template5'
        };
        this.selectedTemplate = categoryMap[template.category] || 'template1';
        
        console.log('Template loaded for editing:', this.template);
        console.log('Selected template for preview:', this.selectedTemplate);
        this.parseResumeData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading template:', error);
        this.isLoading = false;
      }
    });
  }

  parseResumeData(): void {
    if (!this.template) return;
    
    try {
      let parsed: any = {};
      
      // Try to parse resume data from template description
      if (this.template.description && this.template.description.trim().startsWith('{')) {
        parsed = JSON.parse(this.template.description);
        console.log('Parsed template data:', parsed);
      }
      
      // Check if this is a template created from admin panel (has template metadata)
      if (parsed.templateName || (parsed.name && !parsed.email)) {
        // This is admin template metadata, create sample resume data
        this.resumeData = {
          name: parsed.name || parsed.templateName || this.template.name || 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          address: 'New York, NY, USA',
          summary: 'Experienced professional with expertise in various technologies and strong problem-solving skills.',
          profilePhoto: '',
          experience: [this.getEmptyExperience()],
          education: [this.getEmptyEducation()],
          skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python']
        };
        
        // Update template properties from parsed metadata
        if (parsed.templateColor) this.template.color = parsed.templateColor;
        if (parsed.templateLayout) this.template.layout = parsed.templateLayout;
        if (parsed.templateFeatures) this.template.templateFeatures = parsed.templateFeatures;
        if (parsed.isActive !== undefined) this.template.isActive = parsed.isActive;
        
      } else if (parsed.email) {
        // This is a full resume template with user data
        this.resumeData = {
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          address: parsed.address || '',
          summary: parsed.summary || '',
          profilePhoto: parsed.profilePhoto || '',
          experience: parsed.experience || [this.getEmptyExperience()],
          education: parsed.education || [this.getEmptyEducation()],
          skills: parsed.skills || []
        };
      } else {
        // Create default resume data structure
        this.resumeData = {
          name: this.template.name || 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          address: 'New York, NY, USA',
          summary: 'Experienced professional with expertise in various technologies and strong problem-solving skills.',
          profilePhoto: '',
          experience: [this.getEmptyExperience()],
          education: [this.getEmptyEducation()],
          skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python']
        };
      }
      
      this.skillsText = this.resumeData.skills.join(', ');
      console.log('Final resume data:', this.resumeData);
      
    } catch (error) {
      console.error('Error parsing resume data:', error);
      this.resumeData = {
        name: this.template?.name || 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: 'New York, NY, USA',
        summary: 'Experienced professional with expertise in various technologies and strong problem-solving skills.',
        profilePhoto: '',
        experience: [this.getEmptyExperience()],
        education: [this.getEmptyEducation()],
        skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python']
      };
      this.skillsText = this.resumeData.skills.join(', ');
    }
  }

  getEmptyExperience(): Experience {
    return {
      position: 'Senior Software Developer',
      company: 'Tech Solutions Inc.',
      startDate: '2022',
      endDate: 'Present',
      description: 'Led development of web applications using modern frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.'
    };
  }

  getEmptyEducation(): Education {
    return {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      year: '2021',
      grade: '3.8 GPA'
    };
  }

  addExperience(): void {
    if (this.resumeData) {
      this.resumeData.experience.push(this.getEmptyExperience());
    }
  }

  removeExperience(index: number): void {
    if (this.resumeData && this.resumeData.experience.length > 1) {
      this.resumeData.experience.splice(index, 1);
    }
  }

  addEducation(): void {
    if (this.resumeData) {
      this.resumeData.education.push(this.getEmptyEducation());
    }
  }

  removeEducation(index: number): void {
    if (this.resumeData && this.resumeData.education.length > 1) {
      this.resumeData.education.splice(index, 1);
    }
  }

  updateSkills(): void {
    if (this.resumeData) {
      this.resumeData.skills = this.skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }
  }

  // Photo upload functions
  onPhotoSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.resumeData) {
          this.resumeData.profilePhoto = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    if (this.resumeData) {
      this.resumeData.profilePhoto = '';
    }
  }

  // Features management
  hasFeature(feature: string): boolean {
    return this.template?.templateFeatures?.includes(feature) || false;
  }

  toggleFeature(feature: string): void {
    if (!this.template?.templateFeatures) {
      this.template!.templateFeatures = [];
    }
    
    const features = this.template!.templateFeatures;
    const index = features.indexOf(feature);
    
    if (index > -1) {
      features.splice(index, 1);
    } else {
      features.push(feature);
    }
  }

  onColorChange(): void {
    // Force template preview update when color changes
    console.log('Color changed to:', this.template?.color);
  }

  getColorClass(): string {
    return `color-${(this.template?.color?.toLowerCase() || 'blue')}`;
  }

  saveTemplate(): void {
    if (!this.template) {
      alert('Template not found!');
      return;
    }

    console.log('Saving template:', this.template);
    this.isSaving = true;
    
    // Create combined data with both template metadata and resume content
    const combinedData = {
      // Resume content first
      ...this.resumeData,
      // Template metadata (will override resume name if needed)
      templateName: this.template.name,
      templateColor: this.template.color || 'Blue',
      templateLayout: this.template.layout || '1 Column',
      templateFeatures: this.template.templateFeatures || [],
      isActive: this.template.isActive
    };
    
    const updates = {
      name: this.template.name,
      category: this.template.category,
      color: this.template.color || 'Blue',
      layout: this.template.layout || '1 Column',
      templateFeatures: this.template.templateFeatures || [],
      isActive: this.template.isActive,
      description: JSON.stringify(combinedData)
    };

    console.log('Updates to save:', updates);

    this.adminService.updateTemplate(this.template.id, updates).subscribe({
      next: (success) => {
        console.log('Save result:', success);
        this.isSaving = false;
        
        if (success) {
          Object.assign(this.template!, updates);
          alert('✅ Template saved successfully!');
          
          setTimeout(() => {
            this.router.navigate(['/admin/templates']);
          }, 1000);
        } else {
          alert('❌ Failed to save template!');
        }
      },
      error: (error) => {
        console.error('Save error:', error);
        this.isSaving = false;
        alert('❌ Error occurred while saving!');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  goBack(): void {
    // Trigger refresh of template management when going back
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshTemplates', 'true');
    }
    this.router.navigate(['/admin/templates']);
  }

  testSave(): void {
    console.log('Test Save - Current template:', this.template);
    
    if (!this.template) {
      alert('❌ Template object नाही!');
      return;
    }
    
    alert('✅ Template ready आहे! Save करू शकतो.');
  }
}