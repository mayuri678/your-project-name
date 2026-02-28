import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-45',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-45.component.html'
})
export class ResumeTemplate45Component {
  @Input() data!: ResumeData;
}
