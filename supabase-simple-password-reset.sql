-- Simple password_reset_requests table
CREATE TABLE password_reset_requests (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    requested_at TIMESTAMP DEFAULT NOW()
);

-- Allow public access for this table (since it's just logging requests)
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON password_reset_requests
    FOR ALL USING (true) WITH CHECK (true);