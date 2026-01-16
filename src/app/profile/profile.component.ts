import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../auth.service';
import { SupabaseService } from '../services/supabase.service';
import { UserDataService } from '../services/user-data.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile = {
    username: '',
    email: '',
    contactNo: '',
    notification: true,
    address: '',
    street: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    location: '',
    photo: ''
  };

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

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private userDataService: UserDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Clear any previous user's data first
    this.clearPreviousUserData();
    this.loadProfile();
  }

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
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // Check if user is gulvemayuri63 and load their specific data
      if (currentUser.email === 'gulvemayuri63') {
        this.profile.username = 'Mayuri Gulve';
        this.profile.email = 'gulvemayuri63@gmail.com';
        this.profile.contactNo = '+91-9876543210';
        this.profile.location = 'Pune, Maharashtra, India';
        this.profile.city = 'Pune';
        this.profile.state = 'Maharashtra';
        this.profile.country = 'India';
      } else {
        this.profile.email = currentUser.email;
        this.profile.username = currentUser.name || currentUser.email.split('@')[0];
      }
      
      // Fetch user data from Supabase users table
      try {
        const { data, error } = await this.supabaseService.getUserByEmail(currentUser.email);
        
        if (error) {
          // Don't show error for 406 (RLS policy) or if user doesn't exist in custom table
          const errorStatus = (error as any).status;
          if (errorStatus !== 406 && error.code !== 'PGRST116') {
            console.error('Error fetching user from Supabase:', error);
          }
          // User might not exist in custom users table yet - that's okay
        } else if (data) {
          this.supabaseUser = data;
          // Update profile with data from Supabase
          if (data.full_name) {
            this.profile.username = data.full_name;
          }
          if (data.email) {
            this.profile.email = data.email;
          }
        }
      } catch (err: any) {
        // Ignore 406 errors
        if (err?.status !== 406 && err?.code !== 'PGRST116') {
          console.error('Exception loading user from Supabase:', err);
        }
      }
    }

    // Load saved profile data using UserDataService (skip for gulvemayuri63)
    if (currentUser && currentUser.email !== 'gulvemayuri63') {
      const savedProfile = this.userDataService.getUserData('profile');
      if (savedProfile) {
        // Merge saved profile with default values to ensure all fields exist
        this.profile = {
          username: savedProfile.username || this.profile.username,
          email: savedProfile.email || this.profile.email,
          contactNo: savedProfile.contactNo || '',
          notification: savedProfile.notification !== undefined ? savedProfile.notification : true,
          address: savedProfile.address || '',
          street: savedProfile.street || '',
          city: savedProfile.city || '',
          state: savedProfile.state || '',
          country: savedProfile.country || '',
          pincode: savedProfile.pincode || '',
          location: savedProfile.location || '',
          photo: savedProfile.photo || ''
        };
        // Set photo preview if photo exists
        if (this.profile.photo) {
          this.photoPreview = this.profile.photo;
        }
      }
    }
    
    this.loading = false;
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
    // Validate required fields
    if (!this.profile.email || !this.profile.username) {
      this.errorMessage = 'Email and Username are required fields.';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.profile.email && !emailRegex.test(this.profile.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Validate contact number (if provided)
    if (this.profile.contactNo && !/^[\d\s\-\+\(\)]+$/.test(this.profile.contactNo)) {
      this.errorMessage = 'Please enter a valid contact number.';
      return;
    }

    // Validate pincode (if provided)
    if (this.profile.pincode && !/^\d{4,10}$/.test(this.profile.pincode.replace(/\s/g, ''))) {
      this.errorMessage = 'Please enter a valid pincode (4-10 digits).';
      return;
    }

    // Validate password change if provided
    if (this.newPassword || this.confirmPassword) {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
      if (this.newPassword.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long.';
        return;
      }
    }

    // Update photo if a new file was selected
    if (this.photoPreview && this.photoPreview !== this.profile.photo) {
      this.profile.photo = this.photoPreview;
    }

    // Handle password change and log it
    if (this.newPassword) {
      try {
        await this.supabaseService.logPasswordChange(this.profile.email, this.profile.username);
        console.log('Password change logged successfully');
      } catch (err) {
        console.error('Failed to log password change:', err);
      }
    }

    // Save to Supabase users table if user exists
    if (this.supabaseUser && this.supabaseUser.id) {
      try {
        const updates: any = {
          full_name: this.profile.username,
          email: this.profile.email
        };
        
        // Add password to updates if changed
        if (this.newPassword) {
          updates.password = this.newPassword;
        }

        const { data, error } = await this.supabaseService.updateUser(this.supabaseUser.id, updates);

        if (error) {
          console.error('Error updating user in Supabase:', error);
          this.errorMessage = 'Failed to update user in database. Please try again.';
          return;
        } else if (data) {
          this.supabaseUser = data;
          console.log('User updated in Supabase:', data);
        }
      } catch (err) {
        console.error('Exception updating user in Supabase:', err);
        this.errorMessage = 'Failed to update user in database. Please try again.';
        return;
      }
    }

    // Save profile using UserDataService for proper user isolation
    const success = this.userDataService.saveUserData('profile', this.profile);
    
    if (success) {
      this.successMessage = 'Profile updated successfully!';
      if (this.newPassword) {
        this.successMessage += ' Password changed successfully!';
      }
      this.errorMessage = '';
      this.isEditing = false;
      
      // Clear password fields
      this.newPassword = '';
      this.confirmPassword = '';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    } else {
      this.errorMessage = 'Failed to save profile. Please try again.';
    }
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
          this.errorMessage = '';
          // Save photo immediately for current user
          this.userDataService.saveUserPhoto(this.photoPreview);
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

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
