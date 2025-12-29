import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserDataService } from '../services/user-data.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  userProfile = {
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    photo: '',
    website: '',
    linkedin: '',
    github: ''
  };

  preferences = {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'en',
    autoSave: true,
    templatePreview: true
  };

  privacy = {
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowDownloads: true,
    shareAnalytics: false
  };

  accountInfo = {
    memberSince: '',
    lastLogin: '',
    totalResumes: 0,
    accountType: 'Free'
  };

  isLoggedIn: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  currentLanguage: string = 'en';

  translations = {
    en: {
      settings: 'Settings',
      accountOverview: 'Account Overview',
      memberSince: 'Member Since',
      lastLogin: 'Last Login',
      totalResumes: 'Total Resumes',
      accountType: 'Account Type',
      profileInfo: 'Profile Information',
      fullName: 'Full Name',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      address: 'Address',
      bio: 'Bio',
      website: 'Website',
      linkedin: 'LinkedIn Profile',
      github: 'GitHub Profile',
      preferences: 'Preferences',
      notifications: 'Enable Notifications',
      emailUpdates: 'Email Updates',
      darkMode: 'Dark Mode',
      autoSave: 'Auto Save',
      templatePreview: 'Template Preview',
      language: 'Language',
      privacy: 'Privacy Settings',
      profileVisible: 'Make Profile Public',
      showEmail: 'Show Email Address',
      showPhone: 'Show Phone Number',
      allowDownloads: 'Allow Resume Downloads',
      shareAnalytics: 'Share Analytics Data',
      saveChanges: 'Save Changes',
      reset: 'Reset',
      exportData: 'Export Data',
      deleteAccount: 'Delete Account',
      viewProfile: 'View Profile'
    },
    hi: {
      settings: 'सेटिंग्स',
      accountOverview: 'खाता अवलोकन',
      memberSince: 'सदस्य बने',
      lastLogin: 'अंतिम लॉगिन',
      totalResumes: 'कुल रिज्यूमे',
      accountType: 'खाता प्रकार',
      profileInfo: 'प्रोफ़ाइल जानकारी',
      fullName: 'पूरा नाम',
      emailAddress: 'ईमेल पता',
      phoneNumber: 'फोन नंबर',
      address: 'पता',
      bio: 'बायो',
      website: 'वेबसाइट',
      linkedin: 'लिंक्डइन प्रोफ़ाइल',
      github: 'गिटहब प्रोफ़ाइल',
      preferences: 'प्राथमिकताएं',
      notifications: 'सूचनाएं सक्षम करें',
      emailUpdates: 'ईमेल अपडेट',
      darkMode: 'डार्क मोड',
      autoSave: 'ऑटो सेव',
      templatePreview: 'टेम्प्लेट पूर्वावलोकन',
      language: 'भाषा',
      privacy: 'गोपनीयता सेटिंग्स',
      profileVisible: 'प्रोफ़ाइल सार्वजनिक करें',
      showEmail: 'ईमेल पता दिखाएं',
      showPhone: 'फोन नंबर दिखाएं',
      allowDownloads: 'रिज्यूमे डाउनलोड की अनुमति दें',
      shareAnalytics: 'एनालिटिक्स डेटा साझा करें',
      saveChanges: 'परिवर्तन सहेजें',
      reset: 'रीसेट',
      exportData: 'डेटा निर्यात करें',
      deleteAccount: 'खाता हटाएं',
      viewProfile: 'प्रोफ़ाइल देखें'
    },
    mr: {
      settings: 'सेटिंग्ज',
      accountOverview: 'खाते चे विहंगावलोकन',
      memberSince: 'सदस्य झाल्यापासून',
      lastLogin: 'शेवटचे लॉगिन',
      totalResumes: 'एकूण रिज्यूमे',
      accountType: 'खाते प्रकार',
      profileInfo: 'प्रोफाइल माहिती',
      fullName: 'पूर्ण नाव',
      emailAddress: 'ईमेल पत्ता',
      phoneNumber: 'फोन नंबर',
      address: 'पत्ता',
      bio: 'बायो',
      website: 'वेबसाइट',
      linkedin: 'लिंक्डइन प्रोफाइल',
      github: 'गिटहब प्रोफाइल',
      preferences: 'प्राधान्ये',
      notifications: 'सूचना सक्षम करा',
      emailUpdates: 'ईमेल अपडेट',
      darkMode: 'डार्क मोड',
      autoSave: 'ऑटो सेव्ह',
      templatePreview: 'टेम्प्लेट पूर्वावलोकन',
      language: 'भाषा',
      privacy: 'गोपनीयता सेटिंग्ज',
      profileVisible: 'प्रोफाइल सार्वजनिक करा',
      showEmail: 'ईमेल पत्ता दाखवा',
      showPhone: 'फोन नंबर दाखवा',
      allowDownloads: 'रिज्यूमे डाउनलोडला परवानगी द्या',
      shareAnalytics: 'अॅनालिटिक्स डेटा शेअर करा',
      saveChanges: 'बदल जतन करा',
      reset: 'रीसेट',
      exportData: 'डेटा निर्यात करा',
      deleteAccount: 'खाते हटवा',
      viewProfile: 'प्रोफाइल पहा'
    }
  };

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserData();
    this.currentLanguage = this.preferences.language;
  }

  loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userProfile.name = currentUser.name;
      this.userProfile.email = currentUser.email;
      
      // Load profile data
      const profileData = this.userDataService.getUserData('profile');
      if (profileData) {
        this.userProfile = { ...this.userProfile, ...profileData };
      }
      
      // Load preferences
      const preferencesData = this.userDataService.getUserData('preferences');
      if (preferencesData) {
        this.preferences = { ...this.preferences, ...preferencesData };
      }
      
      // Load privacy settings
      const privacyData = this.userDataService.getUserData('privacy');
      if (privacyData) {
        this.privacy = { ...this.privacy, ...privacyData };
      }
      
      // Load account info
      this.loadAccountInfo(currentUser);
    }
  }

  loadAccountInfo(user: any): void {
    // Get member since date
    const memberSince = localStorage.getItem(`memberSince_${user.email}`);
    this.accountInfo.memberSince = memberSince || new Date().toLocaleDateString();
    
    // Get last login
    const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
    this.accountInfo.lastLogin = lastLogin || new Date().toLocaleDateString();
    
    // Get resume count using service
    this.accountInfo.totalResumes = this.userDataService.getResumeCount();
    
    // Set account type
    this.accountInfo.accountType = this.authService.isAdmin() ? 'Admin' : 'Free';
  }

  saveSettings(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Update current language
      this.currentLanguage = this.preferences.language;
      
      // Save each section separately using UserDataService
      this.userDataService.saveUserData('profile', this.userProfile);
      this.userDataService.saveUserData('preferences', this.preferences);
      this.userDataService.saveUserData('privacy', this.privacy);
      
      // Update last login time
      localStorage.setItem(`lastLogin_${currentUser.email}`, new Date().toLocaleDateString());
      
      this.successMessage = this.getTranslation('saveChanges') + ' successfully!';
      this.errorMessage = '';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  getTranslation(key: string): string {
    return this.translations[this.currentLanguage as keyof typeof this.translations][key as keyof typeof this.translations.en] || key;
  }

  onLanguageChange(): void {
    this.currentLanguage = this.preferences.language;
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings?')) {
      this.loadUserData();
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        // Clear all user data
        this.userDataService.clearCurrentUserData();
        
        // Remove additional data
        localStorage.removeItem(`memberSince_${currentUser.email}`);
        localStorage.removeItem(`lastLogin_${currentUser.email}`);
        
        // Logout user
        this.authService.logoutUser(currentUser.email);
        
        // Navigate to home
        this.router.navigate(['/home']);
        
        alert('Account deleted successfully!');
      }
    }
  }

  exportData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const allData = {
        profile: this.userProfile,
        preferences: this.preferences,
        privacy: this.privacy,
        accountInfo: this.accountInfo,
        resumeData: this.userDataService.getUserData('resumeData'),
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `resume-builder-data-${currentUser.email}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      this.successMessage = 'Data exported successfully!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  onLogout(): void {
    this.router.navigate(['/home']);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onAbout(): void {
    this.router.navigate(['/about']);
  }

  onResume(): void {
    this.router.navigate(['/resume']);
  }

  onTemplates(): void {
    this.router.navigate(['/templates']);
  }

  // Method to update resume count when user creates a resume
  updateResumeCount(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      // Mark that user has created a resume
      localStorage.setItem(`hasCreatedResume_${currentUser.email}`, 'true');
      
      // Reload account info to update count
      this.loadAccountInfo(currentUser);
    }
  }
}