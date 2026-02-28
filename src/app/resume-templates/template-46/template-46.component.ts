import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-46',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-46.component.html'
})
export class ResumeTemplate46Component {
  @Input() data!: ResumeData;
}
