-- Supabase SQL Editor मध्ये हे paste करा आणि RUN करा

-- Old table delete करा (if exists)
DROP TABLE IF EXISTS password_reset_requests CASCADE;

-- New table create करा
CREATE TABLE password_reset_requests (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  user_name TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reset_at TIMESTAMPTZ,
  used BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  ip_address TEXT
);

-- Index create करा (fast search)
CREATE INDEX idx_reset_email ON password_reset_requests(email);
CREATE INDEX idx_reset_date ON password_reset_requests(requested_at);

-- RLS disable करा (testing साठी)
ALTER TABLE password_reset_requests DISABLE ROW LEVEL SECURITY;

-- Permissions दया
GRANT ALL ON password_reset_requests TO anon;
GRANT ALL ON password_reset_requests TO authenticated;
GRANT ALL ON password_reset_requests TO service_role;

-- Test data insert करा
INSERT INTO password_reset_requests (email, user_name, used) 
VALUES ('test@example.com', 'Test User', false);

-- Verify - data दिसला का check करा
SELECT * FROM password_reset_requests;
