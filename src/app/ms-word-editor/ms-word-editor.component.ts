import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ms-word-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ms-word-editor.component.html',
  styleUrls: ['./ms-word-editor.component.css']
})
export class MsWordEditorComponent {
  zoomLevel = 100;
  showFileMenu = false;
  showTemplateModal = false;
  selectedTemplate = 'professional';
  
  styles = [
    { name: 'Normal', css: { 'font-size': '11pt', 'font-family': 'Calibri' } },
    { name: 'Heading 1', css: { 'font-size': '16pt', 'font-family': 'Calibri Light', 'color': '#2F5496' } },
    { name: 'Heading 2', css: { 'font-size': '13pt', 'font-family': 'Calibri Light', 'color': '#2F5496' } },
    { name: 'Title', css: { 'font-size': '28pt', 'font-family': 'Calibri Light' } }
  ];

  execCmd(command: string): void {
    document.execCommand(command, false);
  }

  applyStyle(style: any): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        Object.assign(span.style, style.css);
        try {
          range.surroundContents(span);
        } catch (e) {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    }
  }

  zoom(delta: number): void {
    this.zoomLevel = Math.max(50, Math.min(200, this.zoomLevel + delta));
    const page = document.querySelector('.page') as HTMLElement;
    if (page) {
      page.style.transform = `scale(${this.zoomLevel / 100})`;
    }
  }

  toggleFileMenu(): void {
    this.showFileMenu = !this.showFileMenu;
  }

  showTemplates(): void {
    this.showTemplateModal = true;
    this.showFileMenu = false;
  }

  closeTemplates(): void {
    this.showTemplateModal = false;
  }

  selectTemplate(template: string): void {
    this.selectedTemplate = template;
    this.loadTemplate(template);
    this.closeTemplates();
  }

  loadTemplate(template: string): void {
    const page = document.querySelector('.page') as HTMLElement;
    if (!page) return;

    const templates: any = {
      professional: `
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; color: #2c3e50;">YOUR NAME</h1>
          <p style="margin: 5px 0; color: #555;">📧 email@example.com | 📱 +91 1234567890 | 📍 City, State</p>
        </div>
        <h2 style="border-bottom: 2px solid #2c3e50; padding-bottom: 5px; color: #2c3e50;">PROFESSIONAL SUMMARY</h2>
        <p>Experienced professional with expertise in [your field].</p>
        <h2 style="border-bottom: 2px solid #2c3e50; padding-bottom: 5px; color: #2c3e50; margin-top: 20px;">WORK EXPERIENCE</h2>
        <h3 style="margin: 10px 0 5px;">Job Title - Company Name</h3>
        <p style="font-style: italic; color: #666;">Month Year - Present</p>
        <ul><li>Achievement 1</li><li>Achievement 2</li></ul>
      `,
      modern: `
        <div style="display: flex; gap: 20px;">
          <div style="width: 35%; background: #2c3e50; color: white; padding: 20px;">
            <h1 style="font-size: 24px;">YOUR NAME</h1>
            <p>Professional Title</p>
            <h3 style="margin-top: 20px;">CONTACT</h3>
            <p>📧 email@example.com<br>📱 +91 1234567890</p>
            <h3 style="margin-top: 20px;">SKILLS</h3>
            <ul><li>Skill 1</li><li>Skill 2</li></ul>
          </div>
          <div style="width: 65%; padding: 20px;">
            <h2>EXPERIENCE</h2>
            <h3>Job Title</h3>
            <p>Company | 2020 - Present</p>
            <ul><li>Achievement 1</li></ul>
          </div>
        </div>
      `,
      creative: `
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: #e74c3c; margin: 0 auto 10px;"></div>
          <h1 style="font-size: 32px; color: #e74c3c;">YOUR NAME</h1>
          <p style="color: #555;">Creative Professional</p>
        </div>
        <h2 style="color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px;">ABOUT ME</h2>
        <p>Creative professional with passion for design.</p>
        <h2 style="color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px; margin-top: 20px;">EXPERIENCE</h2>
        <h3>Position Title</h3>
        <p>Company | Year</p>
      `,
      minimal: `
        <h1 style="font-size: 36px; font-weight: 300; margin: 0;">Your Name</h1>
        <p style="color: #666; margin: 5px 0;">email@example.com | +91 1234567890</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <h2 style="font-size: 18px; font-weight: 400;">Experience</h2>
        <p><strong>Job Title</strong> - Company Name<br><span style="color: #666;">2020 - Present</span></p>
        <h2 style="font-size: 18px; font-weight: 400; margin-top: 20px;">Education</h2>
        <p><strong>Degree</strong> - University<br><span style="color: #666;">Year</span></p>
      `
    };

    page.innerHTML = templates[template] || templates.professional;
  }
}