import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-50',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-50.component.html'
})
export class ResumeTemplate50Component {
  @Input() data!: ResumeData;
}
