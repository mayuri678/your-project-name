-- Fix RLS (Row Level Security) policies for users table
-- This allows authenticated users to read their own data

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;

-- Policy: Users can view their own data
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

-- Policy: Allow service role to manage all users (for triggers)
CREATE POLICY "Service role can manage users"
  ON public.users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Also allow the trigger function to insert/update
-- The trigger function runs with SECURITY DEFINER, so it should work
-- But we need to make sure the function can access the table

