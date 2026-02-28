import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SupabaseAuthService, UserProfile } from '../services/supabase-auth.service';
import { SupabaseService } from '../services/supabase.service';
import { UserDataService } from '../services/user-data.service';
import { TranslationService } from '../services/translation.service';
import { EmailService } from '../services/email.service';
import { RealEmailService } from '../services/real-email.service';
import { SimpleEmailService } from '../services/simple-email.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile = {
    id: '',
    email: '',
    full_name: '',
    username: '',
    contactNo: '',
    notification: true,
    address: '',
    street: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    location: '',
    photo: '',
    education: '',
    degree: '',
    institution: '',
    graduationYear: '',
    role: 'user',
    is_dark_mode: false,
    language: 'en'
  };

  // Display name for UI (full name if available, otherwise username)
  get displayName(): string {
    return this.profile.full_name || this.profile.username || this.profile.email?.split('@')[0] || '';
  }

  // Check if user is logged in for header
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isEditing: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  photoPreview: string | null = null;
  selectedFile: File | null = null;

  // User data from Supabase users table
  supabaseUser: any = null;
  loading: boolean = false;

  // Password change fields
  newPassword: string = '';
  confirmPassword: string = '';
  
  // Language selection
  selectedLanguage: string = 'en';

  constructor(
    private authService: AuthService,
    private supabaseAuthService: SupabaseAuthService,
    private supabaseService: SupabaseService,
    private userDataService: UserDataService,
    public translationService: TranslationService,
    public router: Router,
    private emailService: EmailService,
    private realEmailService: RealEmailService,
    private simpleEmailService: SimpleEmailService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Clear any previous user's data first
    this.clearPreviousUserData();
    this.loadProfile();
    
    // Listen for storage changes to reload profile
    window.addEventListener('storage', this.handleStorageChange);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  private handleStorageChange = (): void => {
    this.loadProfile();
  };

  private clearPreviousUserData(): void {
    // Reset component state
    this.photoPreview = null;
    this.selectedFile = null;
    this.successMessage = '';
    this.errorMessage = '';
    this.isEditing = false;
  }

  async loadProfile(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // Set basic profile data
      this.profile.email = currentUser.email;
      
      // Set default profile first
      this.setDefaultProfile(currentUser);
      
      // Fetch profile from backend (Supabase)
      try {
        console.log('🔄 Fetching profile from backend for:', currentUser.email);
        const { data: supabaseProfile, error } = await this.supabaseAuthService.getUserProfile(currentUser.email);
        
        if (error) {
          console.warn('⚠️ Backend fetch error:', error);
          this.loadFromLocalStorage(currentUser);
        } else if (supabaseProfile) {
          console.log('✅ Profile fetched from backend:', supabaseProfile);
          
          // Map all backend data to profile
          this.profile = {
            id: supabaseProfile.id || currentUser.email,
            full_name: supabaseProfile.full_name || supabaseProfile.username || this.profile.full_name,
            username: supabaseProfile.username || this.profile.username,
            email: supabaseProfile.email || currentUser.email,
            contactNo: supabaseProfile.contactNo || '',
            notification: true,
            address: supabaseProfile.address || '',
            street: supabaseProfile.street || '',
            city: supabaseProfile.city || '',
            state: supabaseProfile.state || '',
            country: supabaseProfile.country || '',
            pincode: supabaseProfile.pincode || '',
            location: this.buildLocationString(supabaseProfile),
            photo: supabaseProfile.photo || '',
            education: supabaseProfile.education || '',
            degree: supabaseProfile.degree || '',
            institution: supabaseProfile.institution || '',
            graduationYear: supabaseProfile.graduationYear || '',
            role: supabaseProfile.role || 'user',
            is_dark_mode: supabaseProfile.is_dark_mode || false,
            language: supabaseProfile.language || 'en'
          };
          
          // Set photo preview
          if (this.profile.photo) {
            this.photoPreview = this.profile.photo;
          }
          
          // Save to localStorage as backup
          this.userDataService.saveUserData('profile', this.profile);
          
        } else {
          console.log('📝 No backend profile found, creating new one');
          
          // Create new profile in backend
          await this.createBackendProfile(currentUser);
          
          // Load from localStorage as fallback
          this.loadFromLocalStorage(currentUser);
        }
      } catch (error) {
        console.error('❌ Backend fetch failed:', error);
        this.errorMessage = 'Could not load profile from server. Using local data.';
        this.loadFromLocalStorage(currentUser);
      }
    } else {
      this.errorMessage = 'User not authenticated';
    }
    
    this.loading = false;
  }

  private buildLocationString(profile: any): string {
    const parts = [profile.city, profile.state, profile.country].filter(Boolean);
    return parts.join(', ');
  }

  private async createBackendProfile(currentUser: any): Promise<void> {
    try {
      const newProfile: Partial<UserProfile> = {
        id: currentUser.email,
        email: currentUser.email,
        full_name: this.profile.full_name,
        username: this.profile.username,
        role: 'user',
        is_dark_mode: false,
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await this.supabaseAuthService.upsertUserProfile(newProfile);
      console.log('✅ Backend profile created successfully');
    } catch (createError) {
      console.warn('⚠️ Could not create backend profile:', createError);
    }
  }

  private setDefaultProfile(currentUser: any): void {
    // Set default profile based on user email
    this.profile.id = currentUser.email;
    
    if (currentUser.email === 'gulvemayuri63') {
      this.profile.full_name = 'Mayuri Suresh Gulve';
      this.profile.username = 'Mayuri Suresh Gulve';
      this.profile.contactNo = '+91-9876543210';
      this.profile.location = 'Pune, Maharashtra, India';
      this.profile.city = 'Pune';
      this.profile.state = 'Maharashtra';
      this.profile.country = 'India';
    } else if (currentUser.email === 'admin') {
      this.profile.full_name = 'Admin System Administrator';
      this.profile.username = 'Admin System Administrator';
    } else {
      const name = currentUser.name || currentUser.email.split('@')[0];
      this.profile.full_name = name;
      this.profile.username = name;
    }
  }

  private loadFromLocalStorage(currentUser: any): void {
    // Load saved profile data using UserDataService
    const savedProfile = this.userDataService.getUserData('profile');
    if (savedProfile) {
      // Merge saved profile with default values
      this.profile = {
        id: savedProfile.id || this.profile.id,
        full_name: savedProfile.full_name || savedProfile.username || this.profile.full_name,
        username: savedProfile.username || this.profile.username,
        email: savedProfile.email || this.profile.email,
        contactNo: savedProfile.contactNo || this.profile.contactNo || '',
        notification: savedProfile.notification !== undefined ? savedProfile.notification : true,
        address: savedProfile.address || '',
        street: savedProfile.street || '',
        city: savedProfile.city || this.profile.city || '',
        state: savedProfile.state || this.profile.state || '',
        country: savedProfile.country || this.profile.country || '',
        pincode: savedProfile.pincode || '',
        location: savedProfile.location || this.profile.location || '',
        photo: savedProfile.photo || '',
        education: savedProfile.education || '',
        degree: savedProfile.degree || '',
        institution: savedProfile.institution || '',
        graduationYear: savedProfile.graduationYear || '',
        role: savedProfile.role || 'user',
        is_dark_mode: savedProfile.is_dark_mode || false,
        language: savedProfile.language || 'en'
      };
      // Set photo preview if photo exists
      if (this.profile.photo) {
        this.photoPreview = this.profile.photo;
      }
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reload profile when canceling edit
      this.loadProfile();
      this.successMessage = '';
      this.errorMessage = '';
      this.selectedFile = null;
      // Clear password fields
      this.newPassword = '';
      this.confirmPassword = '';
      // Reset photo preview to saved photo
      this.photoPreview = this.profile.photo || null;
    }
  }

  async saveProfile(): Promise<void> {
    console.log('💾 Save button clicked!');
    console.log('💾 Saving profile to backend:', this.profile);
    
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    
    if (!this.profile.email) {
      this.errorMessage = 'Email is required.';
      this.loading = false;
      return;
    }

    if (this.photoPreview && this.photoPreview !== this.profile.photo) {
      this.profile.photo = this.photoPreview;
    }

    try {
      // Save to backend with timeout
      const savePromise = this.supabaseAuthService.upsertUserProfile(this.profile);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const { data, error } = await Promise.race([savePromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn('⚠️ Backend save failed:', error);
        this.userDataService.saveUserData('profile', this.profile);
        this.successMessage = 'Profile saved locally.';
      } else {
        console.log('✅ Backend save success:', data);
        this.userDataService.saveUserData('profile', this.profile);
        this.successMessage = 'Profile updated successfully!';
      }
      
      this.authService.saveUserProfile(this.profile);
      this.isEditing = false;
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
      
    } catch (error) {
      console.error('❌ Exception saving profile:', error);
      this.userDataService.saveUserData('profile', this.profile);
      this.successMessage = 'Profile saved locally.';
      this.isEditing = false;
      window.dispatchEvent(new Event('storage'));
    } finally {
      this.loading = false;
    }
  }

  async resetAndTestLogin(): Promise<void> {
    console.log('🔄 Resetting localStorage and testing login...');
    
    // Clear all localStorage
    localStorage.clear();
    
    // Manually add admin user
    const defaultUsers = [
      { email: 'admin', password: 'admin', name: 'Admin System Administrator', role: 'admin' },
      { email: 'user1', password: 'user1', name: 'User One Kumar', role: 'user' },
      { email: 'test@example.com', password: 'test123', name: 'Test User Account', role: 'user' }
    ];
    
    localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    console.log('✅ Default users added to localStorage:', defaultUsers);
    
    // Test admin login
    const loginResult = this.authService.login('admin', 'admin');
    console.log('📊 Admin login result:', loginResult);
    
    if (loginResult) {
      const currentUser = this.authService.getCurrentUser();
      console.log('✅ Current user after login:', currentUser);
      this.successMessage = 'Admin login successful! You can now test Supabase.';
      
      // Reload profile
      setTimeout(() => {
        this.loadProfile();
      }, 1000);
    } else {
      console.error('❌ Admin login failed');
      this.errorMessage = 'Admin login failed!';
    }
  }

  async testLogin(): Promise<void> {
    console.log('🔐 Testing admin login...');
    
    // Test admin login
    const loginResult = this.authService.login('admin', 'admin');
    console.log('📊 Admin login result:', loginResult);
    
    if (loginResult) {
      const currentUser = this.authService.getCurrentUser();
      console.log('✅ Current user after login:', currentUser);
      this.successMessage = 'Admin login successful!';
    } else {
      console.error('❌ Admin login failed');
      this.errorMessage = 'Admin login failed!';
    }
  }

  async directInsertTest(): Promise<void> {
    console.log('🔄 Direct insert test...');
    
    try {
      const result = await this.supabaseAuthService['supabase']
        .from('user_profiles')
        .insert({
          id: 'direct-test-' + Date.now(),
          email: 'direct@test.com',
          full_name: 'Direct Test User',
          username: 'directtest',
          role: 'user',
          is_dark_mode: false,
          language: 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
        
      console.log('📊 Direct insert result:', result);
      
      if (result.error) {
        console.error('❌ Direct insert failed:', result.error);
        this.errorMessage = `Direct insert failed: ${result.error.message}`;
      } else {
        console.log('✅ Direct insert successful:', result.data);
        this.successMessage = 'Direct insert successful! Check Supabase table.';
      }
    } catch (error) {
      console.error('❌ Direct insert exception:', error);
      this.errorMessage = `Direct insert exception: ${error}`;
    }
  }

  async testCreateProfile(): Promise<void> {
    console.log('🧪 Testing profile creation...');
    console.log('🔗 Supabase URL:', 'https://kwlaqovlzhxghwtilxxu.supabase.co');
    
    const testProfile: Partial<UserProfile> = {
      id: 'test-user-123',
      email: 'test@example.com',
      full_name: 'Test User Name',
      username: 'testuser',
      role: 'user',
      is_dark_mode: false,
      language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Creating profile:', testProfile);
    
    try {
      const { data, error } = await this.supabaseAuthService.upsertUserProfile(testProfile);
      if (error) {
        console.error('❌ Test profile creation failed:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        this.errorMessage = `Profile creation failed: ${error.message || error}`;
      } else {
        console.log('✅ Test profile created successfully:', data);
        this.successMessage = 'Test profile created successfully! Check Supabase table.';
      }
    } catch (error) {
      console.error('❌ Test profile creation exception:', error);
      this.errorMessage = `Exception: ${error}`;
    }
  }

  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select a valid image file.';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size should be less than 5MB.';
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.photoPreview = e.target.result as string;
          this.profile.photo = this.photoPreview;
          this.errorMessage = '';
          // Save immediately
          this.userDataService.saveUserData('profile', this.profile);
          this.authService.saveUserProfile(this.profile);
          // Trigger header update
          window.dispatchEvent(new Event('storage'));
        }
      };
      
      reader.onerror = () => {
        this.errorMessage = 'Error reading image file.';
      };
      
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoPreview = null;
    this.profile.photo = '';
    this.selectedFile = null;
    // Remove photo from user data
    this.userDataService.removeUserData('photo');
    const input = document.getElementById('photo-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
  
  changeLanguage(lang: string): void {
    this.selectedLanguage = lang;
    this.translationService.setLanguage(lang);
  }

  // Refresh profile data from backend
  async refreshProfile(): Promise<void> {
    console.log('🔄 Refreshing profile from backend...');
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      await this.loadProfile();
      this.successMessage = 'Profile refreshed successfully!';
      
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
      this.errorMessage = 'Failed to refresh profile from server.';
    } finally {
      this.loading = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Send OTP for email verification
  async sendOTPForVerification(): Promise<void> {
    if (!this.profile.email) {
      this.errorMessage = 'Email is required to send OTP.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Generate OTP and store it
      const otp = this.emailService.generateOTP();
      this.emailService.storeOTP(this.profile.email, otp);
      
      // Try to send email using simple email service
      const result = await this.simpleEmailService.sendOTPEmail(this.profile.email, otp, this.profile.username);
      
      if (result.success) {
        this.successMessage = `OTP sent successfully to ${this.profile.email}! Check your email.`;
        
        setTimeout(() => {
          this.router.navigate(['/otp-verification'], {
            queryParams: {
              email: this.profile.email,
              returnUrl: '/profile'
            }
          });
        }, 2000);
      } else {
        // Fallback: Open email client
        this.simpleEmailService.openEmailClient(this.profile.email, otp, this.profile.username);
        this.successMessage = `Email client opened. OTP: ${otp} - Send the email manually.`;
        
        setTimeout(() => {
          this.router.navigate(['/otp-verification'], {
            queryParams: {
              email: this.profile.email,
              returnUrl: '/profile'
            }
          });
        }, 3000);
      }
      
    } catch (error) {
      // Generate OTP for fallback
      const otp = this.emailService.generateOTP();
      this.emailService.storeOTP(this.profile.email, otp);
      
      // Fallback: Open email client
      this.simpleEmailService.openEmailClient(this.profile.email, otp, this.profile.username);
      this.errorMessage = 'Email service failed. Email client opened for manual sending.';
      console.error('OTP send error:', error);
      
      setTimeout(() => {
        this.router.navigate(['/otp-verification'], {
          queryParams: {
            email: this.profile.email,
            returnUrl: '/profile'
          }
        });
      }, 3000);
    } finally {
      this.loading = false;
    }
  }
}