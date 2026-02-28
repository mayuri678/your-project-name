import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, Type, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateRegistryService } from '../resume-templates/template-registry.service';
import { ResumeData } from '../resume-templates/models/resume-data.interface';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  
  resumeData: ResumeData = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
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
    this.route.queryParams.subscribe(params => {
      this.selectedTemplateId = +params['templateId'] || 1;
      console.log('Selected template:', this.selectedTemplateId);
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
      console.error('Template container not found');
      return;
    }
    
    this.templateContainer.clear();
    const template = this.templateRegistry.getTemplateById(this.selectedTemplateId);
    
    if (template) {
      console.log('Loading template:', template.name);
      this.templateComponent = this.templateContainer.createComponent(template.component);
      this.templateComponent.instance.data = this.resumeData;
      this.templateComponent.changeDetectorRef.detectChanges();
    } else {
      console.error('Template not found:', this.selectedTemplateId);
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

  saveResume() {
    localStorage.setItem('currentResumeData', JSON.stringify(this.resumeData));
    alert('Resume saved successfully!');
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
}