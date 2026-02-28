import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-55',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-55.component.html'
})
export class ResumeTemplate55Component {
  @Input() data!: ResumeData;
}
