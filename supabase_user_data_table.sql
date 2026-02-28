-- Create user_data table in Supabase
CREATE TABLE IF NOT EXISTS user_data (
  id TEXT PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  username TEXT,
  contactNo TEXT,
  address TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  pincode TEXT,
  photo TEXT,
  education TEXT,
  degree TEXT,
  institution TEXT,
  graduationYear TEXT,
  role TEXT DEFAULT 'user',
  is_dark_mode BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations on user_data" ON user_data
  FOR ALL
  USING (true)
  WITH CHECK (true);
