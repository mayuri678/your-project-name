import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-12',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-12.component.html'
})
export class ResumeTemplate12Component {
  @Input() data!: ResumeData;
}
