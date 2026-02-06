import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AnalysisResult {
  score: number;
  suggestions: string[];
}

@Component({
  selector: 'app-resume-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-analyzer.component.html',
  styleUrls: ['./resume-analyzer.component.css']
})
export class ResumeAnalyzerComponent {
  resumeText: string = '';
  analysisResult: AnalysisResult | null = null;

  analyzeResume(): void {
    if (!this.resumeText.trim()) return;
    
    const score = this.calculateScore();
    const suggestions = this.generateSuggestions();
    
    this.analysisResult = { score, suggestions };
  }

  private calculateScore(): number {
    let score = 10;
    const text = this.resumeText.toLowerCase();
    
    // Deduct points for common ATS issues
    if (!text.includes('experience') && !text.includes('work history')) score -= 2;
    if (!text.includes('skills')) score -= 1;
    if (!text.includes('education')) score -= 1;
    if (text.split('\n').length < 10) score -= 1;
    if (!/\b\d{4}\b/.test(text)) score -= 1; // No years
    if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) score -= 2; // No email
    if (!/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) score -= 1; // No phone
    if (text.length < 200) score -= 1;
    
    return Math.max(1, score);
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = [];
    const text = this.resumeText.toLowerCase();
    
    if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
      suggestions.push('Add professional email address');
    }
    
    if (!/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
      suggestions.push('Include phone number');
    }
    
    if (!text.includes('skills')) {
      suggestions.push('Add skills section with relevant keywords');
    }
    
    if (!/\b\d{4}\b/.test(text)) {
      suggestions.push('Include employment dates (years)');
    }
    
    if (!text.includes('experience') && !text.includes('work history')) {
      suggestions.push('Add work experience section');
    }
    
    // Fill remaining suggestions if less than 5
    const additionalSuggestions = [
      'Use action verbs (managed, developed, implemented)',
      'Quantify achievements with numbers and percentages',
      'Include industry-specific keywords',
      'Use standard section headers (Experience, Education, Skills)',
      'Keep formatting simple for ATS compatibility'
    ];
    
    while (suggestions.length < 5) {
      const remaining = additionalSuggestions.filter(s => !suggestions.includes(s));
      if (remaining.length === 0) break;
      suggestions.push(remaining[0]);
    }
    
    return suggestions.slice(0, 5);
  }
}