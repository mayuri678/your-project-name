import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-44',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-44.component.html'
})
export class ResumeTemplate44Component {
  @Input() data!: ResumeData;
}
