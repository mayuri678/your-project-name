import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-templates-table',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './templates-table.component.html',
  styleUrls: ['./templates-table.component.css']
})
export class TemplatesTableComponent implements OnInit {
  isLoggedIn = true;
  showPreviewModal = false;
  selectedTemplate: any = null;
  userName: string = 'Your Name';
  userEmail: string = 'your.email@example.com';
  userPhone: string = '(123) 456-7890';

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

  categories: string[] = ['All', 'Professional', 'Technology', 'Creative', 'Business', 'Executive', 'Minimalist', 'Corporate', 'Modern', 'Academic', 'Student'];
  colors: string[] = ['All', 'blue', 'green', 'purple', 'black', 'navy', 'orange', 'gray', 'darkblue'];
  columns: string[] = ['All', '1', '2'];
  headshots: string[] = ['All', 'With Photo', 'Without Photo'];

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  private loadUserInfo(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const currentUserName = localStorage.getItem('currentUserName');
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      
      if (currentUserName) this.userName = currentUserName;
      if (currentUserEmail) {
        // Check if it's gulvemayuri63 account
        if (currentUserEmail === 'gulvemayuri63') {
          this.userName = 'Mayuri Gulve';
          this.userEmail = 'gulvemayuri63@gmail.com';
          this.userPhone = '+91-9876543210';
        } else {
          this.userEmail = currentUserEmail;
        }
      }
    }
  }

  ngOnInit(): void {
    this.loadTemplatesFromDatabase();
    this.loadUserInfo();
  }

  private async loadTemplatesFromDatabase(): Promise<void> {
    try {
      console.log('Loading templates from database for website...');
      const result = await this.supabaseService.getAllTemplates();
      if (result.data && result.data.length > 0) {
        console.log('Database templates loaded:', result.data);
        const dbTemplates = result.data.map(template => {
          let resumeData: any = {};
          try {
            if (template.description) {
              resumeData = JSON.parse(template.description);
            }
          } catch (e) {
            // If parsing fails, use defaults
          }

          return {
            id: template.id,
            name: template.title || 'Untitled Template',
            category: template.category || 'Professional',
            hasHeadshot: true,
            hasGraphics: false,
            columns: resumeData.templateLayout === '2 Column' ? 2 : 1,
            color: (resumeData.templateColor || 'blue').toLowerCase(),
            recommended: false
          };
        });
        
        console.log('Processed database templates:', dbTemplates);
        this.allTemplates = [...dbTemplates, ...this.allTemplates];
      }
    } catch (error) {
      console.error('Error loading templates from database:', error);
    }
    
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
    
    // Check if it's user's own template
    if (template.isUserTemplate) {
      // Navigate to edit existing template
      this.router.navigate(['/resume'], { 
        queryParams: { 
          template: template.id,
          templateId: template.id,
          templateName: template.name,
          edit: 'true'
        } 
      }).then(() => {
        console.log('Successfully navigated to edit user template:', template.name);
      }).catch((error) => {
        console.error('Navigation failed:', error);
      });
    } else {
      // Navigate to create new template from default template
      this.router.navigate(['/resume'], { 
        queryParams: { 
          template: template.id,
          templateName: template.name,
          fromTemplates: 'true',
          forceLoad: 'true'
        } 
      }).then(() => {
        console.log('Successfully navigated to create from template:', template.name);
      }).catch((error) => {
        console.error('Navigation failed:', error);
      });
    }
  }

  previewTemplate(template: any): void {
    this.selectedTemplate = { ...template };
    this.showPreviewModal = true;
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.selectedTemplate = null;
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = '';
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

  downloadTemplate(template: any): void {
    // In a real application, this would download the template file
    // For now, we'll just show a success message
    this.showSuccessMessage = true;
    this.successMessage = `Downloading ${template.name} template...`;
    
    // Simulate download
    setTimeout(() => {
      this.successMessage = `${template.name} template downloaded successfully!`;
    }, 1000);

    // Hide the message after 5 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000);
  }

  editTemplate(template: any): void {
    // In a real application, this would open the template in an editor
    // For now, we'll navigate to the resume editor with the selected template
    this.router.navigate(['/resume'], { 
      queryParams: { 
        template: template.id,
        edit: 'true'
      } 
    }).then(() => {
      console.log('Opening template for editing:', template.name);
    }).catch((error) => {
      console.error('Navigation failed:', error);
    });
  }

  logout() {
    console.log('User logged out');
  }
}
