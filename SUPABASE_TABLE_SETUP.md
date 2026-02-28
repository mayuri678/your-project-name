# 🗄️ Supabase Table Setup - Password Reset Data

## Problem
Forgot password data Supabase मध्ये store होत नाही

## Solution
Table create करा आणि data automatically save होईल

## Setup Steps

### Step 1: Supabase Dashboard मध्ये जा

1. Open: https://supabase.com/dashboard
2. Select project: `kwlaqovlzhxghwtilxxu`
3. Go to: **SQL Editor**

### Step 2: Table Create करा

SQL Editor मध्ये हे paste करा आणि **Run** करा:

```sql
-- Create password_reset_requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reset_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  used BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_password_reset_email ON password_reset_requests(email);

-- Enable RLS
ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all access" ON password_reset_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 3: Verify Table

1. Go to: **Table Editor**
2. Select: `password_reset_requests`
3. Table दिसला = Success! ✅

### Step 4: Test

```bash
ng serve
```

1. Login → Forgot Password
2. Email enter → Send Reset Link
3. Supabase → Table Editor → password_reset_requests
4. **Data दिसेल!** ✅

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Auto increment ID |
| email | TEXT | User email |
| requested_at | TIMESTAMPTZ | Request time |
| reset_at | TIMESTAMPTZ | Reset completion time |
| used | BOOLEAN | Reset link used? |
| user_agent | TEXT | Browser info |

## What Gets Saved?

### When User Requests Reset:
```json
{
  "email": "user@example.com",
  "requested_at": "2024-01-15T10:30:00Z",
  "used": false,
  "user_agent": "Mozilla/5.0..."
}
```

### When User Completes Reset:
```json
{
  "email": "user@example.com",
  "requested_at": "2024-01-15T10:30:00Z",
  "reset_at": "2024-01-15T10:35:00Z",
  "used": true
}
```

## View Data

### Method 1: Supabase Dashboard
```
Dashboard → Table Editor → password_reset_requests
```

### Method 2: SQL Query
```sql
-- All reset requests
SELECT * FROM password_reset_requests 
ORDER BY requested_at DESC;

-- Specific user
SELECT * FROM password_reset_requests 
WHERE email = 'user@example.com';

-- Recent requests (last 24 hours)
SELECT * FROM password_reset_requests 
WHERE requested_at > NOW() - INTERVAL '24 hours';

-- Unused requests
SELECT * FROM password_reset_requests 
WHERE used = false;
```

### Method 3: Admin Dashboard
```
http://localhost:4200/admin/password-management
```

## Troubleshooting

### Table नाही दिसत?

1. **Check SQL ran successfully**
   - SQL Editor मध्ये green checkmark दिसला का?

2. **Refresh Table Editor**
   - F5 press करा

3. **Check permissions**
   ```sql
   GRANT ALL ON password_reset_requests TO authenticated;
   GRANT ALL ON password_reset_requests TO service_role;
   ```

### Data save होत नाही?

1. **Check console**
   ```
   📝 Reset request logged in Supabase
   ```

2. **Check RLS policies**
   ```sql
   -- Disable RLS temporarily for testing
   ALTER TABLE password_reset_requests DISABLE ROW LEVEL SECURITY;
   ```

3. **Check table exists**
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'password_reset_requests';
   ```

## Complete Flow

```
User → Forgot Password → Enter Email
  ↓
Supabase sends email
  ↓
Data saved in password_reset_requests table ✅
  ↓
User clicks email link
  ↓
Reset password page
  ↓
Password updated
  ↓
Table updated: used = true ✅
```

## Files Modified

1. ✅ `forgot-password.component.ts` - Logs to database
2. ✅ `reset-password.component.ts` - Updates used status
3. ✅ `migrations/create_password_reset_table.sql` - Table schema

## Quick Test

```bash
# 1. Run SQL in Supabase
Dashboard → SQL Editor → Paste SQL → Run

# 2. Start app
ng serve

# 3. Test reset
Login → Forgot Password → Email → Send

# 4. Check Supabase
Table Editor → password_reset_requests → See data! ✅
```

## Next Steps

1. ✅ Run SQL in Supabase Dashboard
2. ✅ Verify table created
3. ✅ Test password reset
4. ✅ Check data in table

---

**SQL file location:** `migrations/create_password_reset_table.sql`

**Copy SQL → Supabase SQL Editor → Run → Done!** 🚀
