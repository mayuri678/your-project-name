import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-21',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-21.component.html'
})
export class ResumeTemplate21Component {
  @Input() data!: ResumeData;
}
