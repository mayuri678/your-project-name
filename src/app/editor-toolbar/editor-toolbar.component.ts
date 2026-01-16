import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editor-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-toolbar">
      <!-- File Operations -->
      <div class="toolbar-section">
        <button class="toolbar-btn primary" (click)="onNewDocument()" title="New Document">
          📄 New
        </button>
        <input type="file" #fileInput (change)="onLoadDocument($event)" accept=".json" style="display: none;">
        <button class="toolbar-btn" (click)="fileInput.click()" title="Open Document">
          📂 Open
        </button>
        <button class="toolbar-btn success" (click)="onSaveDocument()" title="Save Document">
          💾 Save
        </button>
      </div>

      <!-- Edit Operations -->
      <div class="toolbar-section">
        <button class="toolbar-btn" (click)="onUndo()" title="Undo">
          ↶
        </button>
        <button class="toolbar-btn" (click)="onRedo()" title="Redo">
          ↷
        </button>
      </div>

      <!-- Font Controls -->
      <div class="toolbar-section">
        <select class="font-select" (change)="onFontChange($event.target.value)">
          <option *ngFor="let font of fontFamilies" [value]="font">{{ font }}</option>
        </select>
        <select class="size-select" (change)="onFontSizeChange($event.target.value)">
          <option *ngFor="let size of fontSizes" [value]="size">{{ size }}</option>
        </select>
      </div>

      <!-- Format Controls -->
      <div class="toolbar-section">
        <button class="format-btn" (click)="onBold()" title="Bold">
          <strong>B</strong>
        </button>
        <button class="format-btn" (click)="onItalic()" title="Italic">
          <em>I</em>
        </button>
        <button class="format-btn" (click)="onUnderline()" title="Underline">
          <u>U</u>
        </button>
        <button class="format-btn" (click)="onStrikethrough()" title="Strikethrough">
          <s>S</s>
        </button>
      </div>

      <!-- Color Controls -->
      <div class="toolbar-section">
        <input type="color" class="color-picker" (change)="onTextColor($event.target.value)" value="#000000" title="Text Color">
        <input type="color" class="color-picker" (change)="onHighlightColor($event.target.value)" value="#ffff00" title="Highlight Color">
      </div>

      <!-- Alignment -->
      <div class="toolbar-section">
        <button class="align-btn" (click)="onAlign('left')" title="Align Left">⬅️</button>
        <button class="align-btn" (click)="onAlign('center')" title="Center">↔️</button>
        <button class="align-btn" (click)="onAlign('right')" title="Align Right">➡️</button>
        <button class="align-btn" (click)="onAlign('justify')" title="Justify">⬌</button>
      </div>

      <!-- Lists -->
      <div class="toolbar-section">
        <button class="list-btn" (click)="onBulletList()" title="Bullet List">• List</button>
        <button class="list-btn" (click)="onNumberedList()" title="Numbered List">1. List</button>
      </div>

      <!-- Export -->
      <div class="toolbar-section">
        <button class="export-btn" (click)="onExportPDF()" title="Export to PDF">📄 PDF</button>
        <button class="export-btn" (click)="onExportDocx()" title="Export to DOCX">📝 DOCX</button>
        <button class="toolbar-btn" (click)="onPrint()" title="Print">🖨️ Print</button>
      </div>

      <!-- Zoom -->
      <div class="toolbar-section">
        <button class="zoom-btn" (click)="onZoomOut()" title="Zoom Out">🔍-</button>
        <span class="zoom-display">{{ zoomLevel }}%</span>
        <button class="zoom-btn" (click)="onZoomIn()" title="Zoom In">🔍+</button>
      </div>
    </div>
  `,
  styles: [`
    .editor-toolbar {
      background: white;
      border-bottom: 1px solid #d1d1d1;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 8px;
      border-right: 1px solid #e1e1e1;
    }

    .toolbar-section:last-child {
      border-right: none;
    }

    .toolbar-btn, .format-btn, .align-btn, .list-btn, .export-btn, .zoom-btn {
      padding: 6px 12px;
      border: 1px solid #d1d1d1;
      background: white;
      cursor: pointer;
      border-radius: 3px;
      font-size: 12px;
      transition: all 0.2s;
    }

    .toolbar-btn:hover, .format-btn:hover, .align-btn:hover, .list-btn:hover, .export-btn:hover, .zoom-btn:hover {
      background: #f3f2f1;
      border-color: #0078d4;
    }

    .toolbar-btn.primary {
      background: #0078d4;
      color: white;
      border-color: #0078d4;
    }

    .toolbar-btn.success {
      background: #28a745;
      color: white;
      border-color: #28a745;
    }

    .format-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .font-select, .size-select {
      padding: 4px 8px;
      border: 1px solid #d1d1d1;
      border-radius: 3px;
      background: white;
      font-size: 12px;
    }

    .font-select {
      min-width: 120px;
    }

    .size-select {
      min-width: 60px;
    }

    .color-picker {
      width: 32px;
      height: 24px;
      border: 1px solid #d1d1d1;
      border-radius: 3px;
      cursor: pointer;
      padding: 0;
    }

    .zoom-display {
      font-size: 12px;
      color: #666;
      min-width: 40px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .editor-toolbar {
        padding: 6px 12px;
        gap: 8px;
      }

      .toolbar-section {
        padding: 0 4px;
        gap: 2px;
      }

      .font-select {
        min-width: 100px;
      }
    }
  `]
})
export class EditorToolbarComponent {
  @Input() fontFamilies: string[] = [];
  @Input() fontSizes: number[] = [];
  @Input() zoomLevel: number = 100;

  @Output() newDocument = new EventEmitter<void>();
  @Output() loadDocument = new EventEmitter<any>();
  @Output() saveDocument = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();
  @Output() fontChange = new EventEmitter<string>();
  @Output() fontSizeChange = new EventEmitter<number>();
  @Output() bold = new EventEmitter<void>();
  @Output() italic = new EventEmitter<void>();
  @Output() underline = new EventEmitter<void>();
  @Output() strikethrough = new EventEmitter<void>();
  @Output() textColor = new EventEmitter<string>();
  @Output() highlightColor = new EventEmitter<string>();
  @Output() align = new EventEmitter<string>();
  @Output() bulletList = new EventEmitter<void>();
  @Output() numberedList = new EventEmitter<void>();
  @Output() exportPDF = new EventEmitter<void>();
  @Output() exportDocx = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();

  onNewDocument() { this.newDocument.emit(); }
  onLoadDocument(event: any) { this.loadDocument.emit(event); }
  onSaveDocument() { this.saveDocument.emit(); }
  onUndo() { this.undo.emit(); }
  onRedo() { this.redo.emit(); }
  onFontChange(font: string) { this.fontChange.emit(font); }
  onFontSizeChange(size: string) { this.fontSizeChange.emit(Number(size)); }
  onBold() { this.bold.emit(); }
  onItalic() { this.italic.emit(); }
  onUnderline() { this.underline.emit(); }
  onStrikethrough() { this.strikethrough.emit(); }
  onTextColor(color: string) { this.textColor.emit(color); }
  onHighlightColor(color: string) { this.highlightColor.emit(color); }
  onAlign(alignment: string) { this.align.emit(alignment); }
  onBulletList() { this.bulletList.emit(); }
  onNumberedList() { this.numberedList.emit(); }
  onExportPDF() { this.exportPDF.emit(); }
  onExportDocx() { this.exportDocx.emit(); }
  onPrint() { this.print.emit(); }
  onZoomIn() { this.zoomIn.emit(); }
  onZoomOut() { this.zoomOut.emit(); }
}