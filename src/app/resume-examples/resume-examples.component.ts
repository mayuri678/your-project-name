import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component'; // ✅ adjust path as needed

@Component({
  selector: 'app-resume-examples',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, HeaderComponent],
  templateUrl: './resume-examples.component.html',
  styleUrls: ['./resume-examples.component.css']
})
export class ResumeExamplesComponent implements OnInit {
  // --- Header control ---
  isLoggedIn = true;
  showTemplateSelection = false;
  // location removed from UI

  // --- Dropdown filters ---
  filterOptions = {
    headshot: '',
    graphics: '',
    columns: '',
    color: ''
  };

  // --- Resume examples ---
  categories = [
    'Accountant',
    'Bartender',
    'Certified Nursing Assistant',
    'College',
    'Data Scientist',
    'Graphic Design',
    'High School',
    'Medical Assistant',
    'Microsoft Word',
    'Project Manager',
    'Registered Nurse',
    'Server',
    'Software Engineer',
    'Student',
    'Teacher'
  ];

  selectedCategory: string | null = null;
  isCategoryMenuOpen = false;
  currentTemplates: string[] = [];

  // --- Methods ---
  openExample(category: string): void {
    this.selectedCategory = category;
    this.currentTemplates = this.getTemplatesForCategory(category);
    document.body.style.overflow = 'hidden';
  }

  closeExample(): void {
    this.selectedCategory = null;
    document.body.style.overflow = '';
    // Navigate away to avoid showing a blank page behind the modal
    this.router.navigate(['/home']);
  }

  toggleTemplateSelection() {
    this.showTemplateSelection = !this.showTemplateSelection;
  }

  logout() {
    console.log('User logged out');
  }

  applyFilters() {
    console.log('Filters applied:', this.filterOptions);
  }

  toggleCategoryMenu(event?: MouseEvent): void {
    if (event) { event.stopPropagation(); }
    this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
  }

  selectCategory(category: string): void {
    this.openExample(category);
    this.isCategoryMenuOpen = false;
  }

  ngOnInit(): void {
    // Check if we should open Student category by default
    const routeCategory = this.route.snapshot.queryParamMap.get('category');
    if (routeCategory === 'Student' || routeCategory === 'student') {
      this.openExample('Student');
      return;
    }
    
    // Auto-open the modal with a default category and avoid showing the list screen
    const defaultCategory = this.categories[0] ?? null;
    console.log('Default category:', defaultCategory);
    if (defaultCategory) {
      this.selectedCategory = defaultCategory;
      this.currentTemplates = this.getTemplatesForCategory(defaultCategory);
      document.body.style.overflow = 'hidden';
    }
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    // Ensure the modal is opened even earlier in the component lifecycle
    const defaultCategory = this.categories[0] ?? null;
    console.log('Constructor - Default category:', defaultCategory);
    console.log('Constructor - Templates available:', this.templatesByCategory);
    if (defaultCategory) {
      this.selectedCategory = defaultCategory;
      // Initialize templates immediately
      this.currentTemplates = this.getTemplatesForCategory(defaultCategory);
      document.body.style.overflow = 'hidden';
    }
    // Close the category menu when clicking anywhere in the document
    document.addEventListener('click', () => {
      this.isCategoryMenuOpen = false;
    });
  }

  // Use query param ?category=... to open specific category
  ngAfterViewInit(): void {
    const category = this.route.snapshot.queryParamMap.get('category');
    if (category && this.categories.includes(category)) {
      this.openExample(category);
    }
  }

  // --- Detailed Resume Examples Data ---
  resumeExamplesData: Record<string, any> = {
    'High School Student - First Job': {
      title: 'High School Student - First Job Resume',
      description: 'Perfect for students applying to their first job with no work experience',
      sections: {
        objective: 'Motivated high school student seeking first job opportunity to gain work experience and develop professional skills.',
        education: 'High School Diploma (Expected 2024)\nGPA: 3.5/4.0\nRelevant Coursework: Business, Computer Applications',
        skills: '• Customer Service\n• Cash Handling\n• Teamwork\n• Time Management\n• Microsoft Office',
        activities: '• Student Council Member\n• Volunteer at Local Food Bank\n• Basketball Team\n• Yearbook Committee',
        achievements: '• Honor Roll Student\n• Perfect Attendance Award\n• Community Service Certificate'
      }
    },
    'High School Student - Part-time Work': {
      title: 'High School Student - Part-time Work Resume',
      description: 'For students with some part-time work experience',
      sections: {
        objective: 'Reliable high school student with part-time work experience seeking new opportunities to expand skills.',
        experience: 'Cashier - Local Grocery Store (2023-Present)\n• Processed customer transactions\n• Maintained clean work area\n• Assisted with inventory',
        education: 'High School Diploma (Expected 2024)\nGPA: 3.7/4.0',
        skills: '• Customer Service\n• Cash Handling\n• Inventory Management\n• Problem Solving',
        activities: '• Debate Team Captain\n• Volunteer Tutor\n• School Newspaper Writer'
      }
    },
    'College Freshman - No Experience': {
      title: 'College Freshman - No Experience Resume',
      description: 'Ideal for college freshmen with no work experience',
      sections: {
        objective: 'Enthusiastic college freshman seeking internship or part-time position to gain professional experience.',
        education: 'Bachelor of Science in Business Administration (Expected 2027)\nCurrent GPA: 3.6/4.0',
        skills: '• Microsoft Office Suite\n• Social Media Management\n• Data Analysis\n• Communication\n• Leadership',
        activities: '• Business Club Member\n• Campus Volunteer\n• Study Group Leader\n• Intramural Sports',
        projects: '• Created business plan for entrepreneurship class\n• Organized campus charity event'
      }
    },
    'College Senior - Job Ready': {
      title: 'College Senior - Job Ready Resume',
      description: 'Comprehensive resume for graduating seniors',
      sections: {
        objective: 'Recent college graduate with internship experience seeking entry-level position in marketing.',
        experience: 'Marketing Intern - ABC Company (Summer 2023)\n• Assisted with social media campaigns\n• Conducted market research\n• Created promotional materials',
        education: 'Bachelor of Arts in Marketing (2024)\nGPA: 3.8/4.0\nRelevant Coursework: Digital Marketing, Consumer Behavior',
        skills: '• Google Analytics\n• Adobe Creative Suite\n• Social Media Marketing\n• Market Research\n• Project Management',
        projects: '• Developed marketing strategy for local business\n• Led team project for national marketing competition'
      }
    },
    'Computer Science Student - Programming': {
      title: 'Computer Science Student - Programming Resume',
      description: 'Technical resume for CS students with programming experience',
      sections: {
        objective: 'Computer Science student with strong programming skills seeking software development internship.',
        experience: 'Software Development Intern - Tech Startup (2023)\n• Developed web applications using React\n• Collaborated with development team\n• Participated in code reviews',
        education: 'Bachelor of Science in Computer Science (Expected 2025)\nGPA: 3.9/4.0',
        skills: '• Programming: Java, Python, JavaScript, C++\n• Web Development: HTML, CSS, React, Node.js\n• Databases: SQL, MongoDB\n• Tools: Git, Docker, AWS',
        projects: '• Built full-stack e-commerce application\n• Created mobile app for campus events\n• Contributed to open-source projects on GitHub'
      }
    },
    'MBA Student - Business Ready': {
      title: 'MBA Student - Business Ready Resume',
      description: 'Professional resume for MBA students',
      sections: {
        objective: 'MBA student with business experience seeking management consulting or corporate strategy role.',
        experience: 'Business Analyst - Fortune 500 Company (2021-2023)\n• Analyzed financial data and market trends\n• Developed strategic recommendations\n• Managed cross-functional projects',
        education: 'Master of Business Administration (Expected 2024)\nBachelor of Business Administration (2021)\nGPA: 3.8/4.0',
        skills: '• Financial Analysis\n• Strategic Planning\n• Project Management\n• Leadership\n• Data Analysis',
        achievements: '• Dean\'s List\n• Business Case Competition Winner\n• Leadership Development Program Graduate'
      }
    },
    'High School Student - Volunteer Experience': {
      title: 'High School Student - Volunteer Experience Resume',
      description: 'Perfect for students with significant volunteer experience',
      sections: {
        objective: 'Compassionate high school student with extensive volunteer experience seeking opportunities to make a positive impact.',
        experience: 'Volunteer Coordinator - Local Community Center (2022-Present)\n• Organized community events\n• Managed volunteer schedules\n• Coordinated food drives',
        education: 'High School Diploma (Expected 2024)\nGPA: 3.6/4.0\nHonors: Community Service Award',
        skills: '• Event Planning\n• Leadership\n• Communication\n• Organization\n• Community Outreach',
        activities: '• Key Club President\n• Environmental Club\n• Peer Tutor\n• School Newspaper Editor',
        achievements: '• 200+ Volunteer Hours\n• Community Service Award\n• Leadership Excellence Certificate'
      }
    },
    'College Sophomore - Some Experience': {
      title: 'College Sophomore - Some Experience Resume',
      description: 'For college sophomores with some work or internship experience',
      sections: {
        objective: 'Motivated college sophomore with internship experience seeking summer internship in business field.',
        experience: 'Business Development Intern - Local Startup (Summer 2023)\n• Assisted with market research\n• Created social media content\n• Attended client meetings',
        education: 'Bachelor of Business Administration (Expected 2026)\nCurrent GPA: 3.7/4.0\nRelevant Coursework: Marketing, Finance, Statistics',
        skills: '• Market Research\n• Social Media Marketing\n• Microsoft Excel\n• Presentation Skills\n• Team Collaboration',
        activities: '• Business Club Vice President\n• Campus Ambassador\n• Study Abroad Program\n• Intramural Basketball',
        projects: '• Developed marketing campaign for campus event\n• Created business plan for entrepreneurship competition'
      }
    },
    'Engineering Student - Technical': {
      title: 'Engineering Student - Technical Resume',
      description: 'Technical resume for engineering students with project experience',
      sections: {
        objective: 'Engineering student with hands-on project experience seeking technical internship in mechanical engineering.',
        experience: 'Engineering Intern - Manufacturing Company (2023)\n• Designed CAD models for new products\n• Conducted material testing\n• Assisted with quality control processes',
        education: 'Bachelor of Science in Mechanical Engineering (Expected 2025)\nGPA: 3.8/4.0\nRelevant Coursework: Thermodynamics, CAD Design, Materials Science',
        skills: '• CAD Software (SolidWorks, AutoCAD)\n• MATLAB\n• 3D Printing\n• Project Management\n• Technical Writing',
        projects: '• Designed and built solar-powered car for competition\n• Created automated irrigation system\n• Developed mobile app for engineering calculations',
        achievements: '• Engineering Excellence Award\n• Dean\'s List\n• ASME Student Member'
      }
    },
    'Art Student - Creative Portfolio': {
      title: 'Art Student - Creative Portfolio Resume',
      description: 'Creative resume for art students showcasing portfolio work',
      sections: {
        objective: 'Creative art student with diverse portfolio seeking internship in graphic design or digital media.',
        experience: 'Freelance Graphic Designer (2022-Present)\n• Created logos for local businesses\n• Designed social media graphics\n• Developed brand identities',
        education: 'Bachelor of Fine Arts in Graphic Design (Expected 2025)\nGPA: 3.9/4.0\nRelevant Coursework: Digital Design, Typography, Branding',
        skills: '• Adobe Creative Suite (Photoshop, Illustrator, InDesign)\n• Digital Illustration\n• Brand Design\n• Web Design\n• Photography',
        projects: '• Designed complete brand identity for campus coffee shop\n• Created interactive digital art installation\n• Published children\'s book illustrations',
        achievements: '• Art Department Scholarship\n• Student Art Show Winner\n• Portfolio Review Excellence Award'
      }
    },
    'International Student - Work Visa': {
      title: 'International Student - Work Visa Resume',
      description: 'Resume tailored for international students seeking work authorization',
      sections: {
        objective: 'International student with strong academic background seeking internship opportunity with potential for work authorization.',
        experience: 'Research Assistant - University Lab (2023-Present)\n• Conducted data analysis\n• Assisted with research publications\n• Managed lab equipment',
        education: 'Master of Science in Data Science (Expected 2024)\nBachelor of Engineering (International University, 2022)\nGPA: 3.8/4.0',
        skills: '• Python, R, SQL\n• Machine Learning\n• Statistical Analysis\n• Research Methods\n• Multilingual (English, Spanish, French)',
        projects: '• Developed predictive model for climate data\n• Created data visualization dashboard\n• Published research paper in academic journal',
        achievements: '• International Student Excellence Award\n• Research Fellowship Recipient\n• Dean\'s List'
      }
    },
    'Corporate Accountant - Financial Reporting': {
      title: 'Corporate Accountant - Financial Reporting Resume',
      description: 'Professional resume for corporate accountants specializing in financial reporting and compliance',
      sections: {
        objective: 'Detail-oriented Corporate Accountant with 5+ years of experience in financial reporting, month-end close processes, and regulatory compliance seeking to contribute to a dynamic finance team.',
        experience: 'Senior Corporate Accountant - Fortune 500 Company (2020-Present)\n• Prepare monthly, quarterly, and annual financial statements\n• Manage month-end close process and ensure timely reporting\n• Coordinate with external auditors and ensure compliance with GAAP\n• Analyze financial data and provide variance analysis\n• Implement process improvements that reduced closing time by 20%\n\nStaff Accountant - Mid-Size Corporation (2018-2020)\n• Maintained general ledger and prepared journal entries\n• Reconciled balance sheet accounts and investigated discrepancies\n• Assisted with budget preparation and forecasting\n• Processed accounts payable and accounts receivable transactions',
        education: 'Bachelor of Science in Accounting (2018)\nCertified Public Accountant (CPA) - Licensed 2019\nGPA: 3.7/4.0',
        skills: '• Financial Reporting (GAAP, IFRS)\n• ERP Systems (SAP, Oracle, NetSuite)\n• Advanced Excel and Financial Modeling\n• Month-End Close Process\n• Audit Coordination\n• Variance Analysis\n• Budgeting and Forecasting\n• SOX Compliance',
        achievements: '• Led implementation of new financial reporting system\n• Reduced month-end close time by 20% through process optimization\n• Successfully managed 3 external audits with zero material findings\n• CPA License - Passed all 4 sections on first attempt\n• Employee of the Quarter - Q3 2022'
      }
    },
    'Public Accounting - Audit Specialist': {
      title: 'Public Accounting - Audit Specialist Resume',
      description: 'Comprehensive resume for public accountants specializing in audit services and client management',
      sections: {
        objective: 'Experienced Public Accountant with 6+ years of audit experience across various industries seeking to leverage technical expertise and client relationship skills in a senior audit role.',
        experience: 'Senior Audit Associate - Big 4 Accounting Firm (2019-Present)\n• Lead audit engagements for clients in manufacturing, retail, and technology sectors\n• Manage audit teams of 2-4 staff members and coordinate with client personnel\n• Perform risk assessment procedures and develop audit strategies\n• Review financial statements and ensure compliance with auditing standards\n• Present audit findings to senior management and audit committees\n\nAudit Associate - Regional CPA Firm (2017-2019)\n• Executed audit procedures for small to mid-size businesses\n• Prepared workpapers and documented audit evidence\n• Identified control deficiencies and provided recommendations\n• Assisted with tax return preparation and review',
        education: 'Master of Science in Accounting (2017)\nBachelor of Business Administration in Accounting (2016)\nCertified Public Accountant (CPA) - Licensed 2018\nGPA: 3.8/4.0',
        skills: '• Financial Statement Auditing (GAAS, PCAOB)\n• Risk Assessment and Internal Controls\n• Audit Software (CaseWare, IDEA, ACL)\n• Client Relationship Management\n• Team Leadership and Mentoring\n• Technical Accounting Research\n• Tax Compliance (Individual and Corporate)\n• Data Analytics and Sampling Techniques',
        achievements: '• Promoted to Senior Associate in 2.5 years (faster than typical 3-year track)\n• Led 15+ audit engagements with combined revenue of $500M+\n• Maintained 100% client retention rate over 3 years\n• CPA License - Passed all 4 sections on first attempt\n• Firm-wide recognition for exceptional client service\n• Mentor to 3 junior staff members'
      }
    }
  };

  // --- Templates per category ---
  // Sources: resume.org examples + Canva templates
  templatesByCategory: Record<string, string[]> = {
    Accountant: [
      'Entry-Level Accountant',
      'Senior Accountant',
      'Staff Accountant',
      'Junior Accountant',
      'Tax Accountant',
      'Accounting Intern',
      'Certified Public Accountant',
      'Experienced Accountant',
      'Cost Accountant',
      'Accounts Payable Specialist',
      'Accounts Receivable Specialist',
      'Payroll Accountant',
      'Forensic Accountant',
      'Fixed Asset Accountant',
      'Fund Accountant',
      'Audit Accountant',
      'General Ledger Accountant',
      'Government Accountant',
      'Investment Accountant',
      'Financial Analyst',
      'Budget Analyst',
      'Controller',
      'Accounting Manager',
      'Corporate Accountant - Financial Reporting',
      'Public Accounting - Audit Specialist'
    ],
    Bartender: [
      'Tiki Bar Bartender',
      'Cocktail Bartender',
      'Mixologist',
      'Bar Manager',
      'Head Bartender',
      'Service Bartender',
      'Craft Cocktail Specialist',
      'Wine Bartender',
      'Sports Bar Bartender',
      'Fine Dining Bartender',
      'Hotel Bartender',
      'Nightclub Bartender',
      'Restaurant Bartender',
      'Event Bartender'
    ],
    'Certified Nursing Assistant': [
      'ICU CNA',
      'Hospital CNA',
      'Nursing Home CNA',
      'Home Health CNA',
      'Pediatric CNA',
      'Geriatric CNA',
      'Rehabilitation CNA',
      'Emergency Room CNA',
      'Surgical CNA',
      'Long-term Care CNA',
      'Hospice CNA',
      'Private Duty CNA',
      'Travel CNA',
      'Senior CNA'
    ],
    College: [
      'College Intern',
      'Recent Graduate',
      'Entry-Level Professional',
      'Student Intern',
      'Academic Intern',
      'Research Intern',
      'Business Intern',
      'Marketing Intern',
      'Finance Intern',
      'Engineering Intern',
      'Computer Science Intern',
      'Healthcare Intern',
      'Education Intern',
      'Communications Intern'
    ],
    'Data Scientist': [
      'Entry-Level Data Scientist',
      'Senior Data Scientist',
      'Machine Learning Engineer',
      'Data Analyst',
      'Business Intelligence Analyst',
      'Research Data Scientist',
      'Quantitative Analyst',
      'Data Engineer',
      'AI Research Scientist',
      'Statistical Analyst',
      'Predictive Modeler',
      'Big Data Scientist',
      'Data Science Manager',
      'Lead Data Scientist'
    ],
    'Graphic Design': [
      '3D Graphic Designer',
      'Web Designer',
      'UI/UX Designer',
      'Brand Designer',
      'Print Designer',
      'Motion Graphics Designer',
      'Creative Director',
      'Art Director',
      'Visual Designer',
      'Digital Designer',
      'Packaging Designer',
      'Marketing Designer',
      'Freelance Designer',
      'Senior Designer'
    ],
    'High School': [
      'High School Student',
      'First Job Resume',
      'Teen Worker',
      'Student Employee',
      'Part-time Worker',
      'Summer Job',
      'Retail Worker',
      'Food Service Worker',
      'Lifeguard',
      'Camp Counselor',
      'Tutor',
      'Babysitter',
      'Volunteer',
      'Intern'
    ],
    'Medical Assistant': [
      'Entry-Level Medical Assistant',
      'Certified Medical Assistant',
      'Clinical Medical Assistant',
      'Administrative Medical Assistant',
      'Pediatric Medical Assistant',
      'Cardiology Medical Assistant',
      'Dermatology Medical Assistant',
      'Orthopedic Medical Assistant',
      'Senior Medical Assistant',
      'Lead Medical Assistant',
      'Medical Assistant Supervisor',
      'Specialty Medical Assistant',
      'Travel Medical Assistant',
      'Medical Office Assistant'
    ],
    'Microsoft Word': [
      'Word Template - Professional',
      'Word Template - Modern',
      'Word Template - Creative',
      'Word Template - Traditional',
      'Word Template - Executive',
      'Word Template - Academic',
      'Word Template - Technical',
      'Word Template - Healthcare',
      'Word Template - Finance',
      'Word Template - Marketing',
      'Word Template - Education',
      'Word Template - Legal',
      'Word Template - Engineering',
      'Word Template - Sales'
    ],
    'Project Manager': [
      'Senior Project Manager',
      'IT Project Manager',
      'Construction Project Manager',
      'Software Project Manager',
      'Marketing Project Manager',
      'Healthcare Project Manager',
      'Agile Project Manager',
      'Scrum Master',
      'Program Manager',
      'Portfolio Manager',
      'Technical Project Manager',
      'Business Project Manager',
      'Operations Project Manager',
      'Product Manager'
    ],
    'Registered Nurse': [
      'Operating Room Registered Nurse',
      'ICU Registered Nurse',
      'Emergency Room Nurse',
      'Pediatric Nurse',
      'Medical-Surgical Nurse',
      'Critical Care Nurse',
      'Oncology Nurse',
      'Cardiac Nurse',
      'Psychiatric Nurse',
      'Home Health Nurse',
      'Travel Nurse',
      'Charge Nurse',
      'Nurse Manager',
      'Clinical Nurse Specialist'
    ],
    Server: [
      'Upscale Waiter Server',
      'Fine Dining Server',
      'Restaurant Server',
      'Catering Server',
      'Banquet Server',
      'Bar Server',
      'Cocktail Server',
      'Senior Server',
      'Lead Server',
      'Server Trainer',
      'Head Server',
      'Service Captain',
      'Guest Service Server',
      'Event Server'
    ],
    'Software Engineer': [
      'Software Engineer - AI and Machine Learning',
      'Full Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'Mobile Developer',
      'DevOps Engineer',
      'Senior Software Engineer',
      'Lead Software Engineer',
      'Principal Software Engineer',
      'Software Architect',
      'Embedded Software Engineer',
      'Game Developer',
      'Web Developer',
      'Software Development Manager'
    ],
    Student: [
      'High School Student - First Job',
      'High School Student - Part-time Work',
      'High School Student - Volunteer Experience',
      'College Freshman - No Experience',
      'College Sophomore - Some Experience',
      'College Junior - Internship Ready',
      'College Senior - Job Ready',
      'Recent Graduate - Entry Level',
      'Graduate Student - Academic',
      'Graduate Student - Professional',
      'PhD Student - Research Focus',
      'MBA Student - Business Ready',
      'Law Student - Legal Intern',
      'Medical Student - Clinical Experience',
      'Engineering Student - Technical',
      'Computer Science Student - Programming',
      'Business Student - Corporate',
      'Art Student - Creative Portfolio',
      'International Student - Work Visa',
      'Part-time Student - Work Study',
      'Online Student - Remote Ready',
      'Research Student - Academic',
      'Student Athlete - Leadership',
      'Student Leader - Campus Activities',
      'Student Entrepreneur - Startup Ready'
    ],
    Teacher: [
      'English as a Second Language Teacher',
      'Elementary School Teacher',
      'High School Teacher',
      'Middle School Teacher',
      'Special Education Teacher',
      'Math Teacher',
      'Science Teacher',
      'History Teacher',
      'Art Teacher',
      'Music Teacher',
      'Physical Education Teacher',
      'Substitute Teacher',
      'Preschool Teacher',
      'Professor'
    ]
  };

  getTemplatesForCategory(category: string): string[] {
    // Direct lookup first
    if (this.templatesByCategory[category]) {
      return this.templatesByCategory[category];
    }
    
    // Case-insensitive lookup
    const lower = category.toLowerCase();
    const match = Object.keys(this.templatesByCategory).find(k => k.toLowerCase() === lower);
    if (match && this.templatesByCategory[match]) {
      return this.templatesByCategory[match];
    }
    
    // Fallback to categories if no templates found
    console.log('No templates found for category:', category);
    return this.categories;
  }

  getCurrentTemplates(): string[] {
    if (!this.selectedCategory) {
      return this.categories; // Fallback to all categories
    }
    return this.getTemplatesForCategory(this.selectedCategory);
  }

  getResultsCount(): number {
    return this.getCurrentTemplates().length;
  }

  // Make templates usable - navigate to resume builder with selected template
  useTemplate(templateName: string): void {
    console.log('Using template:', templateName, 'from category:', this.selectedCategory);
    console.log('Current templates:', this.currentTemplates);
    
    // Navigate to resume page with template parameter
    this.router.navigate(['/resume'], { 
      queryParams: { 
        template: templateName,
        category: this.selectedCategory 
      } 
    }).then(() => {
      console.log('Navigation completed to resume page');
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }

  previewTemplate(templateName: string): void {
    console.log('Previewing template:', templateName);
    
    // Check if we have detailed resume data for this template
    const resumeData = this.resumeExamplesData[templateName];
    if (resumeData) {
      this.showDetailedPreview(templateName, resumeData);
    } else {
      // Fallback to simple alert for templates without detailed data
      alert(`Preview: ${templateName}\n\nThis template will be applied to your resume.`);
    }
  }

  showDetailedPreview(templateName: string, resumeData: any): void {
    // Create a detailed preview modal
    const previewContent = this.generatePreviewContent(resumeData);
    
    // For now, show in alert. Later this could be a proper modal
    alert(`PREVIEW: ${resumeData.title}\n\n${resumeData.description}\n\n${previewContent}`);
  }

  generatePreviewContent(resumeData: any): string {
    let content = '';
    
    if (resumeData.sections.objective) {
      content += `OBJECTIVE:\n${resumeData.sections.objective}\n\n`;
    }
    
    if (resumeData.sections.education) {
      content += `EDUCATION:\n${resumeData.sections.education}\n\n`;
    }
    
    if (resumeData.sections.experience) {
      content += `EXPERIENCE:\n${resumeData.sections.experience}\n\n`;
    }
    
    if (resumeData.sections.skills) {
      content += `SKILLS:\n${resumeData.sections.skills}\n\n`;
    }
    
    if (resumeData.sections.projects) {
      content += `PROJECTS:\n${resumeData.sections.projects}\n\n`;
    }
    
    if (resumeData.sections.activities) {
      content += `ACTIVITIES:\n${resumeData.sections.activities}\n\n`;
    }
    
    if (resumeData.sections.achievements) {
      content += `ACHIEVEMENTS:\n${resumeData.sections.achievements}`;
    }
    
    return content;
  }

  getResumeData(templateName: string): any {
    return this.resumeExamplesData[templateName] || null;
  }

  // Helper method to get student-specific templates
  getStudentTemplates(): string[] {
    return this.templatesByCategory['Student'] || [];
  }

  // Method to open student examples directly
  openStudentExamples(): void {
    this.openExample('Student');
  }

  // Method to check if a template has detailed resume data
  hasDetailedExample(templateName: string): boolean {
    return !!this.resumeExamplesData[templateName];
  }

  // Get count of templates with detailed examples
  getDetailedExamplesCount(): number {
    return Object.keys(this.resumeExamplesData).length;
  }

  // Debug method to check template loading
  debugTemplates(): void {
    console.log('=== TEMPLATE DEBUG ===');
    console.log('Selected category:', this.selectedCategory);
    console.log('Current templates:', this.currentTemplates);
    console.log('Templates count:', this.currentTemplates.length);
    console.log('All categories:', this.categories);
    console.log('Templates by category:', this.templatesByCategory);
    console.log('=====================');
  }
}













