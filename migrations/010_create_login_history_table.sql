-- Create login_history table to track all login attempts
CREATE TABLE IF NOT EXISTS login_history (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT,
  login_time TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_login_history_email ON login_history(email);
CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time DESC);

-- Enable RLS
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on login_history" ON login_history
  FOR ALL USING (true);
