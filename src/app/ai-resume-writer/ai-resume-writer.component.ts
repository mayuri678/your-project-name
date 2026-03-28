import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AiService } from '../services/ai.service';

interface BulletSection {
  title: string;
  icon: string;
  points: string[];
}

@Component({
  selector: 'app-ai-resume-writer',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './ai-resume-writer.component.html',
  styleUrls: ['./ai-resume-writer.component.css'],
})
export class AiResumeWriterComponent {
  jobRole = '';
  isLoading = false;
  errorMessage = '';
  infoMessage = '';
  sections: BulletSection[] = [];
  editingIndex: { section: number; point: number } | null = null;
  editValue = '';

  constructor(private router: Router, private aiService: AiService) {}

  generate(): void {
    if (!this.jobRole.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.infoMessage = '';
    this.sections = [];

    this.aiService.generateResumeBullets(this.jobRole.trim()).subscribe({
      next: (data) => {
        this.sections = [
          { title: 'Responsibilities', icon: '📋', points: data.responsibilities },
          { title: 'Achievements',     icon: '🏆', points: data.achievements },
          { title: 'Skills',           icon: '⚡', points: data.skills },
        ];
        // If the service fell back to local data it sets a flag via the
        // isFallback property — we show a soft info notice instead of an error
        if ((data as any).__fallback) {
          this.infoMessage =
            'AI service is not yet deployed — showing sample data. Deploy the Edge Function to get live AI results.';
        }
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
    });
  }

  startEdit(sectionIdx: number, pointIdx: number): void {
    this.editingIndex = { section: sectionIdx, point: pointIdx };
    this.editValue = this.sections[sectionIdx].points[pointIdx];
  }

  saveEdit(): void {
    if (this.editingIndex) {
      this.sections[this.editingIndex.section].points[this.editingIndex.point] = this.editValue;
      this.editingIndex = null;
    }
  }

  cancelEdit(): void {
    this.editingIndex = null;
  }

  copySection(points: string[]): void {
    navigator.clipboard.writeText(points.map((p) => `• ${p}`).join('\n'));
  }

  copyAll(): void {
    const text = this.sections
      .map((s) => `${s.title}:\n${s.points.map((p) => `• ${p}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
  }

  dismissError(): void { this.errorMessage = ''; }
  dismissInfo(): void  { this.infoMessage = ''; }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
