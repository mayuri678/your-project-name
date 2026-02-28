import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-40',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-40.component.html'
})
export class ResumeTemplate40Component {
  @Input() data!: ResumeData;
}
