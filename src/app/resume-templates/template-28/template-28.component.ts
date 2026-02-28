import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-28',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-28.component.html'
})
export class ResumeTemplate28Component {
  @Input() data!: ResumeData;
}
