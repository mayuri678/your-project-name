import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  showContactPopup = false;
  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private contactService: ContactService) {}

  openContactPopup() {
    this.showContactPopup = true;
  }

  closeContactPopup() {
    this.showContactPopup = false;
    this.resetForm();
  }

  async sendMessage() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await this.contactService.submitContactForm({
        full_name: this.contactForm.name,
        email: this.contactForm.email,
        message: this.contactForm.message
      });

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_vw95fjw',
          template_id: 'template_default',
          user_id: '9yJLiuXHcw3EG0n-f',
          template_params: {
            to_email: 'gulvemayuri63@gmail.com',
            from_name: this.contactForm.name,
            from_email: this.contactForm.email,
            reply_to: this.contactForm.email,
            message: this.contactForm.message,
            subject: `New Contact Form Message from ${this.contactForm.name}`
          }
        })
      });

      if (response.ok) {
        alert('✅ Thank you! Your message has been sent.');
      } else {
        alert('✅ Message saved!');
      }
      this.closeContactPopup();
    } catch (error) {
      alert('✅ Message saved!');
      this.closeContactPopup();
    }
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      message: ''
    };
  }
}