import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-37',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-37.component.html'
})
export class ResumeTemplate37Component {
  @Input() data!: ResumeData;
}
