import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Type, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateRegistryService } from '../resume-templates/template-registry.service';
import { ResumeData } from '../resume-templates/models/resume-data.interface';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-builder.component.html',
  styleUrl: './resume-builder.component.css'
})
export class ResumeBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild('templateContainer', { read: ViewContainerRef }) templateContainer!: ViewContainerRef;
  
  profilePhoto: string | null = null;
  selectedTemplateId: number = 1;
  templateComponent: ComponentRef<any> | null = null;
  currentResumeId: string | null = null;
  
  resumeData: ResumeData = {
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in Angular, React, and Node.js. Proven track record of delivering high-quality applications.',
    skills: ['Angular', 'TypeScript', 'JavaScript', 'Node.js', 'React', 'HTML/CSS', 'Git'],
    experience: [
      {
        company: 'Tech Corp',
        role: 'Senior Software Engineer',
        duration: '2020 - Present',
        description: 'Led development of enterprise web applications using Angular and Node.js. Mentored junior developers and improved code quality.'
      },
      {
        company: 'StartUp Inc',
        role: 'Software Developer',
        duration: '2018 - 2020',
        description: 'Developed responsive web applications and RESTful APIs. Collaborated with cross-functional teams.'
      }
    ],
    education: [
      {
        institution: 'University of California',
        degree: 'Bachelor of Science in Computer Science',
        year: '2018'
      }
    ],
    projects: [],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    photo: ''
  };

  skillInput = '';
  certInput = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateRegistry: TemplateRegistryService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const templateId = +params['templateId'];
      const resumeId = params['resumeId'];
      
      if (templateId && templateId !== this.selectedTemplateId) {
        this.selectedTemplateId = templateId;
        console.log('Loading template ID:', this.selectedTemplateId);
        if (this.templateContainer) {
          this.loadTemplate();
        }
      }
      
      // Load existing resume if resumeId provided
      if (resumeId) {
        await this.loadExistingResume(resumeId);
      }
    });

    const savedData = localStorage.getItem('currentResumeData');
    if (savedData) {
      this.resumeData = JSON.parse(savedData);
      this.profilePhoto = this.resumeData.photo || null;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.loadTemplate(), 0);
  }

  loadTemplate() {
    if (!this.templateContainer) {
      console.error('❌ Template container not found');
      return;
    }
    
    console.log('🔄 Clearing previous template...');
    this.templateContainer.clear();
    
    console.log('🔍 Looking for template ID:', this.selectedTemplateId);
    const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
    
    if (template) {
      console.log('✅ Found template:', template.name);
      console.log('📦 Component:', template.component.name);
      
      this.templateComponent = this.templateContainer.createComponent(template.component);
      this.templateComponent.instance.data = this.resumeData;
      this.templateComponent.changeDetectorRef.detectChanges();
      
      console.log('✨ Template loaded successfully!');
    } else {
      console.error('❌ Template not found for ID:', this.selectedTemplateId);
    }
  }

  updatePreview() {
    if (this.templateComponent) {
      this.templateComponent.instance.data = { ...this.resumeData };
      this.templateComponent.changeDetectorRef.detectChanges();
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhoto = e.target.result;
        this.resumeData.photo = e.target.result;
        this.updatePreview();
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.profilePhoto = null;
    this.resumeData.photo = '';
    this.updatePreview();
  }

  addSkill() {
    if (this.skillInput.trim()) {
      this.resumeData.skills.push(this.skillInput.trim());
      this.skillInput = '';
      this.updatePreview();
    }
  }

  removeSkill(index: number) {
    this.resumeData.skills.splice(index, 1);
    this.updatePreview();
  }

  addCertification() {
    if (this.certInput.trim()) {
      this.resumeData.certifications.push(this.certInput.trim());
      this.certInput = '';
      this.updatePreview();
    }
  }

  removeCertification(index: number) {
    this.resumeData.certifications.splice(index, 1);
    this.updatePreview();
  }

  addExperience() {
    this.resumeData.experience.push({ company: '', role: '', duration: '', description: '' });
    this.updatePreview();
  }

  removeExperience(index: number) {
    this.resumeData.experience.splice(index, 1);
    this.updatePreview();
  }

  addEducation() {
    this.resumeData.education.push({ institution: '', degree: '', year: '' });
    this.updatePreview();
  }

  removeEducation(index: number) {
    this.resumeData.education.splice(index, 1);
    this.updatePreview();
  }

  async saveResume() {
    localStorage.setItem('currentResumeData', JSON.stringify(this.resumeData));
    
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (user) {
      // Supabase user logged in - save to database
      if (this.currentResumeId) {
        const { error } = await supabase
          .from('user_resumes')
          .update({
            template_id: this.selectedTemplateId,
            resume_data: this.resumeData,
            resume_name: this.resumeData.name || 'My Resume',
            updated_at: new Date().toISOString()
          })
          .eq('id', this.currentResumeId);
        
        if (error) {
          console.error('Error:', error);
          alert('❌ Error: ' + error.message);
        } else {
          alert('✅ Resume updated!');
        }
      } else {
        const { data, error } = await supabase
          .from('user_resumes')
          .insert({
            user_id: user.id,
            template_id: this.selectedTemplateId,
            resume_data: this.resumeData,
            resume_name: this.resumeData.name || 'My Resume',
            status: 'draft'
          })
          .select()
          .single();
        
        if (error) {
          console.error('Error:', error);
          alert('❌ Error: ' + error.message);
        } else {
          this.currentResumeId = data.id;
          alert('✅ Resume saved!');
        }
      }
    } else if (adminToken && adminUser) {
      // Admin - try to save to Supabase using admin credentials
      try {
        // First try to login admin to Supabase
        const { data: authData } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: 'admin123'
        });
        
        if (authData.user) {
          // Save to Supabase as admin
          const { data, error } = await supabase
            .from('user_resumes')
            .insert({
              user_id: authData.user.id,
              template_id: this.selectedTemplateId,
              resume_data: this.resumeData,
              resume_name: this.resumeData.name || 'My Resume',
              status: 'draft'
            })
            .select()
            .single();
          
          if (!error && data) {
            this.currentResumeId = data.id;
            alert('✅ Resume saved to database!');
            return;
          }
        }
      } catch (err) {
        console.log('Admin Supabase save failed, using localStorage');
      }
      
      // Fallback to localStorage
      const localResumes = JSON.parse(localStorage.getItem('localResumes') || '[]');
      const newResume = {
        id: this.currentResumeId || `admin_${Date.now()}`,
        template_id: this.selectedTemplateId,
        resume_name: this.resumeData.name || 'My Resume',
        resume_data: this.resumeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_type: 'admin'
      };
      
      const existingIndex = localResumes.findIndex((r: any) => r.id === newResume.id);
      if (existingIndex >= 0) {
        localResumes[existingIndex] = newResume;
      } else {
        localResumes.push(newResume);
        this.currentResumeId = newResume.id;
      }
      
      localStorage.setItem('localResumes', JSON.stringify(localResumes));
      alert('✅ Resume saved locally!');
    } else {
      // Not logged in
      const localResumes = JSON.parse(localStorage.getItem('localResumes') || '[]');
      const newResume = {
        id: this.currentResumeId || `local_${Date.now()}`,
        template_id: this.selectedTemplateId,
        resume_name: this.resumeData.name || 'My Resume',
        resume_data: this.resumeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const existingIndex = localResumes.findIndex((r: any) => r.id === newResume.id);
      if (existingIndex >= 0) {
        localResumes[existingIndex] = newResume;
      } else {
        localResumes.push(newResume);
        this.currentResumeId = newResume.id;
      }
      
      localStorage.setItem('localResumes', JSON.stringify(localResumes));
      alert('✅ Resume saved locally! Login to save to cloud.');
    }
  }

  async downloadPDF() {
    const element = document.querySelector('.template-preview-container') as HTMLElement;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`resume-${this.resumeData.name || 'download'}.pdf`);
    
    this.saveToMyTemplates();
  }

  saveToMyTemplates() {
    const templateId = `my_resume_${Date.now()}`;
    const myTemplate = {
      id: templateId,
      name: this.resumeData.name || 'My Resume',
      category: 'My Resumes',
      thumbnail: this.profilePhoto || '',
      resumeData: this.resumeData,
      templateId: this.selectedTemplateId,
      savedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    localStorage.setItem(templateId, JSON.stringify(myTemplate));
    alert('Resume saved to My Templates!');
  }

  async loadExistingResume(resumeId: string) {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    
    const { data, error } = await supabase
      .from('user_resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
    
    if (data && !error) {
      this.currentResumeId = data.id;
      this.selectedTemplateId = data.template_id;
      this.resumeData = data.resume_data;
      this.profilePhoto = this.resumeData.photo || null;
      this.loadTemplate();
    }
  }

  goBackToTemplates(): void {
    this.router.navigate(['/templates']);
  }
}