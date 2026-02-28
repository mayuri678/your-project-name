import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-15',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-15.component.html'
})
export class ResumeTemplate15Component {
  @Input() data!: ResumeData;
}
