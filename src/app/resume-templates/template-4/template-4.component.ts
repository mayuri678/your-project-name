import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-4.component.html'
})
export class ResumeTemplate4Component {
  @Input() data!: ResumeData;
}
