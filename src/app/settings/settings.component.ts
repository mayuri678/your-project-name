import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserDataService } from '../services/user-data.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { HeaderComponent } from '../header/header.component';
import { ForgotPasswordModalComponent } from '../forgot-password/forgot-password-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ForgotPasswordModalComponent],
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

  originalEmail: string = '';

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

  showChangePassword: boolean = false;
  showForgotPasswordModal: boolean = false;
  changePasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  passwordChangeMessage: string = '';
  passwordChangeError: string = '';
  isChangingPassword: boolean = false;

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
      viewProfile: 'View Profile',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updatePassword: 'Update Password',
      cancel: 'Cancel'
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
      viewProfile: 'प्रोफ़ाइल देखें',
      changePassword: 'पासवर्ड बदलें',
      currentPassword: 'वर्तमान पासवर्ड',
      newPassword: 'नया पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      updatePassword: 'पासवर्ड अपडेट करें',
      cancel: 'रद्द करें'
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
      viewProfile: 'प्रोफाइल पहा',
      changePassword: 'पासवर्ड बदला',
      currentPassword: 'सध्याचा पासवर्ड',
      newPassword: 'नवीन पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टी करा',
      updatePassword: 'पासवर्ड अपडेट करा',
      cancel: 'रद्द करा'
    }
  };

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private supabaseAuthService: SupabaseAuthService,
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
      this.originalEmail = currentUser.email;
      
      const profileData = this.userDataService.getUserData('profile');
      if (profileData) {
        this.userProfile = { ...this.userProfile, ...profileData };
      }
      
      const preferencesData = this.userDataService.getUserData('preferences');
      if (preferencesData) {
        this.preferences = { ...this.preferences, ...preferencesData };
      }
      
      const privacyData = this.userDataService.getUserData('privacy');
      if (privacyData) {
        this.privacy = { ...this.privacy, ...privacyData };
      }
      
      this.loadAccountInfo(currentUser);
    }
  }

  loadAccountInfo(user: any): void {
    const memberSince = localStorage.getItem(`memberSince_${user.email}`);
    this.accountInfo.memberSince = memberSince || new Date().toLocaleDateString();
    
    const lastLogin = localStorage.getItem(`lastLogin_${user.email}`);
    this.accountInfo.lastLogin = lastLogin || new Date().toLocaleDateString();
    
    this.accountInfo.totalResumes = this.userDataService.getResumeCount();
    this.accountInfo.accountType = this.authService.isAdmin() ? 'Admin' : 'Free';
  }

  async saveSettings(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Please login first.';
      return;
    }

    this.currentLanguage = this.preferences.language;
    
    const settingsData = {
      user_email: this.originalEmail,
      full_name: this.userProfile.name,
      phone: this.userProfile.phone,
      address: this.userProfile.address,
      bio: this.userProfile.bio,
      website: this.userProfile.website,
      linkedin: this.userProfile.linkedin,
      github: this.userProfile.github,
      notifications: this.preferences.notifications,
      email_updates: this.preferences.emailUpdates,
      dark_mode: this.preferences.darkMode,
      language: this.preferences.language,
      auto_save: this.preferences.autoSave,
      template_preview: this.preferences.templatePreview,
      profile_visible: this.privacy.profileVisible,
      show_email: this.privacy.showEmail,
      show_phone: this.privacy.showPhone,
      allow_downloads: this.privacy.allowDownloads,
      share_analytics: this.privacy.shareAnalytics,
      last_login: new Date().toISOString(),
      total_resumes: this.accountInfo.totalResumes,
      account_type: this.accountInfo.accountType
    };
    
    this.saveToLocalStorage();
    
    try {
      const { data, error } = await this.supabaseAuthService.saveUserSettings(settingsData);
      
      if (error) {
        this.successMessage = 'Settings saved locally (backend unavailable).';
      } else {
        this.successMessage = this.getTranslation('saveChanges') + ' successfully!';
      }
    } catch (error) {
      this.successMessage = 'Settings saved locally.';
    }
    
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  goToChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    if (this.showChangePassword) {
      this.changePasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.passwordChangeMessage = '';
      this.passwordChangeError = '';
    }
  }

  async submitChangePassword(): Promise<void> {
    this.passwordChangeMessage = '';
    this.passwordChangeError = '';

    if (!this.changePasswordForm.currentPassword || !this.changePasswordForm.newPassword || !this.changePasswordForm.confirmPassword) {
      this.passwordChangeError = 'All fields are required';
      return;
    }

    if (this.changePasswordForm.newPassword !== this.changePasswordForm.confirmPassword) {
      this.passwordChangeError = 'New password and confirm password do not match';
      return;
    }

    if (this.changePasswordForm.newPassword.length < 8) {
      this.passwordChangeError = 'Password must be at least 8 characters';
      return;
    }

    if (!/\d/.test(this.changePasswordForm.newPassword)) {
      this.passwordChangeError = 'Password must contain at least 1 number';
      return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.changePasswordForm.newPassword)) {
      this.passwordChangeError = 'Password must contain at least 1 special character';
      return;
    }

    this.isChangingPassword = true;
    const token = localStorage.getItem('authToken') || '';

    try {
      const response = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: this.changePasswordForm.currentPassword,
          newPassword: this.changePasswordForm.newPassword,
          confirmPassword: this.changePasswordForm.confirmPassword
        })
      });

      const data = await response.json();
      this.isChangingPassword = false;

      if (data.success) {
        this.passwordChangeMessage = data.message || 'Password changed successfully!';
        this.changePasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        setTimeout(() => {
          this.showChangePassword = false;
          this.passwordChangeMessage = '';
        }, 2000);
      } else {
        this.passwordChangeError = data.message || 'Failed to change password';
      }
    } catch (error: any) {
      this.isChangingPassword = false;
      this.passwordChangeError = error.message || 'An error occurred while changing password';
    }
  }

  cancelChangePassword(): void {
    this.showChangePassword = false;
    this.changePasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.passwordChangeMessage = '';
    this.passwordChangeError = '';
  }

  openForgotPasswordModal(): void {
    this.showForgotPasswordModal = true;
  }

  closeForgotPasswordModal(): void {
    this.showForgotPasswordModal = false;
  }

  private saveToLocalStorage(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userDataService.saveUserData('profile', this.userProfile);
      this.userDataService.saveUserData('preferences', this.preferences);
      this.userDataService.saveUserData('privacy', this.privacy);
      localStorage.setItem(`lastLogin_${currentUser.email}`, new Date().toLocaleDateString());
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
        this.userDataService.clearCurrentUserData();
        localStorage.removeItem(`memberSince_${currentUser.email}`);
        localStorage.removeItem(`lastLogin_${currentUser.email}`);
        this.authService.logoutUser(currentUser.email);
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
}
