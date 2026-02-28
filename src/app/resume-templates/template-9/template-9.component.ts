import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-9',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-9.component.html'
})
export class ResumeTemplate9Component {
  @Input() data!: ResumeData;
}
