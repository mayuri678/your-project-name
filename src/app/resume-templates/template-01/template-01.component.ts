import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-01',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-01.component.html',
  styles: []
})
export class ResumeTemplate01Component {
  @Input() data!: ResumeData;
}
