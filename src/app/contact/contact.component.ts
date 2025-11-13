import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.name = user.name;
      this.email = user.email.includes('@') ? user.email : `${user.email}@example.com`;
    }
  }

  sendEnquiry(): void {
    const to = 'gulve.mayuri11119@coea.ac.in';
    const subject = encodeURIComponent('Website Contact Enquiry');
    const body = encodeURIComponent(
      `Name: ${this.name}\nEmail: ${this.email}\n\nMessage:\n${this.message}`
    );

    const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}


