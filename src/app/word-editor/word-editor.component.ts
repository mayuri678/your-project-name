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
}