import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { TemplateCardEnhancedComponent } from '../home/template-card-enhanced.component';
import { TEMPLATE_METADATA, TemplateMetadata } from '../home/template-metadata';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-create-resume',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, TemplateCardEnhancedComponent],
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.css']
})
export class CreateResumeComponent implements OnInit {
  loggedIn: boolean = false;
  templates: TemplateMetadata[] = TEMPLATE_METADATA;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
    }
  }

  selectTemplate(templateId: number): void {
    this.router.navigate(['/resume-builder'], { 
      queryParams: { templateId: templateId } 
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
