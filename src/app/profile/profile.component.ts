import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../auth.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
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

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profile.email = currentUser.email;
      this.profile.username = currentUser.name || currentUser.email.split('@')[0];
    }

    // Load saved profile data from localStorage
    const savedProfile = this.authService.getUserProfile();
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reload profile when canceling edit
      this.loadProfile();
      this.successMessage = '';
      this.errorMessage = '';
      this.selectedFile = null;
      // Reset photo preview to saved photo
      this.photoPreview = this.profile.photo || null;
    }
  }

  saveProfile(): void {
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

    // Update photo if a new file was selected
    if (this.photoPreview && this.photoPreview !== this.profile.photo) {
      this.profile.photo = this.photoPreview;
    }

    // Save profile
    const success = this.authService.saveUserProfile(this.profile);
    
    if (success) {
      this.successMessage = 'Profile updated successfully!';
      this.errorMessage = '';
      this.isEditing = false;
      
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
    const input = document.getElementById('photo-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
