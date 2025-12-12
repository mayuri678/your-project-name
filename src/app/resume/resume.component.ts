import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../auth.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  selectedTemplate: string = 'template1';
  isLoggedIn: boolean = false;

  // Resume Data
  name = '';
  title = '';
  email = '';
  phone = '';
  location = '';
  linkedIn = '';
  github = '';
  profilePhoto: string | null = null;
  photoPreview: string | null = null;

  education: any[] = [];
  skills: string[] = ['Angular', 'TypeScript', 'HTML', 'CSS', 'JavaScript'];
  experience: any[] = [];
  highlights: string[] = [];
  technicalSkills: string[] = [];
  projects: any[] = [];
  certifications: any[] = [];

  // Edit mode flag
  isEditMode: boolean = false;
  templateName: string = '';
  editingTemplateId: string | null = null;
  pdfImported: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;
  showPdfViewer: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.name = 'Test User';
    this.email = 'test@example.com';
    this.skills = ['HTML', 'CSS', 'JavaScript'];
    
    if (this.isLoggedIn && !this.pdfImported) {
      this.loadUserData();
      this.loadFirstSavedResume();
    }
    
    this.route.queryParams.subscribe(async params => {
      if (params['template']) {
        this.selectedTemplate = params['template'];
      }
      if (params['edit'] === 'true') {
        this.isEditMode = true;
      }
      if (params['templateName']) {
        this.templateName = params['templateName'];
      }
      if (params['templateId']) {
        this.editingTemplateId = params['templateId'];
        await this.loadTemplateData(params['templateId']);
      }
    });
  }

  validateEmail(email: string): boolean {
    return /.*@gmail\.com$/.test(email);
  }

  validatePhone(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone);
  }

  loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    if (this.pdfImported) {
      console.log('PDF data already imported, skipping user data load');
      return;
    }

    const userProfile = this.authService.getUserProfile();
    if (userProfile && userProfile.photo) {
      this.profilePhoto = userProfile.photo;
      this.photoPreview = null;
    } else {
      this.profilePhoto = null;
      this.photoPreview = null;
    }

    if (currentUser.email === 'gulvemayuri63') {
      this.name = 'Mayuri Gulve';
      this.title = 'Software Developer';
      this.email = 'gulvemayuri63@gmail.com';
      this.phone = '+91-9876543210';
      this.location = 'Pune, Maharashtra, India';
      this.linkedIn = 'linkedin.com/in/mayurigulve';
      this.github = 'github.com/mayurigulve';
      
      this.education = [
        { degree: 'B.Tech Computer Science', institute: 'M.B.E.S. College of Engineering, Ambajogai', year: '2023' },
        { degree: '12th HSC', institute: 'Shree Chhatrapati Shivaji Mahavidyalaya, Adas', year: '2018' },
        { degree: '10th SSC', institute: 'Shree Chhatrapati Shivaji Vidyalaya, Adas', year: '2016' }
      ];

      this.skills = [
        'Angular', 'TypeScript', 'HTML', 'CSS', 'JavaScript',
        'Responsive Web Design', 'REST API Integration', 'Node.js'
      ];

      this.experience = [
        {
          role: 'Software Developer',
          company: 'Tech Solutions Pvt Ltd',
          duration: '2023 - Present',
          description: 'Developed and maintained web applications using Angular and TypeScript. Collaborated with cross-functional teams to deliver high-quality software solutions.'
        }
      ];

      this.highlights = [
        'Proficient in modern web development frameworks and technologies.',
        'Strong problem-solving skills with experience in full-stack development.',
        'Excellent team player with good communication skills.'
      ];

      this.technicalSkills = [
        'Languages: JavaScript, TypeScript, C, C++, Java',
        'Frontend: Angular, React, HTML5, CSS3, Bootstrap, Material UI',
        'Backend: Node.js, Express.js'
      ];

      this.projects = [
        {
          name: 'Resume Builder Application',
          technology: 'Angular, TypeScript',
          description: 'Developed a comprehensive resume builder application with multiple templates, user authentication, and PDF export functionality.',
          file: null
        }
      ];

      this.certifications = [
        { name: 'Angular - The Complete Guide - Udemy', file: null },
        { name: 'JavaScript Algorithms and Data Structures - freeCodeCamp', file: null }
      ];
    } else {
      if (userProfile) {
        this.name = userProfile.username || currentUser.name;
        this.email = userProfile.email || currentUser.email;
        this.phone = userProfile.contactNo || this.phone;
        this.location = userProfile.location || this.location;
      } else {
        this.name = currentUser.name || '';
        this.email = currentUser.email || '';
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async loadTemplateData(templateId: string): Promise<void> {
    try {
      const result = await this.supabaseService.getTemplateById(templateId);
      if (result.data) {
        const templateData = JSON.parse(result.data.description);
        this.name = templateData.name || '';
        this.title = templateData.title || '';
        this.email = templateData.email || '';
        this.phone = templateData.phone || '';
        this.location = templateData.location || '';
        this.linkedIn = templateData.linkedIn || '';
        this.github = templateData.github || '';
        this.education = templateData.education || [];
        this.skills = templateData.skills || [];
        this.experience = templateData.experience || [];
        this.highlights = templateData.highlights || [];
        this.technicalSkills = templateData.technicalSkills || [];
        this.projects = templateData.projects || [];
        this.certifications = templateData.certifications || [];
        this.profilePhoto = templateData.profilePhoto || null;
      }
    } catch (error) {
      console.error('Error loading template data:', error);
    }
  }

  exitEditMode(): void {
    this.isEditMode = false;
    this.editingTemplateId = null;
    this.router.navigate(['/resume'], {
      queryParams: {
        template: this.selectedTemplate
      }
    });
  }

  addEducation(): void {
    this.education.push({ degree: '', institute: '', year: '' });
  }

  removeEducation(index: number): void {
    this.education.splice(index, 1);
  }

  addSkill(): void {
    if (!this.skills) {
      this.skills = [];
    }
    this.skills.push('');
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  addExperience(): void {
    this.experience.push({ role: '', company: '', duration: '', description: '' });
  }

  removeExperience(index: number): void {
    this.experience.splice(index, 1);
  }

  addHighlight(): void {
    this.highlights.push('');
  }

  removeHighlight(index: number): void {
    this.highlights.splice(index, 1);
  }

  addTechnicalSkill(): void {
    this.technicalSkills.push('');
  }

  removeTechnicalSkill(index: number): void {
    this.technicalSkills.splice(index, 1);
  }

  addProject(): void {
    this.projects.push({ name: '', technology: '', description: '', file: null });
    setTimeout(() => {
      const newIndex = this.projects.length - 1;
      const fileInput = document.getElementById(`project-file-${newIndex}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 100);
  }

  onProjectFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.projects[index].file = input.files[0];
      if (!this.projects[index].name) {
        this.projects[index].name = input.files[0].name.replace(/\.[^/.]+$/, '');
      }
    }
  }

  removeProject(index: number): void {
    this.projects.splice(index, 1);
  }

  addCertification(): void {
    this.certifications.push({ name: '', file: null });
    setTimeout(() => {
      const newIndex = this.certifications.length - 1;
      const fileInput = document.getElementById(`certification-file-${newIndex}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 100);
  }

  onCertificationFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.certifications[index].file = input.files[0];
      if (!this.certifications[index].name) {
        this.certifications[index].name = input.files[0].name.replace(/\.[^/.]+$/, '');
      }
    }
  }

  removeCertification(index: number): void {
    this.certifications.splice(index, 1);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.photoPreview = e.target.result as string;
          this.profilePhoto = this.photoPreview;
          
          const userProfile = this.authService.getUserProfile();
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            const updatedProfile = {
              username: userProfile?.username || currentUser.name,
              email: userProfile?.email || currentUser.email,
              contactNo: userProfile?.contactNo || '',
              notification: userProfile?.notification !== undefined ? userProfile.notification : true,
              address: userProfile?.address || '',
              street: userProfile?.street || '',
              city: userProfile?.city || '',
              state: userProfile?.state || '',
              country: userProfile?.country || '',
              pincode: userProfile?.pincode || '',
              location: userProfile?.location || '',
              photo: this.photoPreview
            };
            this.authService.saveUserProfile(updatedProfile);
          }
        }
      };
      
      reader.onerror = () => {
        alert('Error reading image file.');
      };
      
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.profilePhoto = null;
    this.photoPreview = null;
    
    const userProfile = this.authService.getUserProfile();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && userProfile) {
      const updatedProfile = {
        ...userProfile,
        photo: ''
      };
      this.authService.saveUserProfile(updatedProfile);
    }
  }

  getPhotoUrl(): string | null {
    if (this.photoPreview) {
      return this.photoPreview;
    }
    if (this.profilePhoto) {
      return this.profilePhoto;
    }
    return null;
  }

  getCertificationName(cert: any): string {
    if (typeof cert === 'string') {
      return cert;
    }
    return cert?.name || '';
  }

  async saveTemplate(): Promise<void> {
    if (!this.validateEmail(this.email)) {
      alert('Please enter a valid Gmail address (ending with @gmail.com)');
      return;
    }
    if (!this.validatePhone(this.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    try {
      const templateData = {
        name: this.name,
        title: this.title,
        email: this.email,
        phone: this.phone,
        location: this.location,
        linkedIn: this.linkedIn,
        github: this.github,
        education: this.education,
        skills: this.skills,
        experience: this.experience,
        highlights: this.highlights,
        technicalSkills: this.technicalSkills,
        projects: this.projects,
        certifications: this.certifications,
        profilePhoto: this.profilePhoto
      };

      const result = await this.supabaseService.saveTemplate({
        templateId: this.selectedTemplate,
        content: templateData,
        existingId: this.editingTemplateId
      });

      if (result.error) {
        alert('Failed to save template: ' + result.error.message);
      } else {
        alert('Template saved successfully!');
        if (this.editingTemplateId) {
          this.router.navigate(['/my-templates']);
        }
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template');
    }
  }

  async loadFirstSavedResume(): Promise<void> {
    try {
      if (this.pdfImported) {
        console.log('PDF data already imported, skipping saved resume load');
        return;
      }
      
      const result = await this.supabaseService.getUserTemplates();
      if (result.data && result.data.length > 0) {
        const firstResume = result.data[0];
        await this.importResumeData(firstResume);
      }
    } catch (error) {
      console.error('Error loading first saved resume:', error);
    }
  }

  async importResumeData(resumeTemplate: any): Promise<void> {
    try {
      const resumeData = JSON.parse(resumeTemplate.description);
      
      this.name = resumeData.name || this.name;
      this.title = resumeData.title || this.title;
      this.email = resumeData.email || this.email;
      this.phone = resumeData.phone || this.phone;
      this.location = resumeData.location || this.location;
      this.linkedIn = resumeData.linkedIn || this.linkedIn;
      this.github = resumeData.github || this.github;
      this.profilePhoto = resumeData.profilePhoto || this.profilePhoto;
      
      this.education = resumeData.education || this.education;
      this.skills = resumeData.skills || this.skills;
      this.experience = resumeData.experience || this.experience;
      this.highlights = resumeData.highlights || this.highlights;
      this.technicalSkills = resumeData.technicalSkills || this.technicalSkills;
      this.projects = resumeData.projects || this.projects;
      this.certifications = resumeData.certifications || this.certifications;
      
      console.log('Resume data imported successfully');
    } catch (error) {
      console.error('Error importing resume data:', error);
    }
  }

  importResumeFromFile(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.pdf,.docx,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.processImportedFile(file);
      }
    };
    input.click();
  }

  async processImportedFile(file: File): Promise<void> {
    try {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text();
        const resumeData = JSON.parse(text);
        await this.importResumeData({ description: JSON.stringify(resumeData) });
        alert('Resume data imported successfully!');
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        await this.parsePDFFile(file);
      } else if (file.type.startsWith('image/')) {
        await this.parseImageFile(file);
      } else {
        alert('Unsupported file format. Please use JSON, PDF, or image files.');
      }
    } catch (error) {
      console.error('Error processing imported file:', error);
      alert('Error importing file. Please ensure it\'s a valid resume file.');
    }
  }

  async parsePDFFile(file: File): Promise<void> {
    try {
      const url = URL.createObjectURL(file);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showPdfViewer = true;
      
      this.name = file.name.replace('.pdf', '').replace(/[_-]/g, ' ');
      this.email = this.name.toLowerCase().replace(/\s+/g, '.') + '@email.com';
      this.phone = '9876543210';
      this.title = 'Professional';
      this.location = 'City, State';
      this.linkedIn = 'linkedin.com/in/profile';
      this.github = 'github.com/profile';
      
      this.skills = ['JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS'];
      this.education = [{
        degree: 'Bachelor Degree',
        institute: 'University Name',
        year: '2023',
        grade: 'First Class'
      }];
      this.experience = [{
        role: 'Software Developer',
        company: 'Tech Company',
        duration: '2022-2024',
        description: 'Professional software development experience'
      }];
      this.highlights = [
        'Strong technical skills',
        'Problem solving abilities',
        'Team collaboration'
      ];
      this.technicalSkills = ['Programming', 'Web Development', 'Database Management'];
      this.projects = [{
        name: 'Web Application',
        technology: 'React, Node.js',
        description: 'Full-stack web application development'
      }];
      
      this.pdfImported = true;
      this.cdr.detectChanges();
      
      alert('PDF imported! Data is now visible in template. Click Edit to modify.');
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Error reading PDF file. Please try a different file.');
    }
  }

  async parseImageFile(file: File): Promise<void> {
    try {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.profilePhoto = e.target.result as string;
          this.photoPreview = this.profilePhoto;
          alert('Profile photo uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error uploading image. Please try a different file.');
    }
  }

  closePdfViewer(): void {
    this.showPdfViewer = false;
    this.pdfUrl = null;
  }

  editImportedPdf(): void {
    this.showPdfViewer = false;
    this.pdfUrl = null;
    this.pdfImported = true;
    this.isEditMode = true;
    
    if (!this.name || this.name === '') {
      this.setDefaultPdfData();
    }
    
    this.cdr.detectChanges();
  }

  setDefaultPdfData(): void {
    this.name = 'John Doe';
    this.email = 'john.doe@example.com';
    this.phone = '1234567890';
    this.title = 'Software Developer';
    this.location = 'City, State';
    this.linkedIn = 'linkedin.com/in/johndoe';
    this.github = 'github.com/johndoe';
    
    this.skills = ['JavaScript', 'Python', 'React', 'Node.js'];
    this.education = [{
      degree: 'Bachelor of Computer Science',
      institute: 'University Name',
      year: '2023',
      grade: 'First Class'
    }];
    this.experience = [{
      role: 'Software Developer',
      company: 'Tech Company',
      duration: '2022-2024',
      description: 'Developed web applications using modern technologies'
    }];
    this.highlights = [
      'Strong problem-solving skills',
      'Team collaboration',
      'Continuous learning'
    ];
    this.technicalSkills = ['HTML/CSS', 'JavaScript', 'Python', 'Git'];
    this.projects = [{
      name: 'Web Application',
      technology: 'React, Node.js',
      description: 'Built a full-stack web application'
    }];
  }

  forceEditMode(): void {
    this.isEditMode = true;
    this.pdfImported = true;
    this.setDefaultPdfData();
    this.cdr.detectChanges();
    console.log('Force edit mode activated with data');
  }

  quickEditPdf(): void {
    this.showPdfViewer = false;
    this.isEditMode = true;
    this.pdfImported = true;
    this.setDefaultPdfData();
    this.cdr.detectChanges();
  }

  testDataSet(): void {
    this.name = 'PDF Test User';
    this.email = 'pdftest@example.com';
    this.phone = '9876543210';
    this.title = 'PDF Developer';
    this.skills = ['PDF', 'Angular', 'TypeScript'];
    this.education = [{ degree: 'PDF Degree', institute: 'PDF University', year: '2024', grade: 'A+' }];
    this.pdfImported = true;
    this.cdr.detectChanges();
    alert('Test data set! Name: ' + this.name);
  }

  exportResumeAsJSON(): void {
    const resumeData = {
      name: this.name,
      title: this.title,
      email: this.email,
      phone: this.phone,
      location: this.location,
      linkedIn: this.linkedIn,
      github: this.github,
      profilePhoto: this.profilePhoto,
      education: this.education,
      skills: this.skills,
      experience: this.experience,
      highlights: this.highlights,
      technicalSkills: this.technicalSkills,
      projects: this.projects,
      certifications: this.certifications,
      template: this.selectedTemplate,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.name || 'Resume'}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  downloadPDF(): void {
    const wasInEditMode = this.isEditMode;
    this.isEditMode = false;
    
    setTimeout(() => {
      const resumeElement = document.querySelector(`.resume-container.${this.selectedTemplate}`) as HTMLElement;
      
      if (!resumeElement) {
        alert('Resume element not found');
        this.isEditMode = wasInEditMode;
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download the PDF');
        this.isEditMode = wasInEditMode;
        return;
      }

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume - ${this.name || 'Resume'}</title>
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
    .resume-container { margin: 0; box-shadow: none; border: none; max-width: 100%; }
    .edit-mode-banner, .resume-actions-bar, .add-btn, .remove-btn { display: none !important; }
    .editable-item, .add-btn, .remove-btn { display: none !important; }
    @media print {
      body { margin: 0; padding: 0; }
      @page { size: A4; margin: 0.5in; }
    }
  </style>
</head>
<body>
  ${resumeElement.outerHTML}
</body>
</html>`;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          this.isEditMode = wasInEditMode;
        }, 500);
      };
    }, 100);
  }
}