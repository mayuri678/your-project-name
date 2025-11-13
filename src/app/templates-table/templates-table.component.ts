import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-templates-table',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './templates-table.component.html',
  styleUrls: ['./templates-table.component.css']
})
export class TemplatesTableComponent implements OnInit {
  isLoggedIn = true;

  // All available resume templates organized by category - matching resume component IDs
  allTemplates: any[] = [
    // Blue templates
    { id: 'template1', name: 'Classic Blue', category: 'Professional', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'blue', recommended: false },
    { id: 'template8', name: 'Tech Modern', category: 'Technology', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'blue', recommended: false },
    { id: 'template13', name: 'Ocean Blue', category: 'Professional', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'blue', recommended: true },
    { id: 'template14', name: 'Sky Blue', category: 'Creative', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'blue', recommended: false },

    // Green templates
    { id: 'template2', name: 'Modern Sidebar', category: 'Professional', hasHeadshot: true, hasGraphics: false, columns: 2, color: 'green', recommended: true },
    { id: 'template10', name: 'Startup Green', category: 'Business', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'green', recommended: true },
    { id: 'template15', name: 'Forest Green', category: 'Professional', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'green', recommended: false },
    { id: 'template16', name: 'Mint Green', category: 'Creative', hasHeadshot: false, hasGraphics: true, columns: 1, color: 'green', recommended: false },

    // Purple templates
    { id: 'template3', name: 'Header Style', category: 'Professional', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'purple', recommended: false },
    { id: 'template12', name: 'Artistic Purple', category: 'Creative', hasHeadshot: true, hasGraphics: true, columns: 1, color: 'purple', recommended: false },
    { id: 'template17', name: 'Royal Purple', category: 'Executive', hasHeadshot: true, hasGraphics: false, columns: 2, color: 'purple', recommended: true },
    { id: 'template18', name: 'Lavender', category: 'Creative', hasHeadshot: false, hasGraphics: true, columns: 1, color: 'purple', recommended: false },

    // Black templates
    { id: 'template4', name: 'Minimal Black', category: 'Minimalist', hasHeadshot: false, hasGraphics: false, columns: 1, color: 'black', recommended: false },
    { id: 'template19', name: 'Elegant Black', category: 'Executive', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'black', recommended: true },
    { id: 'template20', name: 'Modern Black', category: 'Modern', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'black', recommended: false },

    // Navy templates
    { id: 'template5', name: 'Professional Navy', category: 'Professional', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'navy', recommended: false },
    { id: 'template11', name: 'Corporate Navy', category: 'Corporate', hasHeadshot: false, hasGraphics: false, columns: 1, color: 'navy', recommended: false },
    { id: 'template21', name: 'Executive Navy', category: 'Executive', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'navy', recommended: true },
    { id: 'template22', name: 'Business Navy', category: 'Business', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'navy', recommended: false },

    // Orange templates
    { id: 'template6', name: 'Creative Orange', category: 'Creative', hasHeadshot: true, hasGraphics: true, columns: 1, color: 'orange', recommended: false },
    { id: 'template23', name: 'Sunset Orange', category: 'Creative', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'orange', recommended: true },
    { id: 'template24', name: 'Vibrant Orange', category: 'Creative', hasHeadshot: false, hasGraphics: true, columns: 2, color: 'orange', recommended: false },

    // Gray templates
    { id: 'template7', name: 'Executive Gray', category: 'Executive', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'gray', recommended: true },
    { id: 'template25', name: 'Professional Gray', category: 'Professional', hasHeadshot: false, hasGraphics: false, columns: 1, color: 'gray', recommended: false },
    { id: 'template26', name: 'Modern Gray', category: 'Modern', hasHeadshot: true, hasGraphics: true, columns: 2, color: 'gray', recommended: false },

    // Dark Blue templates
    { id: 'template9', name: 'Academic Dark Blue', category: 'Academic', hasHeadshot: true, hasGraphics: false, columns: 1, color: 'darkblue', recommended: false },
    { id: 'template27', name: 'Deep Blue', category: 'Professional', hasHeadshot: true, hasGraphics: false, columns: 2, color: 'darkblue', recommended: true },
    { id: 'template28', name: 'Midnight Blue', category: 'Professional', hasHeadshot: false, hasGraphics: true, columns: 1, color: 'darkblue', recommended: false }
  ];

  filteredTemplates: any[] = [];
  selectedCategory: string = 'All';
  selectedColor: string = 'All';
  selectedColumns: string = 'All';
  selectedHeadshot: string = 'All';
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  categories: string[] = ['All', 'Professional', 'Technology', 'Creative', 'Business', 'Executive', 'Minimalist', 'Corporate', 'Modern', 'Academic'];
  colors: string[] = ['All', 'blue', 'green', 'purple', 'black', 'navy', 'orange', 'gray', 'darkblue'];
  columns: string[] = ['All', '1', '2'];
  headshots: string[] = ['All', 'With Photo', 'Without Photo'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredTemplates = [...this.allTemplates];
  }

  applyFilters(): void {
    this.filteredTemplates = this.allTemplates.filter(template => {
      const categoryMatch = this.selectedCategory === 'All' || template.category === this.selectedCategory;
      const colorMatch = this.selectedColor === 'All' || template.color === this.selectedColor;
      const columnsMatch = this.selectedColumns === 'All' || template.columns.toString() === this.selectedColumns;
      const headshotMatch = this.selectedHeadshot === 'All' || 
        (this.selectedHeadshot === 'With Photo' && template.hasHeadshot) ||
        (this.selectedHeadshot === 'Without Photo' && !template.hasHeadshot);
      
      return categoryMatch && colorMatch && columnsMatch && headshotMatch;
    });
  }

  selectTemplate(template: any, event?: Event): void {
    console.log('Selected template:', template);
    
    // Navigate to resume component with template selection to show the modal
    this.router.navigate(['/resume'], { 
      queryParams: { 
        template: template.id,
        templateName: template.name,
        fromTemplates: 'true',
        openTemplates: 'true'
      } 
    }).then(() => {
      console.log('Successfully navigated to resume with template selection modal:', template.name);
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }

  previewTemplate(template: any): void {
    console.log('Preview template:', template);
    // You can implement a preview modal here
    alert(`Preview: ${template.name}\n\nCategory: ${template.category}\nColor: ${template.color}\nColumns: ${template.columns}\nPhoto: ${template.hasHeadshot ? 'Yes' : 'No'}\nGraphics: ${template.hasGraphics ? 'Yes' : 'No'}`);
  }

  getColorClass(color: string): string {
    return `color-${color}`;
  }

  resetFilters(): void {
    this.selectedCategory = 'All';
    this.selectedColor = 'All';
    this.selectedColumns = 'All';
    this.selectedHeadshot = 'All';
    this.applyFilters();
  }

  logout() {
    console.log('User logged out');
  }
}
