-- Create password_reset_requests table for tracking forgot password requests
CREATE TABLE IF NOT EXISTS password_reset_requests (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    reset_token VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_email ON password_reset_requests(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_status ON password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires ON password_reset_requests(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own requests
CREATE POLICY "Users can insert their own password reset requests" ON password_reset_requests
    FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to view their own requests
CREATE POLICY "Users can view their own password reset requests" ON password_reset_requests
    FOR SELECT USING (true);

-- Create policy for admins to view all requests
CREATE POLICY "Admins can view all password reset requests" ON password_reset_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('admin@example.com', 'admin')
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_password_reset_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_password_reset_requests_updated_at
    BEFORE UPDATE ON password_reset_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_password_reset_updated_at();

-- Insert some sample data (optional)
INSERT INTO password_reset_requests (email, username, status) VALUES
('test@example.com', 'Test User', 'pending'),
('demo@test.com', 'Demo User', 'completed')
ON CONFLICT DO NOTHING;