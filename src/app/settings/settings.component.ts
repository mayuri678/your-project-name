import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface AppSettings {
  // Notifications
  notifications: boolean;
  emailNotifications: boolean;
  resumeUpdates: boolean;
  templateRecommendations: boolean;
  weeklyDigest: boolean;
  
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  compactMode: boolean;
  
  // Language & Region
  language: string;
  dateFormat: string;
  timezone: string;
  currency: string;
  
  // Resume Builder
  autoSave: boolean;
  autoSaveInterval: number;
  defaultTemplate: string;
  defaultFormat: 'pdf' | 'docx' | 'html';
  showTips: boolean;
  spellCheck: boolean;
  
  // Privacy
  profileVisibility: 'public' | 'private' | 'contacts';
  shareAnalytics: boolean;
  allowDataCollection: boolean;
  showEmailPublicly: boolean;
  
  // Export & Download
  exportQuality: 'standard' | 'high' | 'premium';
  includeWatermark: boolean;
  defaultFileName: string;
  compressExports: boolean;
  
  // Accessibility
  highContrast: boolean;
  screenReader: boolean;
  keyboardShortcuts: boolean;
  reduceAnimations: boolean;
  
  // Performance
  cacheEnabled: boolean;
  offlineMode: boolean;
  imageOptimization: boolean;
  
  // Data Management
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    // Notifications
    notifications: true,
    emailNotifications: true,
    resumeUpdates: true,
    templateRecommendations: true,
    weeklyDigest: false,
    
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    fontFamily: 'default',
    compactMode: false,
    
    // Language & Region
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
    currency: 'USD',
    
    // Resume Builder
    autoSave: true,
    autoSaveInterval: 30,
    defaultTemplate: 'modern',
    defaultFormat: 'pdf',
    showTips: true,
    spellCheck: true,
    
    // Privacy
    profileVisibility: 'private',
    shareAnalytics: false,
    allowDataCollection: false,
    showEmailPublicly: false,
    
    // Export & Download
    exportQuality: 'high',
    includeWatermark: false,
    defaultFileName: 'resume',
    compressExports: true,
    
    // Accessibility
    highContrast: false,
    screenReader: false,
    keyboardShortcuts: true,
    reduceAnimations: false,
    
    // Performance
    cacheEnabled: true,
    offlineMode: false,
    imageOptimization: true,
    
    // Data Management
    autoBackup: true,
    backupFrequency: 'weekly',
    dataRetention: 365
  };

  isEditing: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadSettings();
  }

  loadSettings(): void {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reload settings when canceling edit
      this.loadSettings();
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  saveSettings(): void {
    try {
      // Save settings to localStorage
      localStorage.setItem('appSettings', JSON.stringify(this.settings));
      this.successMessage = 'Settings saved successfully!';
      this.errorMessage = '';
      this.isEditing = false;
      
      // Apply theme if changed
      this.applyTheme();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } catch (e) {
      this.errorMessage = 'Failed to save settings. Please try again.';
      console.error('Error saving settings:', e);
    }
  }

  applyTheme(): void {
    // Apply theme to document
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    
    if (this.settings.theme === 'dark') {
      body.classList.add('theme-dark');
    } else if (this.settings.theme === 'light') {
      body.classList.add('theme-light');
    } else {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  clearCache(): void {
    if (confirm('Are you sure you want to clear the cache? This may improve performance but will require reloading data.')) {
      localStorage.removeItem('cache');
      this.successMessage = 'Cache cleared successfully!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  exportSettings(): void {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-builder-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    this.successMessage = 'Settings exported successfully!';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  importSettings(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          this.settings = { ...this.settings, ...imported };
          this.successMessage = 'Settings imported successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } catch (err) {
          this.errorMessage = 'Failed to import settings. Invalid file format.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      };
      reader.readAsText(file);
    }
  }

  resetToDefaults(): void {
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      const defaults: AppSettings = {
        notifications: true,
        emailNotifications: true,
        resumeUpdates: true,
        templateRecommendations: true,
        weeklyDigest: false,
        theme: 'light',
        fontSize: 'medium',
        fontFamily: 'default',
        compactMode: false,
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timezone: 'UTC',
        currency: 'USD',
        autoSave: true,
        autoSaveInterval: 30,
        defaultTemplate: 'modern',
        defaultFormat: 'pdf',
        showTips: true,
        spellCheck: true,
        profileVisibility: 'private',
        shareAnalytics: false,
        allowDataCollection: false,
        showEmailPublicly: false,
        exportQuality: 'high',
        includeWatermark: false,
        defaultFileName: 'resume',
        compressExports: true,
        highContrast: false,
        screenReader: false,
        keyboardShortcuts: true,
        reduceAnimations: false,
        cacheEnabled: true,
        offlineMode: false,
        imageOptimization: true,
        autoBackup: true,
        backupFrequency: 'weekly',
        dataRetention: 365
      };
      this.settings = defaults;
      this.saveSettings();
    }
  }
}

