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
}