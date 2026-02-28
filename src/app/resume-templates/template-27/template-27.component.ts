import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-27',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-27.component.html'
})
export class ResumeTemplate27Component {
  @Input() data!: ResumeData;
}
