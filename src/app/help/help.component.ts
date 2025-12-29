import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  goToResume(): void {
    this.router.navigate(['/blank-resume']);
  }

  goToTemplates(): void {
    this.router.navigate(['/templates']);
  }
}
