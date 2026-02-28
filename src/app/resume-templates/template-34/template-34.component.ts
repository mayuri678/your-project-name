import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-34',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-34.component.html'
})
export class ResumeTemplate34Component {
  @Input() data!: ResumeData;
}
