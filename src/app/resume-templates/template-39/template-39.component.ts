import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-39',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-39.component.html'
})
export class ResumeTemplate39Component {
  @Input() data!: ResumeData;
}
