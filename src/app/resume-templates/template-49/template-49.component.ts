import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-49',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-49.component.html'
})
export class ResumeTemplate49Component {
  @Input() data!: ResumeData;
}
