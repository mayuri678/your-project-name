import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router, private location: Location) {
    this.loadSavedDocs();
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
    this.router.navigate(['/word-editor']);
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
    
    const doc = {
      id: Date.now(),
      title,
      content,
      lastModified: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    this.savedDocs.push(doc);
    localStorage.setItem('helpDocs', JSON.stringify(this.savedDocs));
    alert('Document saved successfully!');
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
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearEditor(): void {
    if (confirm('Are you sure you want to clear the editor? This action cannot be undone.')) {
      const editor = document.getElementById('editor');
      if (editor) {
        editor.innerHTML = '<h1>Help Documentation</h1><p>Start typing your help documentation here...</p>';
      }
    }
  }
}
