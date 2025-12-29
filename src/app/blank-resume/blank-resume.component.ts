import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blank-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blank-resume.component.html',
  styleUrls: ['./blank-resume.component.css']
})
export class BlankResumeComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/help']);
  }
}