import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-38',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-38.component.html'
})
export class ResumeTemplate38Component {
  @Input() data!: ResumeData;
}
