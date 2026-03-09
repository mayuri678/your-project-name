-- Supabase Database Schema for Resume Templates

-- 1. Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id SERIAL PRIMARY KEY,
  template_id INTEGER NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user_resumes table to store user's resume data with template selection
CREATE TABLE IF NOT EXISTS public.user_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES public.templates(template_id),
  resume_name VARCHAR(255),
  resume_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert default templates
INSERT INTO public.templates (template_id, name, category) VALUES
(1, 'Classic Professional', 'Professional'),
(2, 'Modern Blue', 'Modern'),
(3, 'Creative Green', 'Creative'),
(4, 'Professional Purple', 'Professional'),
(5, 'Elegant Red', 'Elegant'),
(6, 'Minimal Gray', 'Minimal'),
(7, 'Bold Orange', 'Bold'),
(8, 'Tech Teal', 'Tech'),
(9, 'Corporate Navy', 'Corporate'),
(10, 'Fresh Lime', 'Fresh')
-- Add more as needed
ON CONFLICT (template_id) DO NOTHING;

-- 4. Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;

-- 5. Create policies
CREATE POLICY "Templates are viewable by everyone" ON public.templates
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own resumes" ON public.user_resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" ON public.user_resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" ON public.user_resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" ON public.user_resumes
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Create indexes for better performance
CREATE INDEX idx_user_resumes_user_id ON public.user_resumes(user_id);
CREATE INDEX idx_user_resumes_template_id ON public.user_resumes(template_id);
CREATE INDEX idx_templates_category ON public.templates(category);
