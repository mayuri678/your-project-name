-- Create email_queue table in Supabase
CREATE TABLE email_queue (
  id SERIAL PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP NULL
);

-- Create index for better performance
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);

-- Enable Row Level Security (optional)
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert emails
CREATE POLICY "Users can insert emails" ON email_queue
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow service role to read/update emails
CREATE POLICY "Service can manage emails" ON email_queue
  FOR ALL USING (auth.role() = 'service_role');

-- Insert sample email (for testing)
INSERT INTO email_queue (to_email, subject, body) VALUES 
('test@example.com', 'Test Email', 'This is a test email from Supabase');

-- View all emails in queue
SELECT * FROM email_queue ORDER BY created_at DESC;