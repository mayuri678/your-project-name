import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-53',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-53.component.html'
})
export class ResumeTemplate53Component {
  @Input() data!: ResumeData;
}
