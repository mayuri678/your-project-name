-- Create templates table for storing user template data
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, template_id)
);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own templates" ON templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates" ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON templates
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_updated_at ON templates(updated_at DESC);