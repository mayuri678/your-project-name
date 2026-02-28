import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-23',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-23.component.html'
})
export class ResumeTemplate23Component {
  @Input() data!: ResumeData;
}
