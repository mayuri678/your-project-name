import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ResumeTemplatesService } from '../services/resume-templates.service';
import { SupabaseService } from '../services/supabase.service';

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
  activeTab = 'file';
  showRuler = false;
  showTemplateModal = false;
  selectedTemplate = 'professional';
  showTranslateDropdown = false;
  templateNames: string[] = [];
  languages = [
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'en', name: 'English' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'bn', name: 'বাংলা (Bengali)' }
  ];

  constructor(private router: Router, private location: Location, private templatesService: ResumeTemplatesService, private supabaseService: SupabaseService) {
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

  showTranslateDialog(): void {
    this.showTranslateDropdown = !this.showTranslateDropdown;
  }

  selectLanguage(language: any): void {
    const editor = document.getElementById('editor');
    if (editor) {
      // Get current template content
      const currentTemplate = this.templatesService.getTemplate(this.selectedTemplate);
      let translatedContent = currentTemplate;
      
      if (language.code === 'mr') {
        // Translate current template to Marathi - more comprehensive
        translatedContent = translatedContent
          .replace(/\bExecutive\b/gi, 'कार्यकारी')
          .replace(/\bResume\b/gi, 'बायोडेटा')
          .replace(/\bExperienced\b/gi, 'अनुभवी')
          .replace(/\bWith\b/gi, 'सह')
          .replace(/\bProven\b/gi, 'सिद्ध')
          .replace(/\bTrack\b/gi, 'ट्रॅक')
          .replace(/\bRecord\b/gi, 'रेकॉर्ड')
          .replace(/\bPresent\b/gi, 'सद्य')
          .replace(/\bKey\b/gi, 'मुख्य')
          .replace(/\bAchievement\b/gi, 'यश')
          .replace(/\bGraduation\b/gi, 'पदवीधर')
          .replace(/\bName\b/gi, 'नाव')
          .replace(/\bFull Name\b/gi, 'पूर्ण नाव')
          .replace(/\bExperience\b/gi, 'अनुभव')
          .replace(/\bWork Experience\b/gi, 'कामाचा अनुभव')
          .replace(/\bEducation\b/gi, 'शिक्षण')
          .replace(/\bSkills\b/gi, 'कौशल्ये')
          .replace(/\bTechnical Skills\b/gi, 'तांत्रिक कौशल्ये')
          .replace(/\bAddress\b/gi, 'पत्ता')
          .replace(/\bPhone\b/gi, 'फोन')
          .replace(/\bMobile\b/gi, 'मोबाइल')
          .replace(/\bEmail\b/gi, 'ईमेल')
          .replace(/\bObjective\b/gi, 'उद्दिष्ट')
          .replace(/\bCareer Objective\b/gi, 'करिअर उद्दिष्ट')
          .replace(/\bSummary\b/gi, 'सारांश')
          .replace(/\bProfessional Summary\b/gi, 'व्यावसायिक सारांश')
          .replace(/\bWork\b/gi, 'काम')
          .replace(/\bJob\b/gi, 'नोकरी')
          .replace(/\bCompany\b/gi, 'कंपनी')
          .replace(/\bProject\b/gi, 'प्रकल्प')
          .replace(/\bProjects\b/gi, 'प्रकल्प')
          .replace(/\bAchievements\b/gi, 'यश')
          .replace(/\bAwards\b/gi, 'पुरस्कार')
          .replace(/\bCertifications\b/gi, 'प्रमाणपत्रे')
          .replace(/\bLanguages\b/gi, 'भाषा')
          .replace(/\bHobbies\b/gi, 'छंद')
          .replace(/\bInterests\b/gi, 'आवडी')
          .replace(/\bReferences\b/gi, 'संदर्भ')
          .replace(/\bContact\b/gi, 'संपर्क')
          .replace(/\bProfile\b/gi, 'प्रोफाइल')
          .replace(/\bAbout\b/gi, 'बद्दल')
          .replace(/\bPersonal\b/gi, 'वैयक्तिक')
          .replace(/\bProfessional\b/gi, 'व्यावसायिक')
          .replace(/\bDeveloper\b/gi, 'डेव्हलपर')
          .replace(/\bEngineer\b/gi, 'अभियंता')
          .replace(/\bManager\b/gi, 'व्यवस्थापक')
          .replace(/\bYour\b/gi, 'तुमचे')
          .replace(/\bNav\b/gi, 'नाव')
          .replace(/\bHere\b/gi, 'येथे')
          .replace(/\bClick\b/gi, 'क्लिक')
          .replace(/\bStart\b/gi, 'सुरू')
          .replace(/\bTyping\b/gi, 'टाइपिंग')
          .replace(/\bText\b/gi, 'मजकूर')
          .replace(/\bContent\b/gi, 'आशय')
          .replace(/\bInformation\b/gi, 'माहिती')
          .replace(/\bDetails\b/gi, 'तपशील')
          .replace(/\bDescription\b/gi, 'वर्णन')
          .replace(/\bLocation\b/gi, 'ठिकाण')
          .replace(/\bDate\b/gi, 'तारीख')
          .replace(/\bYear\b/gi, 'वर्ष')
          .replace(/\bMonth\b/gi, 'महिना')
          .replace(/\bDegree\b/gi, 'पदवी')
          .replace(/\bUniversity\b/gi, 'विद्यापीठ')
          .replace(/\bCollege\b/gi, 'महाविद्यालय')
          .replace(/\bSchool\b/gi, 'शाळा')
          .replace(/\bPosition\b/gi, 'पद')
          .replace(/\bRole\b/gi, 'भूमिका')
          .replace(/\bTitle\b/gi, 'पदवी')
          .replace(/\bResponsibilities\b/gi, 'जबाबदार्या')
          .replace(/\bto\b/gi, 'ते')
          .replace(/\bthe\b/gi, '')
          .replace(/\band\b/gi, 'आणि')
          .replace(/\bof\b/gi, 'चे')
          .replace(/\bin\b/gi, 'मध्ये')
          .replace(/\bfor\b/gi, 'साठी')
          .replace(/\bwith\b/gi, 'सह')
          .replace(/\bat\b/gi, 'येथे')
          .replace(/\bis\b/gi, 'आहे')
          .replace(/\bwas\b/gi, 'होते')
          .replace(/\bhas\b/gi, 'आहे')
          .replace(/\bhave\b/gi, 'आहे')
          .replace(/\bwill\b/gi, 'होईल')
          .replace(/\bcan\b/gi, 'करू शकतो')
          .replace(/\bshould\b/gi, 'पाहिजे')
          .replace(/\bmust\b/gi, 'पाहिजे')
          .replace(/\bthis\b/gi, 'हे')
          .replace(/\bthat\b/gi, 'ते')
          .replace(/\bthese\b/gi, 'हे')
          .replace(/\bthose\b/gi, 'ते')
          .replace(/\bmy\b/gi, 'माझे')
          .replace(/\byour\b/gi, 'तुमचे')
          .replace(/\bhis\b/gi, 'त्याचे')
          .replace(/\bher\b/gi, 'तिचे')
          .replace(/\bour\b/gi, 'आमचे')
          .replace(/\btheir\b/gi, 'त्यांचे')
          .replace(/\bSkill\b/gi, 'कौशल्य')
          .replace(/\bTitle\b/gi, 'पदवी')
          .replace(/\bAchievement\b/gi, 'यश')
          .replace(/\bJob\b/gi, 'नोकरी')
          .replace(/\bCompany\b/gi, 'कंपनी')
          .replace(/\bContact\b/gi, 'संपर्क')
          .replace(/\bProfessional\b/gi, 'व्यावसायिक')
          .replace(/\bYOUR\b/gi, 'तुमचे')
          .replace(/\bनाम\b/gi, 'नाव')
          .replace(/1/g, '१')
          .replace(/2/g, '२')
          .replace(/3/g, '३')
          .replace(/4/g, '४')
          .replace(/5/g, '५')
          .replace(/6/g, '६')
          .replace(/7/g, '७')
          .replace(/8/g, '८')
          .replace(/9/g, '९')
          .replace(/0/g, '०')
          .replace(/@/g, '@')
          .replace(/\+/g, '+');
      } else if (language.code === 'hi') {
        // Translate current template to Hindi
        translatedContent = translatedContent
          .replace(/\bName\b/gi, 'नाम')
          .replace(/\bFull Name\b/gi, 'पूरा नाम')
          .replace(/\bExperience\b/gi, 'अनुभव')
          .replace(/\bWork Experience\b/gi, 'कार्य अनुभव')
          .replace(/\bEducation\b/gi, 'शिक्षा')
          .replace(/\bSkills\b/gi, 'कौशल')
          .replace(/\bTechnical Skills\b/gi, 'तकनीकी कौशल')
          .replace(/\bAddress\b/gi, 'पता')
          .replace(/\bPhone\b/gi, 'फोन')
          .replace(/\bMobile\b/gi, 'मोबाइल')
          .replace(/\bEmail\b/gi, 'ईमेल')
          .replace(/\bObjective\b/gi, 'उद्देश्य')
          .replace(/\bCareer Objective\b/gi, 'करियर उद्देश्य')
          .replace(/\bSummary\b/gi, 'सारांश')
          .replace(/\bProfessional Summary\b/gi, 'व्यावसायिक सारांश')
          .replace(/\bWork\b/gi, 'काम')
          .replace(/\bJob\b/gi, 'नौकरी')
          .replace(/\bCompany\b/gi, 'कंपनी')
          .replace(/\bProject\b/gi, 'परियोजना')
          .replace(/\bProjects\b/gi, 'परियोजनाएं')
          .replace(/\bAchievements\b/gi, 'उपलब्धियां')
          .replace(/\bAwards\b/gi, 'पुरस्कार')
          .replace(/\bCertifications\b/gi, 'प्रमाणपत्र')
          .replace(/\bLanguages\b/gi, 'भाषाएं')
          .replace(/\bHobbies\b/gi, 'शौक')
          .replace(/\bInterests\b/gi, 'रुचियां')
          .replace(/\bReferences\b/gi, 'संदर्भ')
          .replace(/\bContact\b/gi, 'संपर्क')
          .replace(/\bProfile\b/gi, 'प्रोफाइल')
          .replace(/\bAbout\b/gi, 'के बारे में')
          .replace(/\bPersonal\b/gi, 'व्यक्तिगत')
          .replace(/\bProfessional\b/gi, 'व्यावसायिक')
          .replace(/\bDeveloper\b/gi, 'डेवलपर')
          .replace(/\bEngineer\b/gi, 'इंजीनियर')
          .replace(/\bManager\b/gi, 'प्रबंधक')
      } else if (language.code === 'gu') {
        // Translate to Gujarati
        translatedContent = translatedContent
          .replace(/\bName\b/gi, 'નામ')
          .replace(/\bExperience\b/gi, 'અનુભવ')
          .replace(/\bEducation\b/gi, 'શિક્ષણ')
          .replace(/\bSkills\b/gi, 'કુશળતા')
          .replace(/\bAddress\b/gi, 'સરનામું')
          .replace(/\bPhone\b/gi, 'ફોન')
          .replace(/\bEmail\b/gi, 'ઈમેલ')
          .replace(/\bObjective\b/gi, 'ઉદ્દેશ્ય')
          .replace(/\bWork\b/gi, 'કામ')
          .replace(/\bCompany\b/gi, 'કંપની');
      } else if (language.code === 'ta') {
        // Translate to Tamil
        translatedContent = translatedContent
          .replace(/\bName\b/gi, 'பெயர்')
          .replace(/\bExperience\b/gi, 'அனுபவம்')
          .replace(/\bEducation\b/gi, 'கல்வி')
          .replace(/\bSkills\b/gi, 'திறன்கள்')
          .replace(/\bAddress\b/gi, 'முகவரி')
          .replace(/\bPhone\b/gi, 'தொலைபேசி')
          .replace(/\bEmail\b/gi, 'மின்னஞ்சல்')
          .replace(/\bObjective\b/gi, 'நோக்கம்')
          .replace(/\bWork\b/gi, 'வேலை')
          .replace(/\bCompany\b/gi, 'நிறுவனம்');
      } else if (language.code === 'te') {
        // Translate to Telugu
        translatedContent = translatedContent
          .replace(/\bName\b/gi, 'పేరు')
          .replace(/\bExperience\b/gi, 'అనుభవం')
          .replace(/\bEducation\b/gi, 'విద్య')
          .replace(/\bSkills\b/gi, 'నైపుణ్యాలు')
          .replace(/\bAddress\b/gi, 'చిరునామా')
          .replace(/\bPhone\b/gi, 'ఫోన్')
          .replace(/\bEmail\b/gi, 'ఇమెయిల్')
          .replace(/\bObjective\b/gi, 'లక్ష్యం')
          .replace(/\bWork\b/gi, 'పని')
          .replace(/\bCompany\b/gi, 'కంపెనీ');
      } else if (language.code === 'kn') {
        // Translate to Kannada
        translatedContent = translatedContent
          .replace(/\bName\b/gi, 'ಹೆಸರು')
          .replace(/\bExperience\b/gi, 'ಅನುಭವ')
          .replace(/\bEducation\b/gi, 'ಶಿಕ್ಷಣ')
          .replace(/\bSkills\b/gi, 'ಕೌಶಲ್ಯಗಳು')
          .replace(/\bAddress\b/gi, 'ವಿಳಾಸ')
          .replace(/\bPhone\b/gi, 'ಫೋನ್')
          .replace(/\bEmail\b/gi, 'ಇಮೇಲ್')
          .replace(/\bObjective\b/gi, 'ಉದ್ದೇಶ')
          .replace(/\bWork\b/gi, 'ಕೆಲಸ')
          .replace(/\bCompany\b/gi, 'ಕಂಪನಿ');
      } else if (language.code === 'bn') {
        // Translate to Bengali
        translatedContent = translatedContent
          .replace(/\bName\b/gi, 'নাম')
          .replace(/\bExperience\b/gi, 'অভিজ্ঞতা')
          .replace(/\bEducation\b/gi, 'শিক্ষা')
          .replace(/\bSkills\b/gi, 'দক্ষতা')
          .replace(/\bAddress\b/gi, 'ঠিকানা')
          .replace(/\bPhone\b/gi, 'ফোন')
          .replace(/\bEmail\b/gi, 'ইমেইল')
          .replace(/\bObjective\b/gi, 'উদ্দেশ্য')
          .replace(/\bWork\b/gi, 'কাজ')
          .replace(/\bCompany\b/gi, 'কোম্পানি');
      }
      
      editor.innerHTML = translatedContent;
      alert(`🌐 Template translated to ${language.name}`);
    }
    this.showTranslateDropdown = false;
  }

  saveDocument(): void {
    const title = prompt('Enter document title:') || 'Untitled';
    const content = document.getElementById('editor')?.innerHTML || '';
    
    if (content.trim() === '<h1>Help Documentation</h1><p>Start typing your help documentation here...</p>' || content.trim() === '') {
      alert('Please add some content before saving.');
      return;
    }
    
    // Save to backend using SupabaseService
    const templateData = {
      content: {
        name: title,
        html: content
      },
      templateId: this.selectedTemplate
    };
    
    this.supabaseService.saveTemplate(templateData).then(result => {
      if (result.error) {
        console.error('Error saving to backend:', result.error);
        // Fallback to localStorage if backend fails
        this.saveToLocalStorage(title, content);
        alert('Template saved locally (backend unavailable)');
      } else {
        console.log('Template saved to backend:', result.data);
        alert('Template saved to backend successfully!');
      }
    }).catch(error => {
      console.error('Exception saving to backend:', error);
      // Fallback to localStorage
      this.saveToLocalStorage(title, content);
      alert('Template saved locally (backend error)');
    });
  }
  
  private saveToLocalStorage(title: string, content: string): void {
    const savedTemplates = JSON.parse(localStorage.getItem('myTemplates') || '[]');
    const existingIndex = savedTemplates.findIndex((t: any) => t.name === this.selectedTemplate);
    
    if (existingIndex !== -1) {
      savedTemplates[existingIndex] = {
        ...savedTemplates[existingIndex],
        content: content,
        updatedAt: new Date().toISOString()
      };
    } else {
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
    }
    
    localStorage.setItem('myTemplates', JSON.stringify(savedTemplates));
    this.savedDocs.push({ id: Date.now(), title, content, lastModified: new Date().toLocaleDateString() });
    localStorage.setItem('helpDocs', JSON.stringify(this.savedDocs));
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
