-- ============================================================
-- Admin Panel Full Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  content JSONB,
  template_id TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DOWNLOADS TABLE
CREATE TABLE IF NOT EXISTS downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  template_id TEXT,
  format TEXT DEFAULT 'pdf' CHECK (format IN ('pdf', 'docx', 'txt')),
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'string' CHECK (type IN ('string', 'json', 'boolean', 'number')),
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, type, description) VALUES
  ('site_name', 'Resume Builder', 'string', 'Website display name'),
  ('site_logo', '', 'string', 'Logo URL'),
  ('pdf_page_size', 'A4', 'string', 'Default PDF export page size'),
  ('pdf_margin', '20', 'number', 'PDF margin in px'),
  ('welcome_email_template', '<h2>Welcome!</h2><p>Thanks for joining {{site_name}}.</p>', 'string', 'Welcome email HTML'),
  ('otp_email_template', '<h2>Your OTP</h2><p>Code: <strong>{{otp}}</strong></p><p>Expires in 5 minutes.</p>', 'string', 'OTP email HTML'),
  ('max_resumes_free', '3', 'number', 'Max resumes for free users'),
  ('ai_suggestions_enabled', 'true', 'boolean', 'Enable AI resume suggestions')
ON CONFLICT (key) DO NOTHING;

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'announcement')),
  channel TEXT DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'both')),
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- 5. Add is_premium & preview_url to templates if not exists
ALTER TABLE templates ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS preview_url TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 6. Add role to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'editor'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_featured ON resumes(is_featured);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_resume_id ON downloads(resume_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Resumes: users see own, admins see all
CREATE POLICY "Users can manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all resumes" ON resumes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Downloads: users see own, admins see all
CREATE POLICY "Users can view own downloads" ON downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads" ON downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all downloads" ON downloads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Settings: public read, admin write
CREATE POLICY "Anyone can read settings" ON settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Notifications: users see own, admins manage all
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- HELPER FUNCTION: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ANALYTICS VIEW (for dashboard)
-- ============================================================
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS active_users,
  (SELECT COUNT(*) FROM resumes) AS total_resumes,
  (SELECT COUNT(*) FROM resumes WHERE is_featured = TRUE) AS featured_resumes,
  (SELECT COUNT(*) FROM templates) AS total_templates,
  (SELECT COUNT(*) FROM templates WHERE is_premium = TRUE) AS premium_templates,
  (SELECT COUNT(*) FROM downloads) AS total_downloads,
  (SELECT COUNT(*) FROM downloads WHERE downloaded_at >= NOW() - INTERVAL '30 days') AS monthly_downloads,
  (SELECT COUNT(*) FROM notifications WHERE is_read = FALSE) AS unread_notifications;
