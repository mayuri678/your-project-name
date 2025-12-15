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

  // 👉 popup बंद करण्यासाठी event emitter
  @Output() close = new EventEmitter<void>();

  constructor(
    private authService: AuthService, // Simple auth service (admin/admin)
    private supabaseService: SupabaseService, // Supabase service for real users
    private router: Router,
    private location: Location
  ) {
  }

  // 🔹 Register new user - registers in both AuthService and Supabase
  async onRegister(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.email.trim() && this.password.trim()) {
      const emailTrimmed = this.email.trim();
      const passwordTrimmed = this.password.trim();
      const nameTrimmed = this.name.trim() || (emailTrimmed.includes('@') ? emailTrimmed.split('@')[0] : emailTrimmed);

      // Try to register in Supabase first
      try {
        const { data, error } = await this.supabaseService.signUp(emailTrimmed, passwordTrimmed);

        if (error) {
          console.error('Supabase signup error:', error);
          
          // Handle specific error cases
          if (error.message) {
            if (error.message.includes('User already registered') || error.message.includes('already registered')) {
              this.errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.message.includes('Password') || error.message.includes('password')) {
              this.errorMessage = 'Password is too weak. Please use a stronger password (at least 6 characters).';
            } else if (error.message.includes('For security purposes') || error.message.includes('only request this after')) {
              // Rate limiting error
              const match = error.message.match(/(\d+)\s+seconds/);
              const seconds = match ? match[1] : '60';
              this.errorMessage = `Too many registration attempts. Please wait ${seconds} seconds before trying again.`;
            } else if (error.message.includes('Database error') || error.message.includes('database error')) {
              this.errorMessage = 'Database configuration error. The users table trigger may need to be fixed. Please contact support or check Supabase dashboard.';
              console.error('Database error details:', error);
            } else if (error.status === 500) {
              this.errorMessage = 'Server error during registration. This might be a database configuration issue. Please try again later or contact support.';
            } else if (error.status === 429) {
              const match = error.message.match(/(\d+)\s+seconds/);
              const seconds = match ? match[1] : '60';
              this.errorMessage = `Too many requests. Please wait ${seconds} seconds before trying again.`;
            } else {
              this.errorMessage = error.message || 'Registration failed. Please try again.';
            }
          } else {
            // Check error status
            if (error.status === 500) {
              this.errorMessage = 'Server error during registration. Please check your Supabase database configuration.';
            } else if (error.status === 429) {
              this.errorMessage = 'Too many registration attempts. Please wait 60 seconds before trying again.';
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
          }
          return;
        }

        // Also register in local AuthService for backward compatibility
        this.authService.register(emailTrimmed, passwordTrimmed, nameTrimmed);

        // Check if email confirmation is required
        if (data.user && !data.session) {
          this.successMessage = 'Registration successful! Please check your email to confirm your account before logging in.';
          // Don't switch to login mode if email confirmation is required
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        } else if (data.user && data.session) {
          // User is automatically logged in
          this.successMessage = 'Registration successful! You are now logged in.';
          setTimeout(() => {
            this.close.emit();
            this.router.navigate([{ outlets: { modal: null } }]).then(() => {
              this.router.navigate(['/loading'], { replaceUrl: true });
            });
          }, 1500);
        } else {
          this.successMessage = 'Registration successful! You can now login.';
          // Switch to login mode after 2 seconds
        setTimeout(() => {
          this.isRegisterMode = false;
          this.successMessage = '';
            // Pre-fill email for easy login
            this.email = emailTrimmed;
        }, 2000);
        }
      } catch (err: any) {
        console.error('Registration error:', err);
        this.errorMessage = err?.message || 'An unexpected error occurred during registration. Please try again.';
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
          // If user doesn't exist, auto-register them so they can login immediately
          if (error && (error.message?.includes('Invalid login credentials') || 
                       error.message?.includes('Invalid login') ||
                       error.message?.includes('User not found'))) {
            
            // Auto-register the user
            this.errorMessage = 'Account not found. Creating account automatically...';
            
            try {
              const nameFromEmail = emailTrimmed.includes('@') ? emailTrimmed.split('@')[0] : emailTrimmed;
              const signupResult = await this.supabaseService.signUp(emailTrimmed, passwordTrimmed);
              
              if (signupResult.error) {
                // If signup fails, check the reason
                if (signupResult.error.message?.includes('User already registered')) {
                  // User exists but password might be wrong
                  this.errorMessage = 'Account exists but password is incorrect. Please check your password.';
                } else if (signupResult.error.message?.includes('For security purposes')) {
                  const match = signupResult.error.message.match(/(\d+)\s+seconds/);
                  const seconds = match ? match[1] : '60';
                  this.errorMessage = `Too many attempts. Please wait ${seconds} seconds.`;
                } else if (signupResult.error.message?.includes('Database error')) {
                  this.errorMessage = 'Account creation failed. Please try registering manually.';
                } else {
                  this.errorMessage = signupResult.error.message || 'Failed to create account. Please try registering manually.';
                }
              } else if (signupResult.data?.user) {
                // Account created successfully
                if (signupResult.data.session) {
                  // Auto-logged in after signup - success!
                  this.errorMessage = '';
                  // Also register in local AuthService
                  this.authService.register(emailTrimmed, passwordTrimmed, nameFromEmail);
                  
                  // User is already created in users table by ensureUserInTable in signUp
                  
                  this.close.emit();
                  this.router.navigate([{ outlets: { modal: null } }]).then(() => {
                    this.router.navigate(['/loading'], { replaceUrl: true });
                  });
                  return;
                } else {
                  // Email confirmation might be required - try auto-login
                  this.errorMessage = 'Account created! Attempting to login automatically...';
                  
                  // Wait a bit longer for user to be fully created
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  // Try login again
                  const retryLogin = await this.supabaseService.login(emailTrimmed, passwordTrimmed);
                  if (retryLogin.data?.session) {
                    // Success! Auto-logged in
                    this.errorMessage = '';
                    this.authService.register(emailTrimmed, passwordTrimmed, nameFromEmail);
                    
                    this.close.emit();
                    this.router.navigate([{ outlets: { modal: null } }]).then(() => {
                      this.router.navigate(['/loading'], { replaceUrl: true });
                    });
                    return;
                  } else {
                    // Still can't login - email confirmation required
                    this.errorMessage = 'Account created! If email confirmation is enabled, please check your email. Otherwise, try logging in again.';
                    
                    // Switch to login mode so user can try again
                    setTimeout(() => {
                      this.isRegisterMode = false;
                      this.email = emailTrimmed;
                      this.errorMessage = '';
                    }, 3000);
                  }
                }
              }
            } catch (signupErr: any) {
              this.errorMessage = 'Failed to create account automatically. Please try registering manually.';
            }
            return;
          }
          
          // Show specific error message from Supabase for other errors
          if (error) {
            console.error('Supabase login error:', error);
            
            // Handle specific error cases
            if (error.message) {
              if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
                this.errorMessage = 'Please confirm your email address before logging in. Check your inbox for a confirmation link.';
              } else {
                this.errorMessage = error.message || 'Login failed. Please try again.';
              }
            } else {
              // Check error status code
              const errorStatus = (error as any).status;
              if (errorStatus === 400) {
                this.errorMessage = 'Invalid email or password. Please check your credentials.';
              } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
              }
            }
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        } else {
          // ✅ Success with Supabase
          this.close.emit();
          this.router.navigate([{ outlets: { modal: null } }]).then(() => {
            this.router.navigate(['/loading'], { replaceUrl: true });
          });
        }
      } catch (err: any) {
        console.error('Login error:', err);
        this.errorMessage = err?.message || 'An unexpected error occurred. Please try again.';
      }
    } else {
      this.errorMessage = 'Please enter email and password';
    }
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
