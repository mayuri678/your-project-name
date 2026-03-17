import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { LearnMoreModalComponent } from '../learn-more-modal/learn-more-modal.component';
import { ResumeOptionsModalComponent } from '../resume-options-modal/resume-options-modal.component';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HeaderComponent, LearnMoreModalComponent, ResumeOptionsModalComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  loggedIn: boolean = false;
  showResumeOptions: boolean = false;
  showLearnMore: boolean = false;
  typedName: string = '';

  typingComplete: boolean = false;
  builderNameInput: string = '';

  private readonly fullBuilderName = 'Resume Builder...';
  private typingIndex = 0;
  private typingTimer: any;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.updateLoginStatus();
    this.beginTypingAnimation();
    
    // Listen for login status changes
    setInterval(() => {
      this.updateLoginStatus();
    }, 1000);
  }

  updateLoginStatus(): void {
    this.loggedIn = this.authService.isLoggedIn();
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

  designResume(): void {
    this.router.navigate(['/loading']);
  }

  getGoogleTemplates(): void {
    window.open('https://docs.google.com/document/u/0/?ftv=1&tgif=d&resourcekey=0', '_blank');
  }

  openMsWordEditor(): void {
    this.router.navigate(['/ms-word-editor']);
  }

  closeResumeOptions(): void {
    this.showResumeOptions = false;
  }

  openResumeOptions(): void {
    this.router.navigate(['/templates']);
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
    this.updateLoginStatus();
    this.router.navigate(['/logged-out']);
  }

  goToTemplates(): void {
    this.router.navigate(['/templates']);
  }

  goToResumeEditor(): void {
    this.router.navigate(['/templates']);
  }

  openTemplateManager(): void {
    this.router.navigate(['/create-resume']);
  }

  closeTemplateManager(): void {
  }

  onTemplateSelected(templateId: number): void {
  }

  goToLogin(): void {
    this.router.navigate([{ outlets: { modal: ['login'] } }]);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
