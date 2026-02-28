import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-7',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-7.component.html'
})
export class ResumeTemplate7Component {
  @Input() data!: ResumeData;
}
