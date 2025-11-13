import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service'; // Use AuthService for simple auth
import { SupabaseService } from '../services/supabase.service'; // Also support Supabase

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isRegisterMode: boolean = false;
  testUsers: Array<{ email: string; password: string; name: string }> = [];

  // 👉 popup बंद करण्यासाठी event emitter
  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService, // Simple auth service (admin/admin)
    private supabaseService: SupabaseService, // Supabase service for real users
    private router: Router,
    private location: Location
  ) {
    this.loadTestUsers();
  }

  loadTestUsers(): void {
    this.testUsers = this.authService.getTestUsers();
  }

  // 🔹 Register new user
  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.email.trim() && this.password.trim()) {
      const emailTrimmed = this.email.trim();
      const passwordTrimmed = this.password.trim();
      const nameTrimmed = this.name.trim() || (emailTrimmed.includes('@') ? emailTrimmed.split('@')[0] : emailTrimmed);

      const success = this.authService.register(emailTrimmed, passwordTrimmed, nameTrimmed);
      
      if (success) {
        this.successMessage = 'Registration successful! You can now login.';
        this.loadTestUsers();
        // Switch to login mode after 1 second
        setTimeout(() => {
          this.isRegisterMode = false;
          this.successMessage = '';
        }, 2000);
      } else {
        this.errorMessage = 'User already exists. Please use a different email.';
      }
    } else {
      this.errorMessage = 'Please enter email and password';
    }
  }

  // 🔹 Login - tries AuthService first, then Supabase
  async onLogin(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.email.trim() && this.password.trim()) {
      const emailTrimmed = this.email.trim();
      const passwordTrimmed = this.password.trim();

      // Try simple AuthService first (for registered users)
      const simpleAuthSuccess = this.authService.login(emailTrimmed, passwordTrimmed);
      
      if (simpleAuthSuccess) {
        // ✅ Success with simple auth
        this.close.emit();
        this.router.navigate([{ outlets: { modal: null } }]).then(() => {
          this.router.navigate(['/loading'], { replaceUrl: true });
        });
        return;
      }

      // If simple auth fails, try Supabase
      try {
        const { data, error } = await this.supabaseService.login(emailTrimmed, passwordTrimmed);

        if (error || !data.session) {
          this.errorMessage = 'Invalid credentials. Please try again.';
        } else {
          // ✅ Success with Supabase
          this.close.emit();
          this.router.navigate([{ outlets: { modal: null } }]).then(() => {
            this.router.navigate(['/loading'], { replaceUrl: true });
          });
        }
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    } else {
      this.errorMessage = 'Please enter email and password';
    }
  }

  // 🔹 Quick login with test user
  quickLogin(user: { email: string; password: string }): void {
    this.email = user.email;
    this.password = user.password;
    this.onLogin();
  }

  // 🔹 Toggle between login and register modes
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.name = '';
  }

  // 👉 Close the modal
  onClose(): void {
    this.close.emit();
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  // 👉 Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
