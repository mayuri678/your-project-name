import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-52',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-52.component.html'
})
export class ResumeTemplate52Component {
  @Input() data!: ResumeData;
}
