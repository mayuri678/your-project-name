import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-20',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-20.component.html'
})
export class ResumeTemplate20Component {
  @Input() data!: ResumeData;
}
