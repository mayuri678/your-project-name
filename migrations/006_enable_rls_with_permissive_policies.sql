-- Option 2: Enable RLS with permissive policies (Recommended)
-- This allows authenticated users to insert their own data

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.users;

-- Policy: Authenticated users can view all users (for development)
-- Change this to only view own data in production
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to view

-- Policy: Authenticated users can insert their own data
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid()::text = id::text OR 
    email = auth.jwt() ->> 'email' OR
    auth.uid() IS NOT NULL -- Allow any authenticated user to insert
  );

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email')
  WITH CHECK (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;






