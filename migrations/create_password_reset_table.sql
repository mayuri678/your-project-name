-- Create password_reset_requests table in Supabase

CREATE TABLE IF NOT EXISTS password_reset_requests (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reset_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  used BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_password_reset_email ON password_reset_requests(email);
CREATE INDEX idx_password_reset_token ON password_reset_requests(token);

-- Enable Row Level Security
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to access
CREATE POLICY "Allow service role full access" ON password_reset_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON password_reset_requests TO authenticated;
GRANT ALL ON password_reset_requests TO service_role;
