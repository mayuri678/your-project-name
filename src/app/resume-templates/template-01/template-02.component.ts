import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-02',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-02.component.html',
  styles: []
})
export class ResumeTemplate02Component {
  @Input() data!: ResumeData;
}
