-- Create user_profile table in Supabase
CREATE TABLE user_profile (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic User Info
    username VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contact_no VARCHAR(20),
    
    -- Profile Photo
    profile_photo TEXT, -- Store base64 or URL
    
    -- Education Details
    education_level VARCHAR(50),
    degree VARCHAR(150),
    institution VARCHAR(200),
    graduation_year INTEGER,
    
    -- Address Details
    address TEXT,
    street VARCHAR(150),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(10),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profile_updated_at 
    BEFORE UPDATE ON user_profile 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security) - DISABLED for custom auth
ALTER TABLE user_profile DISABLE ROW LEVEL SECURITY;

-- Alternative: Create policies that work with custom auth
-- Uncomment these if you want to enable RLS later with proper user context
/*
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to manage their own profile
CREATE POLICY "Users can view own profile" ON user_profile
    FOR SELECT USING (true); -- Allow all for now

CREATE POLICY "Users can insert own profile" ON user_profile
    FOR INSERT WITH CHECK (true); -- Allow all for now

CREATE POLICY "Users can update own profile" ON user_profile
    FOR UPDATE USING (true); -- Allow all for now
*/