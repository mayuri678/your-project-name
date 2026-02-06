import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-editor.component.html',
  styleUrls: ['./word-editor.component.css']
})
export class WordEditorComponent implements OnInit {
  activeTab = 'home';
  zoomLevel = 100;
  
  // Formatting states
  isBold = false;
  isItalic = false;
  isUnderline = false;
  currentTextColor = '#000000';
  
  // UI states
  showTextColorPicker = false;
  showHighlightPicker = false;
  
  // Ruler marks
  horizontalRulerMarks: any[] = [];
  verticalRulerMarks: any[] = [];
  
  // Photo properties
  photoUrl: string | null = null;
  photoPosition = { x: 20, y: 20 };
  
  // Template modal
  showTemplateModal = false;
  selectedTemplate = 'professional';

  // Microsoft Word text styles
  textStyles = [
    { name: 'Normal', preview: 'AaBbCc', style: { 'font-size': '11pt', 'font-family': 'Calibri', 'color': '#000000' } },
    { name: 'No Spacing', preview: 'AaBbCc', style: { 'font-size': '11pt', 'font-family': 'Calibri', 'margin': '0', 'line-height': '1' } },
    { name: 'Heading 1', preview: 'AaBbCc', style: { 'font-size': '16pt', 'font-family': 'Calibri Light', 'color': '#2F5496', 'font-weight': 'normal' } },
    { name: 'Heading 2', preview: 'AaBbCc', style: { 'font-size': '13pt', 'font-family': 'Calibri Light', 'color': '#2F5496', 'font-weight': 'normal' } },
    { name: 'Title', preview: 'AaBbCc', style: { 'font-size': '28pt', 'font-family': 'Calibri Light', 'color': '#000000' } },
    { name: 'Subtitle', preview: 'AaBbCc', style: { 'font-size': '15pt', 'font-family': 'Calibri', 'color': '#595959' } },
    { name: 'Emphasis', preview: 'AaBbCc', style: { 'font-size': '11pt', 'font-family': 'Calibri', 'color': '#2F5496' } },
    { name: 'Strong', preview: 'AaBbCc', style: { 'font-size': '11pt', 'font-family': 'Calibri', 'font-weight': '700' } }
  ];
  
  visibleStyles = this.textStyles.slice(0, 6);

  ngOnInit(): void {
    this.initRulers();
    this.setupDocumentListeners();
  }

  initRulers(): void {
    // Horizontal ruler marks (every 0.5 inch, numbers every inch)
    this.horizontalRulerMarks = [];
    for (let i = 0; i <= 16; i++) { // 8 inches * 2 (every 0.5 inch)
      this.horizontalRulerMarks.push({
        position: i * 48, // 48px = 0.5 inch at 96 DPI
        showNumber: i % 2 === 0,
        number: i / 2
      });
    }
    
    // Vertical ruler marks
    this.verticalRulerMarks = [];
    for (let i = 0; i <= 22; i++) { // 11 inches * 2
      this.verticalRulerMarks.push({
        position: i * 48,
        showNumber: i % 2 === 0,
        number: i / 2
      });
    }
  }

  setupDocumentListeners(): void {
    // Listen for selection changes to update formatting states
    document.addEventListener('selectionchange', () => {
      this.updateFormattingStates();
    });
  }

  updateFormattingStates(): void {
    try {
      this.isBold = document.queryCommandState('bold');
      this.isItalic = document.queryCommandState('italic');
      this.isUnderline = document.queryCommandState('underline');
    } catch (e) {
      // Ignore errors
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.showTextColorPicker = false;
    this.showHighlightPicker = false;
  }

  // Clipboard operations
  cut(): void {
    document.execCommand('cut');
  }

  copy(): void {
    document.execCommand('copy');
  }

  paste(): void {
    document.execCommand('paste');
  }

  // Font operations
  changeFont(event: any): void {
    const font = event.target.value;
    document.execCommand('fontName', false, font);
  }

  changeFontSize(event: any): void {
    const size = event.target.value;
    document.execCommand('fontSize', false, '7'); // Reset to base
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style.fontSize = size + 'pt';
        try {
          range.surroundContents(span);
        } catch (e) {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    }
  }

  // Text formatting
  toggleBold(): void {
    document.execCommand('bold', false);
    this.updateFormattingStates();
  }

  toggleItalic(): void {
    document.execCommand('italic', false);
    this.updateFormattingStates();
  }

  toggleUnderline(): void {
    document.execCommand('underline', false);
    this.updateFormattingStates();
  }

  toggleStrikethrough(): void {
    document.execCommand('strikeThrough', false);
  }

  toggleSubscript(): void {
    document.execCommand('subscript', false);
  }

  toggleSuperscript(): void {
    document.execCommand('superscript', false);
  }

  changeTextColor(event: any): void {
    const color = event.target.value;
    this.currentTextColor = color;
    document.execCommand('foreColor', false, color);
    this.showTextColorPicker = false;
  }

  changeBackgroundColor(event: any): void {
    const color = event.target.value;
    document.execCommand('hiliteColor', false, color);
    this.showHighlightPicker = false;
  }

  // List operations
  toggleBulletList(): void {
    document.execCommand('insertUnorderedList', false);
  }

  toggleNumberList(): void {
    document.execCommand('insertOrderedList', false);
  }

  // Alignment operations
  alignLeft(): void {
    document.execCommand('justifyLeft', false);
  }

  alignCenter(): void {
    document.execCommand('justifyCenter', false);
  }

  alignRight(): void {
    document.execCommand('justifyRight', false);
  }

  alignJustify(): void {
    document.execCommand('justifyFull', false);
  }

  // Style operations
  applyStyleDirect(style: any): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        Object.assign(span.style, style.style);
        try {
          range.surroundContents(span);
        } catch (e) {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    }
  }

  // Zoom operations
  zoomIn(): void {
    if (this.zoomLevel < 200) {
      this.zoomLevel += 10;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 50) {
      this.zoomLevel -= 10;
    }
  }

  setZoom(event: any): void {
    this.zoomLevel = parseInt(event.target.value);
  }

  // Drag and drop methods
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDragStart(event: DragEvent): void {
    // Handle drag start
  }

  onDragEnd(event: DragEvent): void {
    // Handle drag end
  }

  // Photo methods
  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onPhotoSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Template methods
  showTemplates(): void {
    this.showTemplateModal = true;
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
          <div style="margin-top: 10px; font-size: 14px; color: #555;">
            <span>📧 your.email@example.com</span> | <span>📱 +91 1234567890</span> | <span>📍 City, State</span>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="border-bottom: 2px solid #2c3e50; padding-bottom: 5px; color: #2c3e50;">PROFESSIONAL SUMMARY</h2>
          <p style="margin-top: 10px; line-height: 1.6;">Experienced professional with expertise in [your field].</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="border-bottom: 2px solid #2c3e50; padding-bottom: 5px; color: #2c3e50;">WORK EXPERIENCE</h2>
          <h3 style="margin: 10px 0 5px 0;">Job Title - Company Name</h3>
          <p style="font-style: italic; color: #666;">Month Year - Present</p>
          <ul style="margin-top: 5px;"><li>Achievement 1</li><li>Achievement 2</li></ul>
        </div>
      `,
      modern: `
        <div style="display: flex; gap: 20px;">
          <div style="width: 35%; background: #2c3e50; color: white; padding: 20px;">
            <h1 style="font-size: 24px; margin: 0;">YOUR NAME</h1>
            <p style="font-size: 14px; margin-top: 5px;">Professional Title</p>
            <h3 style="margin-top: 20px; border-bottom: 1px solid white;">CONTACT</h3>
            <p>📧 email@example.com<br>📱 +91 1234567890</p>
            <h3 style="margin-top: 20px; border-bottom: 1px solid white;">SKILLS</h3>
            <ul><li>Skill 1</li><li>Skill 2</li><li>Skill 3</li></ul>
          </div>
          <div style="width: 65%; padding: 20px;">
            <h2 style="color: #2c3e50;">EXPERIENCE</h2>
            <h3>Job Title</h3>
            <p style="color: #666;">Company Name | 2020 - Present</p>
            <ul><li>Achievement 1</li><li>Achievement 2</li></ul>
          </div>
        </div>
      `,
      creative: `
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: #e74c3c; margin: 0 auto 10px;"></div>
          <h1 style="font-size: 32px; color: #e74c3c; margin: 0;">YOUR NAME</h1>
          <p style="font-size: 16px; color: #555;">Creative Professional</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px;">ABOUT ME</h2>
          <p style="line-height: 1.6;">Creative professional with passion for design and innovation.</p>
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px;">EXPERIENCE</h2>
          <h3>Position Title</h3>
          <p>Company | Year</p>
        </div>
      `,
      minimal: `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 36px; font-weight: 300; margin: 0;">Your Name</h1>
          <p style="font-size: 14px; color: #666; margin: 5px 0;">email@example.com | +91 1234567890</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        </div>
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 10px;">Experience</h2>
          <p style="line-height: 1.8;"><strong>Job Title</strong> - Company Name<br><span style="color: #666;">2020 - Present</span></p>
        </div>
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: 400; margin-bottom: 10px;">Education</h2>
          <p style="line-height: 1.8;"><strong>Degree</strong> - University<br><span style="color: #666;">Year</span></p>
        </div>
      `
    };

    page.innerHTML = templates[template] || templates.professional;
  }

  showTranslateDialog(): void {
    alert('Translate feature coming soon!');
  }

  saveResume(): void {
    console.log('Resume saved');
  }

  downloadResume(): void {
    console.log('Resume downloaded');
  }

  deletePhoto(event: Event): void {
    event.stopPropagation();
    this.photoUrl = null;
  }

  resetZoom(): void {
    this.zoomLevel = 100;
  }

  changeOrientation(): void {
    console.log('Orientation changed');
  }

  changeMargins(): void {
    console.log('Margins changed');
  }

  addSection(): void {
    console.log('Section added');
  }

  applyStyle(event: any): void {
    const styleName = event.target.value;
    const style = this.textStyles.find(s => s.name === styleName);
    if (style) {
      this.applyStyleDirect(style);
    }
  }

  showTableGrid = false;
  tableGrid: any[][] = [];
  selectedRows = 0;
  selectedCols = 0;

  showTableSelector(): void {
    this.showTableGrid = !this.showTableGrid;
    if (this.showTableGrid) {
      this.tableGrid = Array(8).fill(0).map(() => 
        Array(10).fill(0).map(() => ({ highlighted: false }))
      );
    }
  }

  highlightCells(row: number, col: number): void {
    this.selectedRows = row + 1;
    this.selectedCols = col + 1;
    this.tableGrid.forEach((r, i) => {
      r.forEach((c, j) => {
        c.highlighted = i <= row && j <= col;
      });
    });
  }

  insertTableWithSize(rows: number, cols: number): void {
    let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    for (let i = 0; i < rows; i++) {
      table += '<tr>';
      for (let j = 0; j < cols; j++) {
        table += '<td style="padding: 8px; border: 1px solid #000;">Cell</td>';
      }
      table += '</tr>';
    }
    table += '</table>';
    document.execCommand('insertHTML', false, table);
    this.showTableGrid = false;
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }

  insertLine(): void {
    document.execCommand('insertHTML', false, '<hr style="border: 1px solid #000;">');
  }
}