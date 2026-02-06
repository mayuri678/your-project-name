import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  name: string = '';
  email: string = '';
  message: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.name = user.name;
      this.email = user.email.includes('@') ? user.email : `${user.email}@example.com`;
    }
  }

  async sendEnquiry(): Promise<void> {
    if (!this.name || !this.email || !this.message) {
      alert('Please fill in all fields');
      return;
    }

    const result = await this.contactService.submitContactForm({
      full_name: this.name,
      email: this.email,
      message: this.message
    });

    if (result.success) {
      alert('Thank you! Your message has been sent successfully.');
      this.router.navigate(['/']);
    } else {
      alert(`Error: ${result.error || 'Failed to send message. Please try again.'}`);
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}


