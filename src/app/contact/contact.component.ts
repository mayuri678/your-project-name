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

    // Try to save to Supabase (non-blocking)
    this.contactService.submitContactForm({
      full_name: this.name,
      email: this.email,
      message: this.message
    }).catch(err => console.log('Database save skipped:', err));

    // Always open email client
    const to = 'gulvemayuri63@gmail.com';
    const subject = encodeURIComponent('Website Contact Enquiry');
    const body = encodeURIComponent(
      `Name: ${this.name}\nEmail: ${this.email}\n\nMessage:\n${this.message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    
    alert('Thank you! Your message has been sent.');
    setTimeout(() => this.router.navigate(['/']), 1000);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}

