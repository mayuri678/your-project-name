import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-26',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-26.component.html'
})
export class ResumeTemplate26Component {
  @Input() data!: ResumeData;
}
