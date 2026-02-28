import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-16',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-16.component.html'
})
export class ResumeTemplate16Component {
  @Input() data!: ResumeData;
}
