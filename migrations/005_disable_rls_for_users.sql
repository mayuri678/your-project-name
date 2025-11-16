-- Option 1: Disable RLS temporarily (for testing/development)
-- This allows all users to insert/read data without RLS restrictions
-- WARNING: Only use this for development, not production!

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled but allow inserts, use Option 2 below instead






