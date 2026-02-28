# 🚀 Password Reset Table - Quick Setup

## Step 1: Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select: `kwlaqovlzhxghwtilxxu`
3. Click: **SQL Editor**
4. Click: **New Query**

## Step 2: Copy-Paste & Run

```sql
-- Old table delete
DROP TABLE IF EXISTS password_reset_requests CASCADE;

-- New table create
CREATE TABLE password_reset_requests (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  user_name TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reset_at TIMESTAMPTZ,
  used BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  ip_address TEXT
);

-- Index
CREATE INDEX idx_reset_email ON password_reset_requests(email);

-- Permissions
ALTER TABLE password_reset_requests DISABLE ROW LEVEL SECURITY;
GRANT ALL ON password_reset_requests TO anon;
GRANT ALL ON password_reset_requests TO authenticated;
GRANT ALL ON password_reset_requests TO service_role;

-- Test
INSERT INTO password_reset_requests (email, user_name, used) 
VALUES ('test@example.com', 'Test User', false);

SELECT * FROM password_reset_requests;
```

5. Click: **RUN** (या **F5**)

## Step 3: Verify

Table Editor मध्ये जा:
- Table: `password_reset_requests`
- 1 row दिसला = Success! ✅

## Step 4: Test App

```bash
ng serve
```

1. Login → Forgot Password
2. Email: `user@example.com`
3. Send Reset Link
4. Console: `✅ Reset request saved`
5. Supabase → Table Editor → **Data दिसेल!**

## What Gets Saved?

| Column | Example | Description |
|--------|---------|-------------|
| id | 1 | Auto ID |
| email | user@example.com | User email |
| user_name | user | Username |
| requested_at | 2024-01-15 10:30 | Request time |
| reset_at | 2024-01-15 10:35 | Reset time |
| used | false/true | Link used? |
| user_agent | Mozilla/5.0... | Browser |

## View Data

```sql
-- All requests
SELECT * FROM password_reset_requests 
ORDER BY requested_at DESC;

-- Specific user
SELECT * FROM password_reset_requests 
WHERE email = 'user@example.com';

-- Today's requests
SELECT * FROM password_reset_requests 
WHERE requested_at::date = CURRENT_DATE;
```

## Troubleshooting

### Error: permission denied?
```sql
ALTER TABLE password_reset_requests DISABLE ROW LEVEL SECURITY;
```

### Table नाही दिसत?
- Refresh browser (F5)
- Check SQL ran successfully (green checkmark)

### Data save होत नाही?
Console check करा:
```
✅ Reset request saved: [{...}]
या
❌ Failed to log: {error details}
```

---

**File:** `CREATE_RESET_TABLE.sql`

**Copy SQL → Supabase → Run → Done!** 🎉
