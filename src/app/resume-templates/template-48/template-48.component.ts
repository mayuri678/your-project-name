import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-48',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-48.component.html'
})
export class ResumeTemplate48Component {
  @Input() data!: ResumeData;
}
