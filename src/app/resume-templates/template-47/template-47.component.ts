import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-47',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-47.component.html'
})
export class ResumeTemplate47Component {
  @Input() data!: ResumeData;
}
