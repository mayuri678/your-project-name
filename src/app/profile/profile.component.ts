import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserDataService } from '../services/user-data.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile = {
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

  isLoggedIn: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

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
    this.loadProfileData();
  }

  loadProfileData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.profile.name = currentUser.name;
      this.profile.email = currentUser.email;
      
      const profileData = this.userDataService.getUserData('profile');
      if (profileData) {
        this.profile = { ...this.profile, ...profileData };
      }
    }
  }

  saveProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userDataService.saveUserData('profile', this.profile);
      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }
  }

  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  onLogout(): void {
    this.router.navigate(['/home']);
  }
}
