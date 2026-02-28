import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-3.component.html'
})
export class ResumeTemplate3Component {
  @Input() data!: ResumeData;
}
