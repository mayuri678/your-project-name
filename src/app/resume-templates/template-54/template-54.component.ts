import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-54',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-54.component.html'
})
export class ResumeTemplate54Component {
  @Input() data!: ResumeData;
}
