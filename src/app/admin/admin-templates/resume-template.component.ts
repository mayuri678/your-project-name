import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface Skill {
  name: string;
  level: string;
}

interface ProfileData {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  photo: string;
  education: Education[];
  skills: Skill[];
}

@Component({
  selector: 'app-resume-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-template.component.html',
  styleUrls: ['./resume-template.component.css']
})
export class ResumeTemplateComponent {
  profileData: ProfileData = {
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    photo: '',
    education: [],
    skills: []
  };

  addEducation() {
    this.profileData.education.push({
      degree: '',
      school: '',
      year: ''
    });
  }

  removeEducation(index: number) {
    this.profileData.education.splice(index, 1);
  }

  addSkill() {
    this.profileData.skills.push({
      name: '',
      level: 'Beginner'
    });
  }

  removeSkill(index: number) {
    this.profileData.skills.splice(index, 1);
  }

  uploadPhoto() {
    // Photo upload functionality
    console.log('Upload photo clicked');
  }
}