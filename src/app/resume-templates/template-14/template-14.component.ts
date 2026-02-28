import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-14',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-14.component.html'
})
export class ResumeTemplate14Component {
  @Input() data!: ResumeData;
}
