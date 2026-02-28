import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-25',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-25.component.html'
})
export class ResumeTemplate25Component {
  @Input() data!: ResumeData;
}
