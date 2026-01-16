import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ResumeTemplatesService } from '../services/resume-templates.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  showEditor = false;
  editorContent = '';
  savedDocs: any[] = [];
  searchQuery = '';
  activeTab = 'home';
  showRuler = false;
  showTemplateModal = false;
  selectedTemplate = 'professional';
  templateNames: string[] = [];

  constructor(private router: Router, private location: Location, private templatesService: ResumeTemplatesService) {
    this.loadSavedDocs();
    this.templateNames = this.templatesService.getTemplateNames();
  }

  goBack(): void {
    this.location.back();
  }

  goToResume(): void {
    this.router.navigate(['/blank-resume']);
  }

  goToTemplates(): void {
    this.router.navigate(['/my-templates']);
  }

  goToWordEditor(): void {
    this.showEditor = true;
  }

  toggleEditor(): void {
    this.showEditor = !this.showEditor;
  }

  formatText(command: string, value?: string): void {
    document.execCommand(command, false, value);
  }

  saveDocument(): void {
    const title = prompt('Enter document title:') || 'Untitled';
    const content = document.getElementById('editor')?.innerHTML || '';
    
    if (content.trim() === '<h1>Help Documentation</h1><p>Start typing your help documentation here...</p>' || content.trim() === '') {
      alert('Please add some content before saving.');
      return;
    }
    
    // Check if editing existing template
    const savedTemplates = JSON.parse(localStorage.getItem('myTemplates') || '[]');
    const existingIndex = savedTemplates.findIndex((t: any) => t.name === this.selectedTemplate);
    
    if (existingIndex !== -1) {
      // Update existing template
      savedTemplates[existingIndex] = {
        ...savedTemplates[existingIndex],
        content: content,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('myTemplates', JSON.stringify(savedTemplates));
      alert('Template updated successfully!');
    } else {
      // Save as new template
      const doc = {
        id: Date.now(),
        title,
        name: title,
        content,
        thumbnail: this.selectedTemplate,
        lastModified: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        createdAt: new Date().toISOString()
      };
      savedTemplates.push(doc);
      localStorage.setItem('myTemplates', JSON.stringify(savedTemplates));
      
      // Also save to helpDocs for backward compatibility
      this.savedDocs.push(doc);
      localStorage.setItem('helpDocs', JSON.stringify(this.savedDocs));
      
      alert('Document saved successfully!');
    }
  }

  loadDocument(doc: any): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.innerHTML = doc.content;
    }
  }

  deleteDocument(docId: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.savedDocs = this.savedDocs.filter(doc => doc.id !== docId);
      localStorage.setItem('helpDocs', JSON.stringify(this.savedDocs));
    }
  }

  private loadSavedDocs(): void {
    const saved = localStorage.getItem('helpDocs');
    if (saved) {
      this.savedDocs = JSON.parse(saved);
    }
  }

  exportDocument(): void {
    const content = document.getElementById('editor')?.innerHTML || '';
    
    if (!content || content.trim() === '') {
      alert('Please add content before downloading.');
      return;
    }

    // Save current edited content to My Templates
    const templateName = prompt('Enter template name:', this.selectedTemplate || 'My Resume');
    if (templateName) {
      const savedTemplates = JSON.parse(localStorage.getItem('myTemplates') || '[]');
      const newTemplate = {
        id: Date.now(),
        name: templateName,
        title: templateName,
        content: content,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        thumbnail: this.selectedTemplate,
        isLocalTemplate: true
      };
      savedTemplates.push(newTemplate);
      localStorage.setItem('myTemplates', JSON.stringify(savedTemplates));
      alert('✅ Template saved to My Templates!');
      
      // Download as HTML
      const blob = new Blob([content], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = templateName + '.html';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  }

  insertTable(): void {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let table = '<table border="1" style="border-collapse: collapse; width: 100%;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="padding: 8px; border: 1px solid #000;">Cell</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      document.execCommand('insertHTML', false, table);
    }
  }

  changeAlignment(align: string): void {
    document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1), false);
  }

  changeMargins(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const margin = prompt('Enter margin (e.g., 20px, 1in):', '20px');
      if (margin) {
        editor.style.padding = margin;
      }
    }
  }

  changeOrientation(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const current = editor.style.width;
      editor.style.width = current === '850px' ? '1100px' : '850px';
      alert('Orientation changed to ' + (current === '850px' ? 'Landscape' : 'Portrait'));
    }
  }

  zoomIn(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const current = parseFloat(window.getComputedStyle(editor).fontSize);
      editor.style.fontSize = (current + 2) + 'px';
    }
  }

  zoomOut(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const current = parseFloat(window.getComputedStyle(editor).fontSize);
      editor.style.fontSize = Math.max(8, current - 2) + 'px';
    }
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  insertHorizontalLine(): void {
    document.execCommand('insertHorizontalRule', false);
  }

  changeTextColor(): void {
    const color = prompt('Enter color (e.g., red, #ff0000):', '#000000');
    if (color) {
      document.execCommand('foreColor', false, color);
    }
  }

  changeBackgroundColor(): void {
    const color = prompt('Enter background color:', '#ffff00');
    if (color) {
      document.execCommand('backColor', false, color);
    }
  }

  insertHeading(level: number): void {
    document.execCommand('formatBlock', false, `h${level}`);
  }

  changeColumns(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const cols = prompt('Number of columns (1-3):', '1');
      if (cols) {
        editor.style.columnCount = cols;
        editor.style.columnGap = '20px';
      }
    }
  }

  changeLineSpacing(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const spacing = prompt('Line spacing (e.g., 1.5, 2):', '1.5');
      if (spacing) {
        editor.style.lineHeight = spacing;
      }
    }
  }

  toggleRuler(): void {
    this.showRuler = !this.showRuler;
  }

  changeViewMode(mode: string): void {
    alert(`View mode changed to: ${mode}`);
  }

  insertPageBreak(): void {
    document.execCommand('insertHTML', false, '<div style="page-break-after: always;"></div>');
  }

  clearFormatting(): void {
    document.execCommand('removeFormat', false);
  }

  undo(): void {
    document.execCommand('undo', false);
  }

  redo(): void {
    document.execCommand('redo', false);
  }

  // Additional Microsoft Word-like features
  copyText(): void {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      navigator.clipboard.writeText(selection.toString()).then(() => {
        alert('Text copied!');
      }).catch(() => {
        document.execCommand('copy', false);
      });
    } else {
      alert('Please select text first');
    }
  }

  cutText(): void {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      const text = selection.toString();
      navigator.clipboard.writeText(text).then(() => {
        document.execCommand('delete', false);
        alert('Text cut!');
      }).catch(() => {
        document.execCommand('cut', false);
      });
    } else {
      alert('Please select text first');
    }
  }

  pasteText(): void {
    navigator.clipboard.readText().then(text => {
      document.execCommand('insertText', false, text);
    }).catch(() => {
      alert('Use Ctrl+V to paste');
    });
  }

  formatPainter(): void {
    alert('Format Painter: Select text to copy formatting');
  }

  increaseFontSize(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const current = parseFloat(window.getComputedStyle(editor).fontSize);
      editor.style.fontSize = (current + 2) + 'px';
    }
  }

  decreaseFontSize(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      const current = parseFloat(window.getComputedStyle(editor).fontSize);
      editor.style.fontSize = Math.max(8, current - 2) + 'px';
    }
  }

  changeCase(): void {
    const selection = window.getSelection()?.toString();
    if (selection) {
      const upper = selection.toUpperCase();
      document.execCommand('insertText', false, upper);
    }
  }

  subscript(): void {
    document.execCommand('subscript', false);
  }

  superscript(): void {
    document.execCommand('superscript', false);
  }

  increaseIndent(): void {
    document.execCommand('indent', false);
  }

  decreaseIndent(): void {
    document.execCommand('outdent', false);
  }

  lineSpacing(value: string): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.lineHeight = value;
    }
  }

  shading(): void {
    const color = prompt('Enter shading color:', '#f0f0f0');
    if (color) {
      document.execCommand('backColor', false, color);
    }
  }

  borders(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.border = '1px solid #000';
      editor.style.padding = '10px';
    }
  }

  insertCoverPage(): void {
    const html = '<div style="page-break-after: always; text-align: center; padding: 100px 0;"><h1>Cover Page</h1><p>Document Title</p></div>';
    document.execCommand('insertHTML', false, html);
  }

  insertBlankPage(): void {
    document.execCommand('insertHTML', false, '<div style="page-break-after: always;"></div>');
  }

  insertShape(): void {
    const shape = prompt('Enter shape (circle, square, triangle):', 'circle');
    const html = `<div style="width: 100px; height: 100px; background: #4CAF50; border-radius: ${shape === 'circle' ? '50%' : '0'}; display: inline-block; margin: 10px;"></div>`;
    document.execCommand('insertHTML', false, html);
  }

  insertIcon(): void {
    const icon = prompt('Enter emoji/icon:', '⭐');
    if (icon) {
      document.execCommand('insertText', false, icon);
    }
  }

  insertChart(): void {
    alert('Chart feature: Would insert a chart here');
  }

  insertSmartArt(): void {
    alert('SmartArt feature: Would insert SmartArt graphics here');
  }

  insertScreenshot(): void {
    alert('Screenshot feature: Would capture and insert screenshot');
  }

  insertEquation(): void {
    const eq = prompt('Enter equation:', 'x² + y² = z²');
    if (eq) {
      document.execCommand('insertHTML', false, `<span style="font-style: italic;">${eq}</span>`);
    }
  }

  insertSymbol(): void {
    const symbol = prompt('Enter special character:', '©');
    if (symbol) {
      document.execCommand('insertText', false, symbol);
    }
  }

  insertDropCap(): void {
    alert('Drop Cap: Select first letter of paragraph');
  }

  insertTextBox(): void {
    const html = '<div style="border: 2px solid #000; padding: 20px; margin: 10px; display: inline-block; min-width: 200px;">Text Box</div>';
    document.execCommand('insertHTML', false, html);
  }

  insertWordArt(): void {
    const text = prompt('Enter WordArt text:', 'WordArt');
    if (text) {
      const html = `<div style="font-size: 48px; font-weight: bold; background: linear-gradient(45deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; margin: 10px;">${text}</div>`;
      document.execCommand('insertHTML', false, html);
    }
  }

  insertSignatureLine(): void {
    const html = '<div style="margin: 20px 0; border-top: 1px solid #000; width: 300px; padding-top: 5px;">Signature: _________________</div>';
    document.execCommand('insertHTML', false, html);
  }

  insertDate(): void {
    const date = new Date().toLocaleDateString();
    document.execCommand('insertText', false, date);
  }

  insertHeaderFooter(): void {
    alert('Header/Footer: Would add header and footer sections');
  }

  insertPageNumber(): void {
    const html = '<div style="text-align: center; margin: 10px 0;">Page 1</div>';
    document.execCommand('insertHTML', false, html);
  }

  changePageColor(): void {
    const editor = document.getElementById('editor');
    const color = prompt('Enter page color:', '#ffffff');
    if (editor && color) {
      editor.style.backgroundColor = color;
    }
  }

  changePageSize(): void {
    const editor = document.getElementById('editor');
    const size = prompt('Enter size (A4, Letter, Legal):', 'A4');
    if (editor) {
      if (size === 'Letter') {
        editor.style.width = '816px';
      } else if (size === 'Legal') {
        editor.style.width = '816px';
      } else {
        editor.style.width = '850px';
      }
    }
  }

  addWatermark(): void {
    const text = prompt('Enter watermark text:', 'CONFIDENTIAL');
    if (text) {
      const editor = document.getElementById('editor');
      if (editor) {
        editor.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='rgba(0,0,0,0.1)' text-anchor='middle' transform='rotate(-45 250 250)'%3E${text}%3C/text%3E%3C/svg%3E")`;
        editor.style.backgroundRepeat = 'repeat';
      }
    }
  }

  insertFootnote(): void {
    const note = prompt('Enter footnote text:');
    if (note) {
      const html = `<sup>[1]</sup><div style="font-size: 10px; border-top: 1px solid #ccc; margin-top: 20px; padding-top: 5px;">[1] ${note}</div>`;
      document.execCommand('insertHTML', false, html);
    }
  }

  insertEndnote(): void {
    const note = prompt('Enter endnote text:');
    if (note) {
      const html = `<sup>[i]</sup><div style="font-size: 10px; margin-top: 20px;">[i] ${note}</div>`;
      document.execCommand('insertHTML', false, html);
    }
  }

  insertCaption(): void {
    const caption = prompt('Enter caption:', 'Figure 1');
    if (caption) {
      const html = `<div style="text-align: center; font-size: 12px; font-style: italic; margin: 5px 0;">${caption}</div>`;
      document.execCommand('insertHTML', false, html);
    }
  }

  insertTableOfContents(): void {
    const html = '<div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;"><h2>Table of Contents</h2><ol><li>Introduction</li><li>Main Content</li><li>Conclusion</li></ol></div>';
    document.execCommand('insertHTML', false, html);
  }

  insertBibliography(): void {
    const html = '<div style="margin: 20px 0;"><h3>Bibliography</h3><ol><li>Reference 1</li><li>Reference 2</li></ol></div>';
    document.execCommand('insertHTML', false, html);
  }

  insertCitation(): void {
    const citation = prompt('Enter citation:', '(Author, Year)');
    if (citation) {
      document.execCommand('insertText', false, citation);
    }
  }

  readingMode(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.maxWidth = '100%';
      editor.style.padding = '50px';
      alert('Reading mode activated');
    }
  }

  printLayout(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.maxWidth = '850px';
      editor.style.padding = '3rem 2.5rem';
    }
  }

  webLayout(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.maxWidth = '100%';
      editor.style.padding = '20px';
    }
  }

  outlineView(): void {
    alert('Outline view: Would show document outline');
  }

  draftView(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.boxShadow = 'none';
      editor.style.border = '1px solid #ccc';
    }
  }

  showGridlines(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.backgroundImage = 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)';
      editor.style.backgroundSize = '20px 20px';
    }
  }

  showNavigationPane(): void {
    alert('Navigation Pane: Would show document navigation');
  }

  zoom100(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.fontSize = '11pt';
      editor.style.transform = 'scale(1)';
    }
  }

  zoom150(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.transform = 'scale(1.5)';
      editor.style.transformOrigin = 'top left';
    }
  }

  zoom200(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.transform = 'scale(2)';
      editor.style.transformOrigin = 'top left';
    }
  }

  fitToWindow(): void {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.width = '100%';
      editor.style.maxWidth = '100%';
    }
  }

  multiplePages(): void {
    alert('Multiple Pages: Would show multiple pages side by side');
  }

  splitWindow(): void {
    alert('Split Window: Would split the editing window');
  }

  newWindow(): void {
    alert('New Window: Would open document in new window');
  }

  switchWindows(): void {
    alert('Switch Windows: Would switch between open documents');
  }

  macros(): void {
    alert('Macros: Would open macro editor');
  }

  clearEditor(): void {
    if (confirm('Are you sure you want to clear the editor? This action cannot be undone.')) {
      const editor = document.getElementById('editor');
      if (editor) {
        editor.innerHTML = '<h1>Help Documentation</h1><p>Start typing your help documentation here...</p>';
      }
    }
  }

  getDisplayName(templateName: string): string {
    return templateName.replace(/[0-9]/g, '').replace(/([A-Z])/g, ' $1').trim()
      .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getPreviewClass(templateName: string): string {
    if (templateName.includes('modern') || templateName.includes('tech') || templateName.includes('developer')) return 'modern';
    if (templateName.includes('creative') || templateName.includes('artist') || templateName.includes('designer')) return 'creative';
    if (templateName.includes('minimal') || templateName.includes('simple') || templateName.includes('elegant')) return 'minimal';
    return 'professional';
  }

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
    const editor = document.getElementById('editor');
    if (!editor) return;
    editor.innerHTML = this.templatesService.getTemplate(template);
  }
}
