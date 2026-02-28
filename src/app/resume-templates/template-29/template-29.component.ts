import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-29',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-29.component.html'
})
export class ResumeTemplate29Component {
  @Input() data!: ResumeData;
}
