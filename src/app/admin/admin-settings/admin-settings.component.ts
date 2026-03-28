import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { AppSetting } from '../../models/admin.models';

interface SettingsGroup {
  label: string;
  icon: string;
  key: string;
  keys: string[];
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  adminPassword = '';
  adminPasswordConfirm = '';
  passwordMsg = '';

  readonly groups: SettingsGroup[] = [
    { label: 'General',        icon: '⚙️',  key: 'general',   keys: ['site_name', 'site_tagline', 'site_logo', 'contact_email', 'support_phone'] },
    { label: 'User Limits',    icon: '👥',  key: 'limits',    keys: ['max_resumes_free', 'max_resumes_premium', 'max_templates_free', 'session_timeout_minutes'] },
    { label: 'Features',       icon: '🚀',  key: 'features',  keys: ['ai_suggestions_enabled', 'resume_download_enabled', 'user_registration_enabled', 'maintenance_mode'] },
    { label: 'Email',          icon: '📧',  key: 'email',     keys: ['welcome_email_template', 'otp_email_template', 'reset_email_template'] },
    { label: 'PDF Export',     icon: '📄',  key: 'pdf',       keys: ['pdf_page_size', 'pdf_margin', 'pdf_watermark_enabled', 'pdf_watermark_text'] },
    { label: 'Security',       icon: '🔒',  key: 'security',  keys: ['min_password_length', 'require_email_verification', 'max_login_attempts', 'two_factor_enabled'] },
    { label: 'Admin Account',  icon: '👤',  key: 'admin',     keys: [] }
  ];

  private readonly defaults: Record<string, { value: string; type: string }> = {
    site_name:                  { value: 'Resume Builder',                    type: 'string' },
    site_tagline:               { value: 'Build Your Dream Resume',           type: 'string' },
    site_logo:                  { value: '',                                  type: 'string' },
    contact_email:              { value: 'admin@resumebuilder.com',           type: 'string' },
    support_phone:              { value: '+91 9999999999',                    type: 'string' },
    max_resumes_free:           { value: '3',                                 type: 'number' },
    max_resumes_premium:        { value: '20',                                type: 'number' },
    max_templates_free:         { value: '5',                                 type: 'number' },
    session_timeout_minutes:    { value: '60',                                type: 'number' },
    ai_suggestions_enabled:     { value: 'true',                              type: 'boolean' },
    resume_download_enabled:    { value: 'true',                              type: 'boolean' },
    user_registration_enabled:  { value: 'true',                              type: 'boolean' },
    maintenance_mode:           { value: 'false',                             type: 'boolean' },
    welcome_email_template:     { value: '<h2>Welcome to {{site_name}}!</h2><p>Thanks for joining us.</p>', type: 'string' },
    otp_email_template:         { value: '<h2>Your OTP</h2><p>Code: <strong>{{otp}}</strong></p>',         type: 'string' },
    reset_email_template:       { value: '<h2>Password Reset</h2><p>Click <a href="{{link}}">here</a> to reset.</p>', type: 'string' },
    pdf_page_size:              { value: 'A4',                                type: 'string' },
    pdf_margin:                 { value: '20',                                type: 'number' },
    pdf_watermark_enabled:      { value: 'false',                             type: 'boolean' },
    pdf_watermark_text:         { value: 'Resume Builder',                    type: 'string' },
    min_password_length:        { value: '6',                                 type: 'number' },
    require_email_verification: { value: 'false',                             type: 'boolean' },
    max_login_attempts:         { value: '5',                                 type: 'number' },
    two_factor_enabled:         { value: 'false',                             type: 'boolean' }
  };

  constructor(private supabase: SupabaseService) {}

  ngOnInit(): void { this.loadSettings(); }

  async loadSettings(): Promise<void> {
    this.loading = true;
    try {
      this.loadDefaultSettings(); // defaults first
      const { data } = await this.supabase.getAllSettings();
      if (data && data.length > 0) {
        for (const s of data) {
          this.settings[s.key] = s;
          this.editValues[s.key] = s.value ?? '';
        }
        if (this.editValues['site_logo']) this.logoPreview = this.editValues['site_logo'];
      } else {
        // Table empty - seed defaults to DB
        await this.seedDefaultsToDB();
      }
    } catch {
      // DB not reachable - use defaults only
    } finally {
      this.loading = false;
    }
  }

  private async seedDefaultsToDB(): Promise<void> {
    try {
      await Promise.all(
        Object.entries(this.defaults).map(([key, meta]) =>
          this.supabase.upsertSetting(key, meta.value, meta.type)
        )
      );
    } catch { /* silent */ }
  }

  private loadDefaultSettings(): void {
    for (const [key, meta] of Object.entries(this.defaults)) {
      this.editValues[key] = meta.value;
      this.settings[key] = { id: '', key, value: meta.value, type: meta.type as any, updated_at: '' };
    }
  }

  get activeKeys(): string[] {
    return this.groups.find(g => g.key === this.activeGroup)?.keys || [];
  }

  getLabel(key: string): string {
    const labels: Record<string, string> = {
      site_name: 'Website Name', site_tagline: 'Site Tagline', site_logo: 'Site Logo',
      contact_email: 'Contact Email', support_phone: 'Support Phone',
      max_resumes_free: 'Max Resumes (Free)', max_resumes_premium: 'Max Resumes (Premium)',
      max_templates_free: 'Max Templates (Free)', session_timeout_minutes: 'Session Timeout (min)',
      ai_suggestions_enabled: 'AI Suggestions', resume_download_enabled: 'Resume Download',
      user_registration_enabled: 'User Registration', maintenance_mode: '🚧 Maintenance Mode',
      welcome_email_template: 'Welcome Email HTML', otp_email_template: 'OTP Email HTML',
      reset_email_template: 'Password Reset Email HTML',
      pdf_page_size: 'PDF Page Size', pdf_margin: 'PDF Margin (px)',
      pdf_watermark_enabled: 'PDF Watermark', pdf_watermark_text: 'Watermark Text',
      min_password_length: 'Min Password Length', require_email_verification: 'Email Verification',
      max_login_attempts: 'Max Login Attempts', two_factor_enabled: '2FA Enabled'
    };
    return labels[key] || key;
  }

  getHint(key: string): string {
    const hints: Record<string, string> = {
      maintenance_mode: 'When ON, only admins can access the site',
      session_timeout_minutes: 'Auto logout after inactivity (minutes)',
      max_login_attempts: 'Account locked after this many failed attempts',
      pdf_watermark_text: 'Text shown on watermarked PDFs',
      welcome_email_template: 'Variables: {{site_name}}, {{user_name}}',
      otp_email_template: 'Variables: {{otp}}, {{user_name}}',
      reset_email_template: 'Variables: {{link}}, {{user_name}}'
    };
    return hints[key] || '';
  }

  isTextarea(key: string): boolean { return key.includes('template'); }
  isSelect(key: string): boolean { return key === 'pdf_page_size'; }
  isBoolean(key: string): boolean { return this.defaults[key]?.type === 'boolean'; }
  isNumber(key: string): boolean { return this.defaults[key]?.type === 'number'; }

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
    this.saving = true; this.error = ''; this.successMsg = '';
    try {
      if (this.logoFile) {
        const { url } = await this.supabase.uploadTemplatePreview(this.logoFile, 'site-logo');
        if (url) {
          this.editValues['site_logo'] = url;
          this.logoPreview = url;
        }
        this.logoFile = null;
      }

      const results = await Promise.all(
        this.activeKeys.map(key =>
          this.supabase.upsertSetting(key, this.editValues[key] ?? '', this.defaults[key]?.type || 'string')
        )
      );

      const anyFailed = results.some(r => r.error);
      if (anyFailed) {
        // Update local state even if DB failed
        for (const key of this.activeKeys) {
          if (this.settings[key]) this.settings[key].value = this.editValues[key];
        }
        this.error = '⚠️ Saved locally. Run the settings SQL migration in Supabase to persist.';
      } else {
        // Refresh from DB to confirm
        for (const key of this.activeKeys) {
          if (this.settings[key]) this.settings[key].value = this.editValues[key];
        }
        this.successMsg = '✅ Settings saved to database!';
        // Update localStorage cache
        const cached = JSON.parse(localStorage.getItem('site_settings') || '{}');
        for (const key of this.activeKeys) {
          cached[key] = this.editValues[key];
        }
        localStorage.setItem('site_settings', JSON.stringify(cached));
        setTimeout(() => { this.successMsg = ''; }, 3000);
      }
    } catch (e: any) {
      this.error = '❌ Save failed: ' + (e?.message || 'Unknown error');
    } finally {
      this.saving = false;
    }
  }

  async changeAdminPassword(): Promise<void> {
    this.passwordMsg = '';
    if (!this.adminPassword || this.adminPassword.length < 6) {
      this.passwordMsg = '❌ Password must be at least 6 characters.'; return;
    }
    if (this.adminPassword !== this.adminPasswordConfirm) {
      this.passwordMsg = '❌ Passwords do not match.'; return;
    }
    try {
      const { error } = await this.supabase.supabaseClient.auth.updateUser({ password: this.adminPassword });
      if (error) { this.passwordMsg = '❌ ' + error.message; }
      else {
        this.passwordMsg = '✅ Password changed successfully!';
        this.adminPassword = ''; this.adminPasswordConfirm = '';
      }
    } catch { this.passwordMsg = '❌ Failed to change password.'; }
  }

  getActiveGroupIcon(): string {
    return this.groups.find(g => g.key === this.activeGroup)?.icon || '';
  }

  getActiveGroupLabel(): string {
    return this.groups.find(g => g.key === this.activeGroup)?.label || '';
  }

  exportSettings(): void {
    const blob = new Blob([JSON.stringify(this.editValues, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'admin-settings.json';
    a.click();
  }
}
