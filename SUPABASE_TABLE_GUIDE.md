# How to Create a Table in Supabase

## Method 1: Using Supabase Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `kbgzpusbovtbbbwhoocu`

2. **Navigate to Table Editor**
   - Click on "Table Editor" in the left sidebar
   - Click "New Table" button

3. **Create Table**
   - Enter table name (e.g., `resumes`, `user_profiles`)
   - Add columns with their types
   - Set primary key
   - Click "Save"

## Method 2: Using SQL Editor (Recommended for Complex Tables)

1. **Go to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

2. **Run SQL Script**
   - Copy and paste one of the example SQL scripts below
   - Click "Run" or press `Ctrl+Enter`

## Example SQL Scripts

### Example 1: Resumes Table
```sql
-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin TEXT,
  github TEXT,
  education JSONB,
  skills TEXT[],
  experience JSONB,
  projects JSONB,
  template_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own resumes
CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own resumes
CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own resumes
CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
```

### Example 2: User Profiles Table
```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT,
  contact_no TEXT,
  address TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  pincode TEXT,
  photo TEXT, -- Base64 or URL
  notification BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

### Example 3: Resume Templates Table
```sql
-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  columns INTEGER DEFAULT 1,
  has_headshot BOOLEAN DEFAULT false,
  has_graphics BOOLEAN DEFAULT false,
  color TEXT,
  recommended BOOLEAN DEFAULT false,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default templates
INSERT INTO templates (id, name, description, columns, has_headshot, has_graphics, color, recommended) VALUES
('template1', 'Modern Blue', 'Clean and professional single column template', 1, true, false, 'blue', true),
('template2', 'Classic Two Column', 'Traditional two-column layout', 2, true, false, 'navy', false),
('template3', 'Creative Design', 'Modern template with graphics', 1, true, true, 'purple', false);
```

## Method 3: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Create a new migration
supabase migration new create_resumes_table

# Edit the migration file in supabase/migrations/
# Then apply it
supabase db push
```

## After Creating the Table

Once your table is created, you can interact with it from your Angular app using the SupabaseService. Here's an example of how to add methods to your service:

```typescript
// In supabase.service.ts

// Get all resumes for current user
async getResumes() {
  const { data, error } = await this.supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// Create a new resume
async createResume(resumeData: any) {
  const { data, error } = await this.supabase
    .from('resumes')
    .insert([resumeData])
    .select()
    .single();
  return { data, error };
}

// Update a resume
async updateResume(id: string, resumeData: any) {
  const { data, error } = await this.supabase
    .from('resumes')
    .update(resumeData)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Delete a resume
async deleteResume(id: string) {
  const { data, error } = await this.supabase
    .from('resumes')
    .delete()
    .eq('id', id);
  return { data, error };
}
```

## Important Notes

1. **Row Level Security (RLS)**: Always enable RLS for security
2. **Policies**: Create policies to control who can access what data
3. **Indexes**: Add indexes on frequently queried columns (like `user_id`)
4. **Foreign Keys**: Use foreign keys to maintain data integrity
5. **Timestamps**: Include `created_at` and `updated_at` for tracking

## Need Help?

Tell me what kind of table you want to create, and I can:
- Generate the exact SQL script for your needs
- Add methods to your SupabaseService to interact with the table
- Help you set up proper security policies












