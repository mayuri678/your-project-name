import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit, OnDestroy {
  selectedTemplate = 'template1';
  showTemplateSelection = false;
  appliedTemplate: string | null = null;

  // Template properties for filtering
  templates = [
    // Blue templates
    { id: 'template1', name: 'Classic Blue', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'blue', recommended: false },
    { id: 'template8', name: 'Tech Modern', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'blue', recommended: false },
    { id: 'template13', name: 'Ocean Blue', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'blue', recommended: true },
    { id: 'template14', name: 'Sky Blue', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'blue', recommended: false },

    // Green templates
    { id: 'template2', name: 'Modern Sidebar', hasHeadshot: true, hasGraphics: false, columns: 2, color: 'green', recommended: true },
    { id: 'template10', name: 'Startup Green', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'green', recommended: true },
    { id: 'template15', name: 'Forest Green', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'green', recommended: false },
    { id: 'template16', name: 'Mint Green', hasHeadshot: false, hasGraphics: true, columns: 1, color: 'green', recommended: false },

    // Purple templates
    { id: 'template3', name: 'Header Style', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'purple', recommended: false },
    { id: 'template12', name: 'Artistic Purple', hasHeadshot: true, hasGraphics: true, columns: 1, color: 'purple', recommended: false },
    { id: 'template17', name: 'Royal Purple', hasHeadshot: true, hasGraphics: false, columns: 2, color: 'purple', recommended: true },
    { id: 'template18', name: 'Lavender', hasHeadshot: false, hasGraphics: true, columns: 1, color: 'purple', recommended: false },

    // Black templates
    { id: 'template4', name: 'Minimal Black', hasHeadshot: false, hasGraphics: false, columns: 1, color: 'black', recommended: false },
    { id: 'template19', name: 'Elegant Black', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'black', recommended: true },
    { id: 'template20', name: 'Modern Black', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'black', recommended: false },

    // Navy templates
    { id: 'template5', name: 'Professional Navy', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'navy', recommended: false },
    { id: 'template11', name: 'Corporate Navy', hasHeadshot: false, hasGraphics: false, columns: 1, color: 'navy', recommended: false },
    { id: 'template21', name: 'Executive Navy', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'navy', recommended: true },
    { id: 'template22', name: 'Business Navy', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'navy', recommended: false },

    // Orange templates
    { id: 'template6', name: 'Creative Orange', hasHeadshot: true, hasGraphics: true, columns: 1, color: 'orange', recommended: false },
    { id: 'template23', name: 'Sunset Orange', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'orange', recommended: true },
    { id: 'template24', name: 'Vibrant Orange', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'orange', recommended: false },

    // Gray templates
    { id: 'template7', name: 'Executive Gray', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'gray', recommended: true },
    { id: 'template25', name: 'Professional Gray', hasHeadshot: false, hasGraphics: false, columns: 1, color: 'gray', recommended: false },
    { id: 'template26', name: 'Modern Gray', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'gray', recommended: false },

    // Dark Blue templates
    { id: 'template9', name: 'Academic Dark Blue', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'darkblue', recommended: false },
    { id: 'template27', name: 'Deep Blue', hasHeadshot: true, hasGraphics: false, columns: 2, color: 'darkblue', recommended: true },
    { id: 'template28', name: 'Midnight Blue', hasHeadshot: false, hasGraphics: true, columns: 1, color: 'darkblue', recommended: false }
  ];

  // Filter options
  filterOptions = {
    headshot: 'all', // all, with, without
    graphics: 'all', // all, with, without
    columns: 'all', // all, 1, 2
    color: 'all' // all, blue, green, purple, black, navy, orange
  };

  filteredTemplates = [...this.templates];
  activeFilters: string[] = [];

  // Resume data properties
  name = 'Mayuri Shete';
  title = 'Frontend Developer';
  email = 'mayuri.shete@example.com';
  phone = '+91-9876543210';
  location = 'Pune, Maharashtra, India';
  linkedIn = 'linkedin.com/in/mayurishete';
  github = 'github.com/mayurishete';

  education = [
    { degree: 'B.Tech Computer Science', institute: 'M.B.E.S. College of Engineering, Ambajogai', year: '2023' },
    { degree: '12th HSC', institute: 'Shree Chhatrapati Shivaji Mahavidyalaya, Adas', year: '2018' },
    { degree: '10th SSC', institute: 'Shree Chhatrapati Shivaji Vidyalaya, Adas', year: '2016' }
  ];

  skills = ['Angular', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Responsive Web Design', 'REST API Integration'];

  experience = [
    { role: 'Frontend Developer', company: 'Tech Company', duration: '2021 - Present', description: 'Developed scalable web applications using Angular and TypeScript, improved UI/UX, optimized performance, and collaborated with backend teams.' },
    { role: 'Intern - Web Developer', company: 'Startup Solutions', duration: '2020 - 2021', description: 'Built responsive landing pages, assisted in API integration, and contributed to website redesign projects.' }
  ];

  highlights = [
    'Proficient in front-end web development with Angular.',
    'Strong understanding of responsive design and cross-browser compatibility.',
    'Experience in application development using C, C++ (Basic).',
    'Quick learner and passionate about building user-friendly applications.',
    'Excellent communication and teamwork skills.'
  ];

  technicalSkills = [
    'Languages: C, C++, JavaScript, TypeScript',
    'Web Technologies: HTML, CSS, JavaScript, Angular, Bootstrap',
    'Version Control: Git, GitHub',
    'Tools: Visual Studio Code, Postman, Figma',
    'Concepts: OOPS, MVC Architecture, RESTful APIs'
  ];

  projects = [
    {
      name: 'Job Recommendation System Using Profile Matching',
      technology: 'JSP',
      description: 'System for campus recruitment helping placement offices match profiles with better precision using profile similarity and job site data crawling.'
    },
    {
      name: 'Portfolio Website',
      technology: 'Angular',
      description: 'Personal portfolio website showcasing projects, blogs, and achievements using Angular and responsive design.'
    },
    {
      name: 'E-commerce Admin Dashboard',
      technology: 'Angular, Chart.js',
      description: 'Developed a modern admin dashboard with user management, sales analytics, and order tracking.'
    }
  ];

  certifications = [
    'Certified Angular Developer - Udemy',
    'JavaScript Algorithms and Data Structures - freeCodeCamp',
    'Responsive Web Design - freeCodeCamp'
  ];

  private qpSub: any;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Ensure filters applied on load
    this.applyFilters();

    // Open via query param
    this.qpSub = this.route.queryParamMap.subscribe(params => {
      const open = params.get('openTemplates');
      const template = params.get('template');
      const category = params.get('category');
      
      if (open === 'true') {
        // reset filters and show all
        this.filterOptions = { headshot: 'all', graphics: 'all', columns: 'all', color: 'all' };
        this.applyFilters();
        this.showTemplateSelection = true;
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.removeItem('openTemplates');
        }
      }
      
      // Handle template selection from Resume Examples or Templates Table
      if (template) {
        this.appliedTemplate = template;
        this.showTemplateSelection = true;
        console.log('Applied template from Resume Examples/Templates:', template, 'Category:', category);
        
        // Try to find matching template in our list by ID first, then by name
        const matchingTemplate = this.templates.find(t => 
          t.id === template || 
          t.name.toLowerCase().includes(template.toLowerCase()) ||
          template.toLowerCase().includes(t.name.toLowerCase())
        );
        
        if (matchingTemplate) {
          this.selectedTemplate = matchingTemplate.id;
          console.log('Found matching template:', matchingTemplate.name, 'ID:', matchingTemplate.id);
        } else {
          console.log('Template not found, using default template1');
          this.selectedTemplate = 'template1';
        }
      }
      
      // Handle opening template selection modal from Templates Table
      if (params.get('openTemplates') === 'true' && params.get('fromTemplates') === 'true') {
        this.showTemplateSelection = true;
        console.log('Opening template selection modal from Templates Table');
      }
    });

    // Fallback: session flag set by header Templates click
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const wantOpen = sessionStorage.getItem('openTemplates');
      if (wantOpen === 'true') {
        sessionStorage.removeItem('openTemplates');
        this.filterOptions = { headshot: 'all', graphics: 'all', columns: 'all', color: 'all' };
        this.applyFilters();
        this.showTemplateSelection = true;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.qpSub) { this.qpSub.unsubscribe(); }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  selectTemplate(template: string) {
    this.selectedTemplate = template;
    this.showTemplateSelection = false;
    this.appliedTemplate = null; // Clear applied template after selection
  }

  toggleTemplateSelection() {
    if (!this.showTemplateSelection) {
      // opening: reset filters and show all
      this.filterOptions = { headshot: 'all', graphics: 'all', columns: 'all', color: 'all' };
      this.applyFilters();
    }
    this.showTemplateSelection = !this.showTemplateSelection;
  }

  applyFilters() {
    this.filteredTemplates = this.templates.filter(template => {
      let matches = true;

      if (this.filterOptions.headshot === 'with' && !template.hasHeadshot) matches = false;
      if (this.filterOptions.headshot === 'without' && template.hasHeadshot) matches = false;

      if (this.filterOptions.graphics === 'with' && !template.hasGraphics) matches = false;
      if (this.filterOptions.graphics === 'without' && template.hasGraphics) matches = false;

      if (this.filterOptions.columns !== 'all' && template.columns !== parseInt(this.filterOptions.columns)) matches = false;

      if (this.filterOptions.color !== 'all' && template.color !== this.filterOptions.color) matches = false;

      return matches;
    });

    this.updateActiveFilters();
  }

  updateActiveFilters() {
    this.activeFilters = [];
    if (this.filterOptions.headshot === 'with') this.activeFilters.push('With headshot');
    if (this.filterOptions.headshot === 'without') this.activeFilters.push('Without headshot');
    if (this.filterOptions.graphics === 'with') this.activeFilters.push('With graphics');
    if (this.filterOptions.graphics === 'without') this.activeFilters.push('Without graphics');
    if (this.filterOptions.columns === '1') this.activeFilters.push('1 column');
    if (this.filterOptions.columns === '2') this.activeFilters.push('2 columns');
    if (this.filterOptions.color !== 'all') this.activeFilters.push(this.filterOptions.color);
  }

  removeFilter(filterType: string, value: string) {
    switch (filterType) {
      case 'headshot':
        this.filterOptions.headshot = 'all';
        break;
      case 'graphics':
        this.filterOptions.graphics = 'all';
        break;
      case 'columns':
        this.filterOptions.columns = 'all';
        break;
      case 'color':
        this.filterOptions.color = 'all';
        break;
    }
    this.applyFilters();
  }

  clearAllFilters() {
    this.filterOptions = {
      headshot: 'all',
      graphics: 'all',
      columns: 'all',
      color: 'all'
    };
    this.applyFilters();
  }
}
