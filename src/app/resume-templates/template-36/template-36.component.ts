import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-36',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-36.component.html'
})
export class ResumeTemplate36Component {
  @Input() data!: ResumeData;
}
