import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  isLoginOpen: boolean = false; // no longer used for popup
  isAboutOpen: boolean = false;
  showResumeOptions: boolean = false;
  typedName: string = '';
  typingComplete: boolean = false;
  builderNameInput: string = '';

  @ViewChild('aboutSection') aboutSection?: ElementRef<HTMLElement>;

  private readonly fullBuilderName = 'Resume Builder...';
  private typingIndex = 0;
  private typingTimer: any;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.isBrowser()) {
      this.loggedIn = localStorage.getItem('loggedIn') === 'true';
    }
    this.beginTypingAnimation();
  }

  ngOnDestroy(): void {
    this.clearTypingTimer();
  }

  // popup handled via named router outlet 'modal'

  // 👉 About modal (no navigation)
  openAbout(): void {
    this.isAboutOpen = true;
  }

  closeAbout(): void {
    this.isAboutOpen = false;
  }

  onBuilderNameChange(value: string): void {
    this.builderNameInput = value;
    this.clearTypingTimer();
    this.typedName = value || this.fullBuilderName;
    this.typingComplete = true;
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

  // 👉 Logout
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('isLoggedIn');
      this.loggedIn = false;
      this.router.navigate(['/logged-out']);
    }
  }

  goToTemplates(): void {
    if (this.loggedIn) {
      this.router.navigate(['/resume']);
    } else {
      // Show resume options modal if not logged in, or navigate if logged in
      this.showResumeOptions = true;
    }
  }

  openResumeOptions(): void {
    this.showResumeOptions = true;
  }

  closeResumeOptions(): void {
    this.showResumeOptions = false;
  }

  designResume(): void {
    if (this.loggedIn) {
      this.router.navigate(['/resume']);
    } else {
      // Navigate to login first
      this.router.navigate([{ outlets: { modal: ['login'] } }]);
    }
    this.closeResumeOptions();
  }

  getGoogleTemplates(): void {
    // Open Google Docs resume templates in a new tab
    // Direct link to Google Docs template gallery (resume templates)
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
