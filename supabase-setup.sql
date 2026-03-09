-- Run this in Supabase SQL Editor
-- Dashboard -> SQL Editor -> New Query -> Paste this

-- Create user_resumes table
CREATE TABLE IF NOT EXISTS user_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL,
  resume_name VARCHAR(255),
  resume_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert own resumes" 
ON user_resumes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own resumes" 
ON user_resumes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" 
ON user_resumes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" 
ON user_resumes FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_resumes_user_id ON user_resumes(user_id);
CREATE INDEX idx_user_resumes_template_id ON user_resumes(template_id);
