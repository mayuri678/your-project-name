import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  isLoginOpen: boolean = false; // no longer used for popup
  showResumeOptions: boolean = false;
  showLearnMore: boolean = false;
  typedName: string = '';

  // Resume form data
  resumeData = {
    fullName: '',
    email: '',
    profession: ''
  };
  typingComplete: boolean = false;
  builderNameInput: string = '';

  private readonly fullBuilderName = 'Resume Builder...';
  private typingIndex = 0;
  private typingTimer: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
    this.beginTypingAnimation();
  }

  ngOnDestroy(): void {
    this.clearTypingTimer();
  }

  onBuilderNameChange(value: string): void {
    this.builderNameInput = value;
    this.clearTypingTimer();
    this.typedName = value || this.fullBuilderName;
    this.typingComplete = true;
  }

  learnMore(): void {
    this.showLearnMore = true;
  }

  closeLearnMore(): void {
    this.showLearnMore = false;
  }

  createResume(): void {
    if (!this.resumeData.fullName || !this.resumeData.email) {
      alert('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.resumeData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.router.navigate(['/builder'], {
      queryParams: {
        name: this.resumeData.fullName,
        email: this.resumeData.email,
        profession: this.resumeData.profession || ''
      }
    });

    this.closeLearnMore();
  }

  private beginTypingAnimation(): void {
    this.clearTypingTimer();
    this.typedName = '';
    this.typingIndex = 0;
    this.typingComplete = false;

    if (!this.isBrowser()) {
      this.typedName = this.fullBuilderName;
      this.typingComplete = true;
      this.builderNameInput = this.fullBuilderName;
      return;
    }

    this.typingTimer = setInterval(() => {
      if (this.typingIndex < this.fullBuilderName.length) {
        this.typedName += this.fullBuilderName.charAt(this.typingIndex);
        this.typingIndex++;
      } else {
        this.typingComplete = true;
        this.builderNameInput = this.fullBuilderName;
        this.clearTypingTimer();
      }
    }, 120);
  }

  private clearTypingTimer(): void {
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
      this.typingTimer = undefined;
    }
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
    this.router.navigate(['/logged-out']);
  }

  goToTemplates(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    this.loggedIn = isLoggedIn;

    if (isLoggedIn) {
      this.router.navigate(['/resume']);
    } else {
      this.showResumeOptions = true;
    }
  }

  goToResumeEditor(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    this.loggedIn = isLoggedIn;

    if (isLoggedIn) {
      this.router.navigate(['/resume'], {
        queryParams: {
          template: 'template1',
          edit: 'true'
        }
      });
    } else {
      this.router.navigate([{ outlets: { modal: ['login'] } }]);
    }
  }

  openResumeOptions(): void {
    this.showResumeOptions = true;
  }

  closeResumeOptions(): void {
    this.showResumeOptions = false;
  }

  designResume(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    this.loggedIn = isLoggedIn;

    if (isLoggedIn) {
      this.router.navigate(['/resume'], {
        queryParams: {
          template: 'template1',
          edit: 'true'
        }
      });
    } else {
      this.router.navigate([{ outlets: { modal: ['login'] } }]);
    }
    this.closeResumeOptions();
  }

  getGoogleTemplates(): void {
    window.open('https://docs.google.com/document/u/0/?ftv=1&tgif=d&resourcekey=0', '_blank');
    this.closeResumeOptions();
  }

  goToLogin(): void {
    this.router.navigate([{ outlets: { modal: ['login'] } }]);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
