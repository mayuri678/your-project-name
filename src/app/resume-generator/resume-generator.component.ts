import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-resume-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './resume-generator.component.html',
  styleUrls: ['./resume-generator.component.css']
})
export class ResumeGeneratorComponent {
  jobRole: string = '';
  experience: string = '';
  skills: string = '';
  generatedSummary: string = '';
  isGenerating: boolean = false;
  
  // Cover Letter fields
  candidateName: string = '';
  companyName: string = '';
  tone: string = 'Professional';
  length: string = 'Medium';
  generatedCoverLetter: string = '';
  isGeneratingCoverLetter: boolean = false;

  constructor(private router: Router) {}

  generateSummary(): void {
    if (!this.jobRole || !this.experience || !this.skills) {
      alert('Please fill in all fields');
      return;
    }

    this.isGenerating = true;

    // Simulate API call delay
    setTimeout(() => {
      this.generatedSummary = this.createProfessionalSummary();
      this.isGenerating = false;
    }, 1500);
  }

  private createProfessionalSummary(): string {
    const experienceNum = parseInt(this.experience);
    const skillsArray = this.skills.split(',').map(s => s.trim());
    
    let summary = `Accomplished ${this.jobRole} with ${experienceNum}+ ${experienceNum === 1 ? 'year' : 'years'} of experience architecting scalable solutions and accelerating digital transformation initiatives. `;
    
    if (skillsArray.length > 0) {
      summary += `Advanced proficiency in ${skillsArray.join(', ')} with proven success in optimizing system performance and delivering mission-critical applications. `;
    }
    
    summary += `Demonstrated expertise in leading agile development teams and implementing best practices that drive measurable business outcomes.`;
    
    return summary;
  }

  copySummary(): void {
    if (this.generatedSummary) {
      navigator.clipboard.writeText(this.generatedSummary).then(() => {
        alert('Summary copied to clipboard!');
      });
    }
  }

  suggestSkills(): void {
    const suggestions = this.getSkillSuggestions(this.jobRole.toLowerCase());
    this.skills = suggestions;
  }

  private getSkillSuggestions(role: string): string {
    const skillMap: { [key: string]: string } = {
      'full stack developer': 'JavaScript, React, Node.js, Python, SQL, MongoDB, Git, AWS, REST APIs, TypeScript, Docker, Agile',
      'frontend developer': 'React, JavaScript, TypeScript, HTML5, CSS3, Vue.js, Angular, Webpack, SASS, Git, Responsive Design, Jest',
      'backend developer': 'Node.js, Python, Java, SQL, MongoDB, PostgreSQL, REST APIs, Docker, AWS, Microservices, Redis, Express.js',
      'data scientist': 'Python, R, SQL, Machine Learning, TensorFlow, Pandas, NumPy, Tableau, Power BI, Statistics, Jupyter, Scikit-learn',
      'devops engineer': 'AWS, Docker, Kubernetes, Jenkins, Terraform, Linux, CI/CD, Git, Ansible, Monitoring, Python, Bash',
      'product manager': 'Agile, Scrum, JIRA, Product Strategy, Market Research, Analytics, Roadmapping, Stakeholder Management, A/B Testing, SQL, Wireframing, User Stories',
      'ui/ux designer': 'Figma, Adobe XD, Sketch, Photoshop, Illustrator, Prototyping, User Research, Wireframing, HTML/CSS, InVision, Usability Testing, Design Systems',
      'software engineer': 'Java, Python, C++, JavaScript, SQL, Git, Algorithms, Data Structures, System Design, Testing, Debugging, Agile',
      'mobile developer': 'React Native, Flutter, Swift, Kotlin, Java, Xcode, Android Studio, iOS, Firebase, REST APIs, Git, App Store',
      'qa engineer': 'Selenium, TestNG, JIRA, Manual Testing, Automation Testing, API Testing, SQL, Postman, Cypress, Bug Tracking, Test Planning, Agile'
    };
    
    for (const [key, skills] of Object.entries(skillMap)) {
      if (role.includes(key) || key.includes(role)) {
        return skills;
      }
    }
    
    return 'Communication, Problem Solving, Teamwork, Leadership, Project Management, Time Management, Critical Thinking, Adaptability';
  }

  generateCoverLetter(): void {
    if (!this.candidateName || !this.jobRole || !this.experience || !this.skills) {
      alert('Please fill in all required fields');
      return;
    }

    this.isGeneratingCoverLetter = true;
    
    setTimeout(() => {
      this.generatedCoverLetter = this.createCoverLetter();
      this.isGeneratingCoverLetter = false;
    }, 1500);
  }

  private createCoverLetter(): string {
    const experienceNum = parseInt(this.experience);
    const skillsArray = this.skills.split(',').map(s => s.trim());
    const companyText = this.companyName ? this.companyName : 'your organization';
    
    let coverLetter = `Dear Hiring Manager,\n\n`;
    
    if (this.length === 'Short') {
      coverLetter += `${this.candidateName} is an accomplished ${this.jobRole} with ${experienceNum}+ years of experience in ${skillsArray.slice(0, 3).join(', ')}. Proven track record of delivering innovative solutions and driving business growth. Excited to contribute expertise to ${companyText} and exceed performance expectations.`;
    } else if (this.length === 'Long') {
      coverLetter += `${this.candidateName} brings ${experienceNum}+ years of specialized experience as a ${this.jobRole}, with advanced proficiency in ${skillsArray.join(', ')}. Throughout the career, consistently delivered high-impact solutions that optimize system performance and accelerate digital transformation initiatives.\n\n`;
      coverLetter += `The combination of technical expertise and leadership experience positions ${this.candidateName} to make immediate contributions to ${companyText}. Demonstrated success in leading cross-functional teams, implementing best practices, and driving measurable business outcomes aligns perfectly with the requirements of this ${this.jobRole} position.`;
    } else {
      coverLetter += `${this.candidateName} is a results-driven ${this.jobRole} with ${experienceNum}+ years of experience delivering scalable solutions using ${skillsArray.slice(0, 4).join(', ')}. Proven expertise in optimizing system performance, leading agile development teams, and implementing strategic initiatives that drive business growth makes ${this.candidateName} an ideal candidate for ${companyText}.`;
    }
    
    coverLetter += `\n\nSincerely,\n${this.candidateName}`;
    
    return coverLetter;
  }

  copyCoverLetter(): void {
    if (this.generatedCoverLetter) {
      navigator.clipboard.writeText(this.generatedCoverLetter).then(() => {
        alert('Cover letter copied to clipboard!');
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}