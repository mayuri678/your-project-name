import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {
  progress = 0;
  variant: 'chef' | 'manager' | 'nurse' | 'sales' | 'genius' = 'chef';
  titleText = 'Top Chef';

  private variants = [
    { key: 'chef' as const, label: 'Top Chef' },
    { key: 'manager' as const, label: 'Awesome Manager' },
    { key: 'nurse' as const, label: 'Best Nurse' },
    { key: 'sales' as const, label: 'Top Sales Associate' },
    { key: 'genius' as const, label: 'Genius' }
  ];

  private variantIndex = 0;
  private progressIntervalId: any;
  private cycleIntervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyVariant(0);

    this.progressIntervalId = setInterval(() => {
      this.progress = Math.min(100, this.progress + 2);
      if (this.progress >= 100) {
        this.clearTimers();
        const shouldOpenTemplates = typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem('openTemplates') === 'true';
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    }, 80);

    this.cycleIntervalId = setInterval(() => {
      this.variantIndex = (this.variantIndex + 1) % this.variants.length;
      this.applyVariant(this.variantIndex);
    }, 1000);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    if (this.progressIntervalId) { clearInterval(this.progressIntervalId); this.progressIntervalId = null; }
    if (this.cycleIntervalId) { clearInterval(this.cycleIntervalId); this.cycleIntervalId = null; }
  }

  private applyVariant(index: number): void {
    const v = this.variants[index];
    this.variant = v.key;
    this.titleText = v.label;
  }
}


