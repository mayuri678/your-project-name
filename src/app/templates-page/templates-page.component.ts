import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../auth.service';
import { TemplatePreviewCardComponent, TemplateCardData } from './template-preview-card.component';
import { TemplateMetadataService } from './template-metadata.service';

@Component({
  selector: 'app-templates-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, TemplatePreviewCardComponent],
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page-enhanced.css']
})
export class TemplatesPageComponent implements OnInit {
  loggedIn: boolean = false;
  templates: TemplateCardData[] = [];
  filteredTemplates: TemplateCardData[] = [];
  selectedCategory: string = 'All';
  categories: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private templateMetadataService: TemplateMetadataService
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn();
    if (!this.loggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.templates = this.templateMetadataService.getAllTemplates();
    this.categories = ['All', ...this.templateMetadataService.getCategories()];
    this.filterTemplates();
  }

  filterTemplates(): void {
    if (this.selectedCategory === 'All') {
      this.filteredTemplates = this.templates;
    } else {
      this.filteredTemplates = this.templateMetadataService.getTemplatesByCategory(this.selectedCategory);
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterTemplates();
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
