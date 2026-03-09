# Generate all 55 resume templates

$colors = @(
    @{id=1; color="#1e3c72"; name="Executive Blue"},
    @{id=2; color="#2563eb"; name="Modern Blue"},
    @{id=3; color="#10b981"; name="Creative Green"},
    @{id=4; color="#7c3aed"; name="Elegant Purple"},
    @{id=5; color="#dc2626"; name="Bold Red"},
    @{id=6; color="#6b7280"; name="Minimal Gray"},
    @{id=7; color="#ea580c"; name="Bold Orange"},
    @{id=8; color="#0d9488"; name="Tech Teal"},
    @{id=9; color="#1e40af"; name="Corporate Navy"},
    @{id=10; color="#84cc16"; name="Fresh Lime"},
    @{id=11; color="#1f2937"; name="Classic Black"},
    @{id=12; color="#ec4899"; name="Vibrant Pink"},
    @{id=13; color="#0ea5e9"; name="Sky Blue"},
    @{id=14; color="#059669"; name="Forest Green"},
    @{id=15; color="#f97316"; name="Sunset Orange"},
    @{id=16; color="#9333ea"; name="Royal Purple"},
    @{id=17; color="#0284c7"; name="Ocean Blue"},
    @{id=18; color="#b91c1c"; name="Crimson Red"},
    @{id=19; color="#22c55e"; name="Mint Green"},
    @{id=20; color="#64748b"; name="Slate Gray"},
    @{id=21; color="#4f46e5"; name="Indigo Pro"},
    @{id=22; color="#fb7185"; name="Coral Bright"},
    @{id=23; color="#a855f7"; name="Lavender"},
    @{id=24; color="#374151"; name="Charcoal"},
    @{id=25; color="#06b6d4"; name="Turquoise"},
    @{id=26; color="#881337"; name="Burgundy"},
    @{id=27; color="#65a30d"; name="Olive"},
    @{id=28; color="#c026d3"; name="Magenta"},
    @{id=29; color="#475569"; name="Steel Blue"},
    @{id=30; color="#d97706"; name="Amber Gold"},
    @{id=31; color="#6b21a8"; name="Deep Purple"},
    @{id=32; color="#0891b2"; name="Aqua Marine"},
    @{id=33; color="#9f1239"; name="Ruby Red"},
    @{id=34; color="#84cc16"; name="Sage Green"},
    @{id=35; color="#1d4ed8"; name="Cobalt Blue"},
    @{id=36; color="#fb923c"; name="Peach"},
    @{id=37; color="#7e22ce"; name="Plum"},
    @{id=38; color="#27272a"; name="Graphite"},
    @{id=39; color="#14b8a6"; name="Seafoam"},
    @{id=40; color="#7f1d1d"; name="Maroon"},
    @{id=41; color="#16a34a"; name="Jade"},
    @{id=42; color="#a21caf"; name="Orchid"},
    @{id=43; color="#0f172a"; name="Midnight"},
    @{id=44; color="#fbbf24"; name="Lemon"},
    @{id=45; color="#3b82f6"; name="Azure"},
    @{id=46; color="#b45309"; name="Copper"},
    @{id=47; color="#c084fc"; name="Lilac"},
    @{id=48; color="#18181b"; name="Onyx"},
    @{id=49; color="#4ade80"; name="Mint"},
    @{id=50; color="#2563eb"; name="Sapphire"},
    @{id=51; color="#f59e0b"; name="Tangerine"},
    @{id=52; color="#8b5cf6"; name="Periwinkle"},
    @{id=53; color="#404040"; name="Charcoal Pro"},
    @{id=54; color="#059669"; name="Emerald"},
    @{id=55; color="#991b1b"; name="Crimson Pro"}
)

foreach ($template in $colors) {
    $id = $template.id
    $color = $template.color
    $name = $template.name
    
    Write-Host "Creating Template $id - $name..."
    
    # Skip if already exists
    if ($id -le 6) {
        Write-Host "Template $id already exists, skipping..."
        continue
    }
    
    $folder = "src\app\resume-templates\template-$id"
    
    # Create folder if not exists
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
    }
    
    # Create HTML file
    $html = @"
<div class="executive-template">
  <div class="header-section">
    <div class="profile-area">
      <div class="profile-photo" *ngIf="data.photo">
        <img [src]="data.photo" alt="Profile">
      </div>
      <div class="header-text">
        <h1 class="name">{{data.name}}</h1>
        <h2 class="title">{{data.title}}</h2>
      </div>
    </div>
    <div class="contact-bar">
      <span *ngIf="data.email">✉ {{data.email}}</span>
      <span *ngIf="data.phone">📱 {{data.phone}}</span>
      <span *ngIf="data.location">📍 {{data.location}}</span>
    </div>
  </div>

  <div class="content-grid">
    <div class="main-column">
      <section *ngIf="data.summary" class="section">
        <h3 class="section-title">Professional Summary</h3>
        <p class="summary-text">{{data.summary}}</p>
      </section>

      <section *ngIf="data.experience?.length" class="section">
        <h3 class="section-title">Experience</h3>
        <div *ngFor="let exp of data.experience" class="experience-item">
          <div class="exp-header">
            <div>
              <h4 class="exp-role">{{exp.role}}</h4>
              <p class="exp-company">{{exp.company}}</p>
            </div>
            <span class="exp-duration">{{exp.duration}}</span>
          </div>
          <p class="exp-description">{{exp.description}}</p>
        </div>
      </section>

      <section *ngIf="data.education?.length" class="section">
        <h3 class="section-title">Education</h3>
        <div *ngFor="let edu of data.education" class="edu-item">
          <h4 class="edu-degree">{{edu.degree}}</h4>
          <p class="edu-school">{{edu.institution}} • {{edu.year}}</p>
        </div>
      </section>
    </div>

    <div class="side-column">
      <section *ngIf="data.skills?.length" class="section">
        <h3 class="section-title">Skills</h3>
        <div class="skills-list">
          <div *ngFor="let skill of data.skills" class="skill-item">▪ {{skill}}</div>
        </div>
      </section>

      <section *ngIf="data.certifications?.length" class="section">
        <h3 class="section-title">Certifications</h3>
        <div class="cert-list">
          <div *ngFor="let cert of data.certifications" class="cert-item">🏆 {{cert}}</div>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
.executive-template {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-section {
  background: linear-gradient(135deg, $color 0%, $color 100%);
  color: white;
  padding: 40px;
}

.profile-area {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.profile-photo img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
}

.name {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.title {
  font-size: 22px;
  font-weight: 400;
  margin: 0;
}

.contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.3);
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding: 40px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: $color;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 3px solid $color;
  text-transform: uppercase;
}

.summary-text {
  font-size: 15px;
  line-height: 1.7;
  color: #555;
}

.experience-item {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.exp-role {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.exp-company {
  font-size: 15px;
  color: $color;
  font-weight: 500;
  margin: 0;
}

.exp-duration {
  font-size: 14px;
  color: #777;
}

.exp-description {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.edu-item {
  margin-bottom: 20px;
}

.edu-degree {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.edu-school {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-item {
  font-size: 14px;
  color: #555;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cert-item {
  font-size: 13px;
  color: #555;
}
</style>
"@
    
    $html | Out-File -FilePath "$folder\template-$id.component.html" -Encoding UTF8
    
    # Create TS file
    $ts = @"
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data.interface';

@Component({
  selector: 'app-resume-template-$id',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-$id.component.html'
})
export class ResumeTemplate${id}Component {
  @Input() data!: ResumeData;
}
"@
    
    $ts | Out-File -FilePath "$folder\template-$id.component.ts" -Encoding UTF8
}

Write-Host "All templates created successfully!"
