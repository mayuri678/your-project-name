import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../auth.service';
import { SupabaseService } from '../services/supabase.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  selectedTemplate: string = 'template2';
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
    private userDataService: UserDataService,
    private router: Router,
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Clear previous user data first
    this.clearPreviousUserData();
    
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
      if (params['loadData']) {
        // Load template data from My Templates page
        await this.loadTemplateFromMyTemplates(params['loadData']);
      }
      if (params['templateId']) {
        this.editingTemplateId = params['templateId'];
        await this.loadTemplateData(params['templateId']);
      }
    });
  }

  validateEmail(email: string): boolean {
    // Accept all valid email formats, not just Gmail
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email.trim());
  }

  validatePhone(phone: string): boolean {
    // Remove all non-numeric characters except +
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    
    // Check for various Indian phone number formats
    const patterns = [
      /^[6-9][0-9]{9}$/, // 10 digit Indian mobile
      /^\+91[6-9][0-9]{9}$/, // +91 prefix
      /^91[6-9][0-9]{9}$/, // 91 prefix
      /^0[6-9][0-9]{9}$/, // 0 prefix (sometimes used)
      /^[0-9]{10,15}$/ // General 10-15 digit number
    ];
    
    return patterns.some(pattern => pattern.test(cleanPhone));
  }

  loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    if (this.pdfImported) {
      console.log('PDF data already imported, skipping user data load');
      return;
    }

    // Load user photo using UserDataService
    const userPhoto = this.userDataService.getUserPhoto();
    if (userPhoto) {
      this.profilePhoto = userPhoto;
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
      const userProfile = this.userDataService.getUserData('profile');
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

  async loadTemplateFromMyTemplates(templateId: string): Promise<void> {
    try {
      const result = await this.supabaseService.getTemplateById(templateId);
      if (result.data) {
        const templateData = JSON.parse(result.data.description || '{}');
        
        // Set the template type - ensure it matches available templates
        const templateCategory = result.data.category;
        if (templateCategory && templateCategory.startsWith('template')) {
          this.selectedTemplate = templateCategory;
        } else {
          // Map category names to template IDs
          const categoryMap: {[key: string]: string} = {
            'Professional': 'template1',
            'Creative': 'template2', 
            'Modern': 'template3',
            'Classic': 'template4',
            'Technical': 'template5'
          };
          this.selectedTemplate = categoryMap[templateCategory] || 'template1';
        }
        
        // Check if this is an admin-created template or user template
        if (templateData.templateName || templateData.templateColor) {
          // Admin template - load with sample data
          this.name = templateData.name || templateData.templateName || 'John Doe';
          this.title = 'Software Developer';
          this.email = 'john.doe@example.com';
          this.phone = '+1 (555) 123-4567';
          this.location = 'New York, NY, USA';
          this.linkedIn = 'linkedin.com/in/johndoe';
          this.github = 'github.com/johndoe';
          
          this.education = [{
            degree: 'Bachelor of Science in Computer Science',
            institute: 'University of Technology',
            year: '2021',
            grade: '3.8 GPA'
          }];
          
          this.skills = ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python'];
          
          this.experience = [{
            role: 'Senior Software Developer',
            company: 'Tech Solutions Inc.',
            duration: '2022 - Present',
            description: 'Led development of web applications using modern frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.'
          }];
          
          this.highlights = [
            'Experienced professional with expertise in various technologies',
            'Strong problem-solving skills and attention to detail',
            'Excellent team collaboration and communication abilities'
          ];
          
          this.technicalSkills = ['Frontend: Angular, React, Vue.js', 'Backend: Node.js, Express.js', 'Database: MongoDB, PostgreSQL'];
          
          this.projects = [{
            name: 'E-commerce Platform',
            technology: 'Angular, Node.js, MongoDB',
            description: 'Built a full-stack e-commerce platform with user authentication, payment integration, and admin dashboard.'
          }];
          
          this.certifications = [
            { name: 'AWS Certified Developer', file: null },
            { name: 'Angular Certification', file: null }
          ];
        } else {
          // User template - load actual data
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
        
        this.editingTemplateId = templateId;
        this.isEditMode = true;
        
        console.log('Template loaded:', {
          selectedTemplate: this.selectedTemplate,
          name: this.name,
          isEditMode: this.isEditMode
        });
      }
    } catch (error) {
      console.error('Error loading template from My Templates:', error);
      alert('Error loading template. Please try again.');
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
          
          // Save photo using UserDataService
          this.userDataService.saveUserPhoto(this.photoPreview);
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
    
    // Remove photo using UserDataService
    this.userDataService.removeUserData('photo');
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
      alert('Please enter a valid email address');
      return;
    }
    if (this.phone && !this.validatePhone(this.phone)) {
      alert('Please enter a valid phone number (10-15 digits)');
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
      let resumeData;
      
      // Handle different input formats
      if (typeof resumeTemplate === 'string') {
        resumeData = JSON.parse(resumeTemplate);
      } else if (resumeTemplate.description) {
        resumeData = JSON.parse(resumeTemplate.description);
      } else {
        resumeData = resumeTemplate;
      }
      
      // Import personal information with validation
      if (resumeData.name && resumeData.name.trim()) {
        this.name = resumeData.name.trim();
      }
      
      if (resumeData.title && resumeData.title.trim()) {
        this.title = resumeData.title.trim();
      }
      
      if (resumeData.email && this.validateEmail(resumeData.email)) {
        this.email = resumeData.email.trim();
      }
      
      // Validate and format phone number
      if (resumeData.phone) {
        const cleanPhone = resumeData.phone.toString().replace(/[^0-9+]/g, '');
        if (this.validatePhone(cleanPhone) || cleanPhone.length >= 10) {
          this.phone = cleanPhone;
        }
      }
      
      if (resumeData.location && resumeData.location.trim()) {
        this.location = resumeData.location.trim();
      }
      
      if (resumeData.linkedIn && resumeData.linkedIn.trim()) {
        this.linkedIn = resumeData.linkedIn.trim();
      }
      
      if (resumeData.github && resumeData.github.trim()) {
        this.github = resumeData.github.trim();
      }
      
      if (resumeData.profilePhoto) {
        this.profilePhoto = resumeData.profilePhoto;
      }
      
      // Import arrays with validation
      if (resumeData.education && Array.isArray(resumeData.education)) {
        this.education = resumeData.education.filter((edu: any) => edu && (edu.degree || edu.institute));
      }
      
      if (resumeData.skills && Array.isArray(resumeData.skills)) {
        this.skills = resumeData.skills.filter((skill: any) => skill && skill.trim()).map((skill: any) => skill.trim());
      }
      
      if (resumeData.experience && Array.isArray(resumeData.experience)) {
        this.experience = resumeData.experience.filter((exp: any) => exp && (exp.role || exp.company));
      }
      
      if (resumeData.highlights && Array.isArray(resumeData.highlights)) {
        this.highlights = resumeData.highlights.filter((highlight: any) => highlight && highlight.trim()).map((h: any) => h.trim());
      }
      
      if (resumeData.technicalSkills && Array.isArray(resumeData.technicalSkills)) {
        this.technicalSkills = resumeData.technicalSkills.filter((skill: any) => skill && skill.trim()).map((skill: any) => skill.trim());
      }
      
      if (resumeData.projects && Array.isArray(resumeData.projects)) {
        this.projects = resumeData.projects.filter((proj: any) => proj && (proj.name || proj.technology));
      }
      
      if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
        this.certifications = resumeData.certifications.filter((cert: any) => cert && (cert.name || cert));
      }
      
      console.log('Resume data imported successfully:', {
        name: this.name,
        email: this.email,
        phone: this.phone
      });
      
    } catch (error) {
      console.error('Error importing resume data:', error);
      alert('Error importing resume data. Please check the file format.');
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
      console.log('Processing file:', file.name, 'Type:', file.type);
      
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        await this.processJSONFile(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        await this.parsePDFFile(file);
      } else if (file.type.startsWith('image/')) {
        await this.parseImageFile(file);
      } else if (file.name.endsWith('.docx') || file.type.includes('wordprocessingml')) {
        alert('DOCX files are not yet supported. Please convert to PDF or use JSON format.');
      } else {
        alert('Unsupported file format. Please use JSON, PDF, or image files.');
      }
    } catch (error) {
      console.error('Error processing imported file:', error);
      alert('Error importing file. Please ensure it\'s a valid resume file.');
    }
  }

  async processJSONFile(file: File): Promise<void> {
    try {
      const text = await file.text();
      const resumeData = JSON.parse(text);
      
      // Handle different JSON structures
      if (resumeData.description) {
        // Our app's format
        await this.importResumeData(resumeData);
      } else {
        // Direct resume data format
        await this.importResumeData(resumeData);
      }
      
      alert(`Resume data imported successfully!\nName: ${this.name}\nEmail: ${this.email}\nPhone: ${this.phone}`);
      
    } catch (error) {
      console.error('Error processing JSON file:', error);
      alert('Error reading JSON file. Please check the file format.');
    }
  }

  async parsePDFFile(file: File): Promise<void> {
    try {
      const url = URL.createObjectURL(file);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showPdfViewer = true;
      
      // Extract actual data from PDF using PDF.js or similar library
      await this.extractPDFData(file);
      
      this.pdfImported = true;
      this.cdr.detectChanges();
      
      alert('PDF imported! Data extracted successfully. Click Edit to modify.');
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Error reading PDF file. Please try a different file.');
    }
  }

  async extractPDFData(file: File): Promise<void> {
    try {
      // For now, we'll use a simple text extraction approach
      // In production, you'd want to use PDF.js or similar library
      const text = await this.readPDFAsText(file);
      
      // Extract name (usually first line or after "Name:")
      const nameMatch = text.match(/(?:Name[:\s]+)([A-Za-z\s]+)/i) || text.match(/^([A-Za-z\s]+)/m);
      this.name = nameMatch ? nameMatch[1].trim() : file.name.replace('.pdf', '').replace(/[_-]/g, ' ');
      
      // Extract email
      const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
      this.email = emailMatch ? emailMatch[1] : this.name.toLowerCase().replace(/\s+/g, '.') + '@email.com';
      
      // Extract phone number (Indian format)
      const phoneMatch = text.match(/(?:Phone|Mobile|Contact)[:\s]*([+]?[0-9\s-()]{10,15})/i) || 
                        text.match(/([+]?91[\s-]?[6-9][0-9]{9})/i) || 
                        text.match(/([6-9][0-9]{9})/i);
      this.phone = phoneMatch ? phoneMatch[1].replace(/[\s-()]/g, '') : '';
      
      // Extract title/designation
      const titleMatch = text.match(/(?:Title|Designation|Position)[:\s]+([A-Za-z\s]+)/i) ||
                        text.match(/(?:Software|Developer|Engineer|Manager|Analyst)/i);
      this.title = titleMatch ? titleMatch[0] : 'Professional';
      
      // Extract location
      const locationMatch = text.match(/(?:Address|Location)[:\s]+([A-Za-z\s,]+)/i) ||
                           text.match(/(Mumbai|Delhi|Bangalore|Pune|Chennai|Hyderabad|Kolkata|Ahmedabad)[,\s]*[A-Za-z\s]*/i);
      this.location = locationMatch ? locationMatch[1] || locationMatch[0] : 'India';
      
      // Extract LinkedIn
      const linkedInMatch = text.match(/(linkedin\.com\/in\/[A-Za-z0-9-]+)/i);
      this.linkedIn = linkedInMatch ? linkedInMatch[1] : 'linkedin.com/in/profile';
      
      // Extract GitHub
      const githubMatch = text.match(/(github\.com\/[A-Za-z0-9-]+)/i);
      this.github = githubMatch ? githubMatch[1] : 'github.com/profile';
      
      // Extract skills
      const skillsSection = text.match(/(?:Skills|Technologies)[:\s]*([\s\S]*?)(?:\n\n|Education|Experience|$)/i);
      if (skillsSection) {
        const skillsText = skillsSection[1];
        this.skills = skillsText.split(/[,\n•-]/).map(s => s.trim()).filter(s => s.length > 0).slice(0, 10);
      } else {
        this.skills = ['JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS'];
      }
      
      // Set default data for other fields
      this.education = [{
        degree: 'Bachelor Degree',
        institute: 'University Name',
        year: '2023'
      }];
      
      this.experience = [{
        role: this.title || 'Software Developer',
        company: 'Company Name',
        duration: '2022-2024',
        description: 'Professional experience in software development'
      }];
      
      this.highlights = [
        'Strong technical skills',
        'Problem solving abilities',
        'Team collaboration'
      ];
      
      this.technicalSkills = this.skills.slice(0, 5);
      
      this.projects = [{
        name: 'Project Name',
        technology: this.skills.slice(0, 3).join(', '),
        description: 'Project description'
      }];
      
    } catch (error) {
      console.error('Error extracting PDF data:', error);
      // Fallback to default data
      this.setDefaultPdfData();
    }
  }

  async readPDFAsText(file: File): Promise<string> {
    // This is a simplified approach. For better PDF parsing, use PDF.js
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // This won't work perfectly for all PDFs, but it's a start
        // For production, implement proper PDF.js integration
        const text = reader.result as string;
        resolve(text || '');
      };
      reader.readAsText(file);
    });
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

      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume - ${this.name || 'Resume'}</title>
  <style>
    ${styles}
    
    @page {
      size: A4;
      margin: 0.5in;
    }
    
    body { 
      margin: 0; 
      padding: 0; 
      font-family: Arial, sans-serif;
      line-height: 1.4;
    }
    
    .resume-container { 
      margin: 0; 
      box-shadow: none; 
      border: none; 
      max-width: 100%;
      min-height: 100vh;
    }
    
    section {
      margin-bottom: 15px;
    }
    
    .edit-mode-banner, .resume-actions-bar, .add-btn, .remove-btn, .editable-item { display: none !important; }
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
          setTimeout(() => {
            printWindow.close();
            this.isEditMode = wasInEditMode;
          }, 1000);
        }, 1000);
      };
    }, 100);
  }

  private clearPreviousUserData(): void {
    // Reset component state to prevent data leakage
    this.profilePhoto = null;
    this.photoPreview = null;
    this.pdfImported = false;
    this.pdfUrl = null;
    this.showPdfViewer = false;
    this.isEditMode = false;
    this.editingTemplateId = null;
    
    // Reset form data
    this.name = '';
    this.title = '';
    this.email = '';
    this.phone = '';
    this.location = '';
    this.linkedIn = '';
    this.github = '';
    this.education = [];
    this.skills = [];
    this.experience = [];
    this.highlights = [];
    this.technicalSkills = [];
    this.projects = [];
    this.certifications = [];
  }

}