import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AppSetting } from '../../models/admin.models';
import { SettingsGroupLabelPipe } from './settings-group-label.pipe';

interface SettingsGroup {
  label: string;
  icon: string;
  keys: string[];
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsGroupLabelPipe],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  settings: Record<string, AppSetting> = {};
  editValues: Record<string, string> = {};
  loading = true;
  saving = false;
  error = '';
  successMsg = '';
  activeGroup = 'general';
  logoFile: File | null = null;
  logoPreview = '';

  readonly groups: SettingsGroup[] = [
    { label: 'General', icon: '⚙️', keys: ['site_name', 'site_logo', 'max_resumes_free', 'ai_suggestions_enabled'] },
    { label: 'Email Templates', icon: '📧', keys: ['welcome_email_template', 'otp_email_template'] },
    { label: 'PDF Export', icon: '📄', keys: ['pdf_page_size', 'pdf_margin'] }
  ];

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    this.loading = true;
    const { data, error } = await this.supabase.getAllSettings();
    if (error) {
      this.error = 'Could not connect to Supabase. Check your connection.';
    } else if (!data || data.length === 0) {
      // Table doesn't exist yet — show default values so UI is usable
      this.loadDefaultSettings();
    } else {
      for (const s of data) {
        this.settings[s.key] = s;
        this.editValues[s.key] = s.value || '';
      }
      if (this.editValues['site_logo']) {
        this.logoPreview = this.editValues['site_logo'];
      }
    }
    this.loading = false;
  }

  private loadDefaultSettings(): void {
    const defaults: Record<string, string> = {
      site_name: 'Resume Builder',
      site_logo: '',
      max_resumes_free: '3',
      ai_suggestions_enabled: 'true',
      welcome_email_template: '<h2>Welcome!</h2><p>Thanks for joining {{site_name}}.</p>',
      otp_email_template: '<h2>Your OTP</h2><p>Code: <strong>{{otp}}</strong></p>',
      pdf_page_size: 'A4',
      pdf_margin: '20'
    };
    for (const [key, value] of Object.entries(defaults)) {
      this.editValues[key] = value;
      this.settings[key] = { id: '', key, value, type: 'string', updated_at: '' };
    }
  }

  get activeKeys(): string[] {
    return this.groups.find(g => g.label.toLowerCase() === this.activeGroup)?.keys || [];
  }

  getLabel(key: string): string {
    const labels: Record<string, string> = {
      site_name: 'Website Name',
      site_logo: 'Logo URL',
      max_resumes_free: 'Max Resumes (Free Users)',
      ai_suggestions_enabled: 'AI Suggestions Enabled',
      welcome_email_template: 'Welcome Email HTML',
      otp_email_template: 'OTP Email HTML',
      pdf_page_size: 'PDF Page Size',
      pdf_margin: 'PDF Margin (px)'
    };
    return labels[key] || key;
  }

  isTextarea(key: string): boolean {
    return key.includes('template');
  }

  isSelect(key: string): boolean {
    return key === 'pdf_page_size';
  }

  isToggle(key: string): boolean {
    return this.settings[key]?.type === 'boolean';
  }

  onLogoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.logoFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => { this.logoPreview = e.target?.result as string; };
      reader.readAsDataURL(this.logoFile);
    }
  }

  async saveGroup(): Promise<void> {
    this.saving = true;
    this.error = '';
    this.successMsg = '';

    // Upload logo if file selected
    if (this.logoFile) {
      const { url, error } = await this.supabase.uploadTemplatePreview(this.logoFile, 'site-logo');
      if (url) {
        this.editValues['site_logo'] = url;
        this.logoPreview = url;
      }
      this.logoFile = null;
    }

    const promises = this.activeKeys.map(key =>
      this.supabase.upsertSetting(key, this.editValues[key] ?? '')
    );

    const results = await Promise.all(promises);
    const failed = results.filter(r => r.error);

    if (failed.length > 0) {
      this.error = 'Settings table not found in Supabase. Run migration 011 first. Values saved locally.';
      // Still update local state so UI reflects changes
      for (const key of this.activeKeys) {
        if (this.settings[key]) this.settings[key].value = this.editValues[key];
      }
    } else {
      this.successMsg = 'Settings saved successfully!';
      setTimeout(() => { this.successMsg = ''; }, 3000);
    }
    this.saving = false;
  }
}
