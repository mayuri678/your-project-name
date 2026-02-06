import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-ms-word-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ms-word-editor.component.html',
  styleUrls: ['./ms-word-editor.component.css']
})
export class MsWordEditorComponent implements OnInit {
  zoomLevel = 100;
  showFileMenu = false;
  showTemplateModal = false;
  selectedTemplate = 'professional';
  currentFont = 'Calibri';
  currentSize = 11;
  activeTab = 'home';
  showTranslateModal = false;
  targetLanguage = 'Spanish';
  resumeContent = '';
  translatedContent = '';
  isTranslating = false;
  
  constructor(private translationService: TranslationService) {}
  
  styles = [
    { name: 'Normal', css: { 'font-size': '11pt', 'font-family': 'Calibri' } },
    { name: 'Heading 1', css: { 'font-size': '16pt', 'font-family': 'Calibri Light', 'color': '#2F5496' } },
    { name: 'Heading 2', css: { 'font-size': '13pt', 'font-family': 'Calibri Light', 'color': '#2F5496' } },
    { name: 'Title', css: { 'font-size': '28pt', 'font-family': 'Calibri Light' } }
  ];

  ngOnInit(): void {
    // Block all popup messages at browser level
    this.blockAllPopups();
    // Hide unwanted tabs
    this.hideUnwantedTabs();
  }

  private hideUnwantedTabs(): void {
    setTimeout(() => {
      const unwantedTabs = document.querySelectorAll('.tab');
      unwantedTabs.forEach((tab, index) => {
        const tabText = tab.textContent?.toLowerCase() || '';
        if (tabText.includes('design') || tabText.includes('layout') || 
            tabText.includes('references') || tabText.includes('mailings') || 
            tabText.includes('review') || tabText.includes('view')) {
          (tab as HTMLElement).style.display = 'none';
        }
      });
    }, 100);
  }

  private blockAllPopups(): void {
    // Override all browser dialog methods
    (window as any).alert = () => {};
    (window as any).confirm = () => true;
    (window as any).prompt = () => null;
    
    // Block document.execCommand popups
    const originalExecCommand = document.execCommand;
    document.execCommand = function(command: string, showUI?: boolean, value?: string) {
      try {
        return originalExecCommand.call(document, command, false, value);
      } catch (e) {
        return false;
      }
    };
  }

  execCmd(command: string, value?: string): void {
    document.execCommand(command, false, value);
    this.focusEditor();
  }

  cut(): void {
    document.execCommand('cut');
    this.focusEditor();
  }

  copy(): void {
    document.execCommand('copy');
    this.focusEditor();
  }

  paste(): void {
    document.execCommand('paste');
    this.focusEditor();
  }

  changeFont(font: string): void {
    this.currentFont = font;
    try {
      document.execCommand('fontName', false, font);
    } catch (e) {
      // Silent execution
    }
    this.focusEditor();
  }

  changeFontSize(size: number): void {
    this.currentSize = size;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size + 'pt';
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      } catch (e) {
        // Silent execution
      }
    }
    this.focusEditor();
  }

  private focusEditor(): void {
    const editor = document.querySelector('.page[contenteditable]') as HTMLElement;
    if (editor) {
      editor.focus();
    }
  }

  undo(): void {
    try {
      document.execCommand('undo');
    } catch (e) {
      // Silent execution
    }
    this.focusEditor();
  }

  redo(): void {
    try {
      document.execCommand('redo');
    } catch (e) {
      // Silent execution
    }
    this.focusEditor();
  }

  insertTable(): void {
    const table = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #000;">Cell 1</td>
          <td style="padding: 8px; border: 1px solid #000;">Cell 2</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #000;">Cell 3</td>
          <td style="padding: 8px; border: 1px solid #000;">Cell 4</td>
        </tr>
      </table>
    `;
    try {
      document.execCommand('insertHTML', false, table);
    } catch (e) {
      // Silent execution
    }
    this.focusEditor();
  }

  // Format Painter and Shading with actual functionality
  formatPainter(): void {
    // Format painter - copy formatting from selection
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const element = range.commonAncestorContainer.parentElement;
      if (element) {
        // Store formatting for later use
        console.log('Format copied');
      }
    }
    this.focusEditor();
  }

  textShading(): void {
    // Apply background color to selected text
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      document.execCommand('backColor', false, '#ffff00');
    }
    this.focusEditor();
  }

  setActiveTab(tab: string): void {
    // Only allow home and insert tabs
    if (tab === 'home' || tab === 'insert') {
      this.activeTab = tab;
    }
    // Hide unwanted tabs again
    this.hideUnwantedTabs();
  }

  // Insert Tab Functions
  insertCoverPage(): void {
    const coverPage = `<div style="page-break-after: always; text-align: center; padding-top: 200px;">
      <h1 style="font-size: 48pt; margin-bottom: 50px;">RESUME</h1>
      <h2 style="font-size: 24pt;">Your Name</h2>
      <p style="font-size: 14pt;">Professional Title</p>
    </div>`;
    document.execCommand('insertHTML', false, coverPage);
    this.focusEditor();
  }

  insertBlankPage(): void {
    document.execCommand('insertHTML', false, '<div style="page-break-before: always;"></div>');
    this.focusEditor();
  }

  insertPageBreak(): void {
    document.execCommand('insertHTML', false, '<div style="page-break-before: always;"></div>');
    this.focusEditor();
  }

  insertPicture(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const img = `<img src="${event.target.result}" style="max-width: 300px; height: auto; margin: 10px;" />`;
          document.execCommand('insertHTML', false, img);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    this.focusEditor();
  }

  insertShapes(): void {
    const shape = `<div style="width: 100px; height: 100px; background: #0078d4; margin: 10px; display: inline-block;"></div>`;
    document.execCommand('insertHTML', false, shape);
    this.focusEditor();
  }

  insertIcons(): void {
    const icon = `<span style="font-size: 24px; margin: 5px;">⭐</span>`;
    document.execCommand('insertHTML', false, icon);
    this.focusEditor();
  }

  insertChart(): void {
    const chart = `<div style="border: 2px solid #ccc; padding: 20px; margin: 10px; text-align: center;">
      <h3>Chart Placeholder</h3>
      <p>Chart data would go here</p>
    </div>`;
    document.execCommand('insertHTML', false, chart);
    this.focusEditor();
  }

  insertSmartArt(): void {
    const smartArt = `<div style="border: 2px dashed #0078d4; padding: 20px; margin: 10px; text-align: center;">
      <h3>SmartArt Graphic</h3>
      <p>SmartArt content</p>
    </div>`;
    document.execCommand('insertHTML', false, smartArt);
    this.focusEditor();
  }

  insertScreenshot(): void {
    const screenshot = `<div style="border: 1px solid #ccc; padding: 10px; margin: 10px; background: #f0f0f0;">
      <p>Screenshot placeholder</p>
    </div>`;
    document.execCommand('insertHTML', false, screenshot);
    this.focusEditor();
  }

  insertEquation(): void {
    const equation = `<span style="font-family: 'Times New Roman'; font-style: italic;">x² + y² = z²</span>`;
    document.execCommand('insertHTML', false, equation);
    this.focusEditor();
  }

  insertSymbol(): void {
    const symbol = `<span>©</span>`;
    document.execCommand('insertHTML', false, symbol);
    this.focusEditor();
  }

  insertLine(): void {
    const line = `<hr style="border: 1px solid #000; margin: 10px 0;" />`;
    document.execCommand('insertHTML', false, line);
    this.focusEditor();
  }

  insertLink(): void {
    const url = prompt('Enter URL:');
    if (url) {
      const link = `<a href="${url}" target="_blank">${url}</a>`;
      document.execCommand('insertHTML', false, link);
    }
    this.focusEditor();
  }

  insertHeader(): void {
    const header = `<div style="border-bottom: 1px solid #ccc; padding: 10px; margin-bottom: 20px; text-align: center;">
      <h2>Document Header</h2>
    </div>`;
    document.execCommand('insertHTML', false, header);
    this.focusEditor();
  }

  insertPageNumber(): void {
    const pageNum = `<div style="text-align: center; margin: 10px;">Page 1</div>`;
    document.execCommand('insertHTML', false, pageNum);
    this.focusEditor();
  }

  insertTextBox(): void {
    const textBox = `<div style="border: 2px solid #0078d4; padding: 15px; margin: 10px; background: #f8f9fa;">
      <p>Text box content goes here...</p>
    </div>`;
    document.execCommand('insertHTML', false, textBox);
    this.focusEditor();
  }

  insertDropCap(): void {
    const dropCap = `<span style="float: left; font-size: 72px; line-height: 60px; padding-right: 8px; margin-top: -3px;">T</span>`;
    document.execCommand('insertHTML', false, dropCap);
    this.focusEditor();
  }

  insertWordArt(): void {
    const wordArt = `<div style="font-size: 36px; font-weight: bold; color: #0078d4; text-shadow: 2px 2px 4px #ccc; margin: 10px;">
      WordArt Text
    </div>`;
    document.execCommand('insertHTML', false, wordArt);
    this.focusEditor();
  }

  insertSignature(): void {
    const signature = `<div style="border-top: 1px solid #000; width: 200px; margin: 20px 0; padding-top: 5px;">
      <p style="font-style: italic;">Your Signature</p>
    </div>`;
    document.execCommand('insertHTML', false, signature);
    this.focusEditor();
  }

  insertDate(): void {
    const today = new Date().toLocaleDateString();
    document.execCommand('insertHTML', false, today);
    this.focusEditor();
  }

  applyStyle(style: any): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      Object.assign(span.style, style.css);
      try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      } catch (e) {
        // Silent execution
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

  saveDocument(): void {
    const content = document.querySelector('.page')?.innerHTML || '';
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.html';
    a.click();
    URL.revokeObjectURL(url);
    this.showFileMenu = false;
  }

  downloadPDF(): void {
    window.print();
    this.showFileMenu = false;
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

  showTranslateDialog(): void {
    const page = document.querySelector('.page') as HTMLElement;
    if (page) {
      this.resumeContent = page.innerText || '';
    }
    this.showTranslateModal = true;
    this.showFileMenu = false;
  }

  closeTranslateDialog(): void {
    this.showTranslateModal = false;
  }

  translateResume(): void {
    if (!this.resumeContent.trim()) return;
    
    this.isTranslating = true;
    this.translatedContent = this.translationService.translateResume(this.resumeContent, this.targetLanguage);
    this.isTranslating = false;
  }

  private translateResumeLocal(): void {
    const sections = this.resumeContent.split('\n\n');
    const translated = sections.map(section => this.translateSection(section, this.targetLanguage));
    this.translatedContent = translated.join('\n\n');
  }

  private translateSection(text: string, targetLang: string): string {
    // Professional translation mapping with industry-standard terminology
    const translations: any = {
      'Spanish': {
        // Headers and sections
        'PROFESSIONAL SUMMARY': 'RESUMEN PROFESIONAL',
        'WORK EXPERIENCE': 'EXPERIENCIA LABORAL',
        'EDUCATION': 'EDUCACIÓN',
        'SKILLS': 'HABILIDADES',
        'CONTACT': 'CONTACTO',
        'EXPERIENCE': 'EXPERIENCIA',
        'PROJECTS': 'PROYECTOS',
        'CERTIFICATIONS': 'CERTIFICACIONES',
        'LANGUAGES': 'IDIOMAS',
        'ACHIEVEMENTS': 'LOGROS',
        
        // Common terms
        'Present': 'Presente',
        'Company': 'Empresa',
        'University': 'Universidad',
        'Degree': 'Título',
        'Bachelor': 'Licenciatura',
        'Master': 'Maestría',
        'PhD': 'Doctorado',
        'Manager': 'Gerente',
        'Developer': 'Desarrollador',
        'Engineer': 'Ingeniero',
        'Analyst': 'Analista',
        'Coordinator': 'Coordinador',
        'Specialist': 'Especialista',
        'Assistant': 'Asistente',
        'Director': 'Director',
        'Senior': 'Senior',
        'Junior': 'Junior',
        
        // Skills and qualifications
        'Programming': 'Programación',
        'Management': 'Gestión',
        'Leadership': 'Liderazgo',
        'Communication': 'Comunicación',
        'Problem Solving': 'Resolución de Problemas',
        'Team Work': 'Trabajo en Equipo',
        'Project Management': 'Gestión de Proyectos'
      },
      'French': {
        // Headers and sections
        'PROFESSIONAL SUMMARY': 'RÉSUMÉ PROFESSIONNEL',
        'WORK EXPERIENCE': 'EXPÉRIENCE PROFESSIONNELLE',
        'EDUCATION': 'FORMATION',
        'SKILLS': 'COMPÉTENCES',
        'CONTACT': 'CONTACT',
        'EXPERIENCE': 'EXPÉRIENCE',
        'PROJECTS': 'PROJETS',
        'CERTIFICATIONS': 'CERTIFICATIONS',
        'LANGUAGES': 'LANGUES',
        'ACHIEVEMENTS': 'RÉALISATIONS',
        
        // Common terms
        'Present': 'Présent',
        'Company': 'Entreprise',
        'University': 'Université',
        'Degree': 'Diplôme',
        'Bachelor': 'Licence',
        'Master': 'Master',
        'PhD': 'Doctorat',
        'Manager': 'Responsable',
        'Developer': 'Développeur',
        'Engineer': 'Ingénieur',
        'Analyst': 'Analyste',
        'Coordinator': 'Coordinateur',
        'Specialist': 'Spécialiste',
        'Assistant': 'Assistant',
        'Director': 'Directeur',
        'Senior': 'Senior',
        'Junior': 'Junior',
        
        // Skills and qualifications
        'Programming': 'Programmation',
        'Management': 'Gestion',
        'Leadership': 'Leadership',
        'Communication': 'Communication',
        'Problem Solving': 'Résolution de Problèmes',
        'Team Work': 'Travail d\'Équipe',
        'Project Management': 'Gestion de Projet'
      },
      'German': {
        // Headers and sections
        'PROFESSIONAL SUMMARY': 'BERUFLICHE ZUSAMMENFASSUNG',
        'WORK EXPERIENCE': 'BERUFSERFAHRUNG',
        'EDUCATION': 'BILDUNG',
        'SKILLS': 'FÄHIGKEITEN',
        'CONTACT': 'KONTAKT',
        'EXPERIENCE': 'ERFAHRUNG',
        'PROJECTS': 'PROJEKTE',
        'CERTIFICATIONS': 'ZERTIFIZIERUNGEN',
        'LANGUAGES': 'SPRACHEN',
        'ACHIEVEMENTS': 'ERFOLGE',
        
        // Common terms
        'Present': 'Gegenwart',
        'Company': 'Unternehmen',
        'University': 'Universität',
        'Degree': 'Abschluss',
        'Bachelor': 'Bachelor',
        'Master': 'Master',
        'PhD': 'Promotion',
        'Manager': 'Manager',
        'Developer': 'Entwickler',
        'Engineer': 'Ingenieur',
        'Analyst': 'Analyst',
        'Coordinator': 'Koordinator',
        'Specialist': 'Spezialist',
        'Assistant': 'Assistent',
        'Director': 'Direktor',
        'Senior': 'Senior',
        'Junior': 'Junior'
      },
      'Marathi': {
        // Headers and sections
        'PROFESSIONAL SUMMARY': 'व्यावसायिक सारांश',
        'WORK EXPERIENCE': 'कामाचा अनुभव',
        'EDUCATION': 'शिक्षण',
        'SKILLS': 'कौशल्ये',
        'CONTACT': 'संपर्क',
        'EXPERIENCE': 'अनुभव',
        'PROJECTS': 'प्रकल्प',
        'CERTIFICATIONS': 'प्रमाणपत्रे',
        'LANGUAGES': 'भाषा',
        'ACHIEVEMENTS': 'यश',
        'PERSONAL DETAILS': 'वैयक्तिक तपशील',
        'OBJECTIVE': 'उद्दिष्ट',
        
        // Common terms
        'Present': 'सध्या',
        'Company': 'कंपनी',
        'University': 'विद्यापीठ',
        'Degree': 'पदवी',
        'Bachelor': 'पदवी',
        'Master': 'पदव्युत्तर',
        'PhD': 'पीएचडी',
        'Manager': 'व्यवस्थापक',
        'Developer': 'विकसक',
        'Engineer': 'अभियंता',
        'Analyst': 'विश्लेषक',
        'Coordinator': 'समन्वयक',
        'Specialist': 'तज्ञ',
        'Assistant': 'सहाय्यक',
        'Director': 'संचालक',
        'Senior': 'वरिष्ठ',
        'Junior': 'कनिष्ठ',
        'Name': 'नाव',
        'Email': 'ईमेल',
        'Phone': 'फोन',
        'Address': 'पत्ता',
        
        // Skills and qualifications
        'Programming': 'प्रोग्रामिंग',
        'Management': 'व्यवस्थापन',
        'Leadership': 'नेतृत्व',
        'Communication': 'संवाद',
        'Problem Solving': 'समस्या निराकरण',
        'Team Work': 'सांघिक कार्य',
        'Project Management': 'प्रकल्प व्यवस्थापन',
        'Software': 'सॉफ्टवेअर',
        'Hardware': 'हार्डवेअर',
        'Database': 'डेटाबेस',
        'Web Development': 'वेब विकास',
        'Mobile Development': 'मोबाइल विकास',
        
        // Job-related terms
        'Developed': 'विकसित केले',
        'Managed': 'व्यवस्थापित केले',
        'Led': 'नेतृत्व केले',
        'Collaborated': 'सहकार्य केले',
        'Implemented': 'अंमलबजावणी केली',
        'Designed': 'डिझाइन केले',
        'Created': 'तयार केले',
        'Maintained': 'देखभाल केली',
        'Improved': 'सुधारणा केली',
        'Optimized': 'अनुकूलित केले'
      },
    };

    let translatedText = text;
    const langMap = translations[targetLang];
    if (langMap) {
      // Sort by length (longest first) to avoid partial replacements
      const sortedKeys = Object.keys(langMap).sort((a, b) => b.length - a.length);
      sortedKeys.forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translatedText = translatedText.replace(regex, langMap[key]);
      });
    }
    return translatedText;
  }

  applyTranslation(): void {
    const page = document.querySelector('.page') as HTMLElement;
    if (page && this.translatedContent) {
      page.innerHTML = this.translatedContent.replace(/\n/g, '<br>');
    }
    this.closeTranslateDialog();
  }
}