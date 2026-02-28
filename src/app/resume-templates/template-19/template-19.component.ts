import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-19',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-19.component.html'
})
export class ResumeTemplate19Component {
  @Input() data!: ResumeData;
}
