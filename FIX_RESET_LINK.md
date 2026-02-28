# 🔧 Fix: "This site can't be reached"

## Problem
Email मध्ये link येतो पण click केल्यावर site open होत नाही

## Solution: Supabase Redirect URL Add करा

### Step 1: Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select project: `kwlaqovlzhxghwtilxxu`
3. Go to **Authentication** → **URL Configuration**

### Step 2: Add Redirect URLs

**Site URL:**
```
http://localhost:4200
```

**Redirect URLs (Add both):**
```
http://localhost:4200/reset-password
http://localhost:4200/**
```

### Step 3: Save Changes
Click **Save** button

### Step 4: Test Again

```bash
ng serve
```

1. Login → Forgot Password
2. Enter email → Send Reset Link
3. Check email
4. Click link → **आता काम करेल!** ✅

## Production Setup (Future)

जेव्हा deploy कराल तेव्हा production URL add करा:

```
https://your-domain.com/reset-password
https://your-domain.com/**
```

## Alternative: Test Locally

Email मधील link manually edit करा:

**Email मध्ये येतो:**
```
https://kwlaqovlzhxghwtilxxu.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=http://localhost:4200/reset-password
```

**Browser मध्ये paste करा:**
```
http://localhost:4200/reset-password#access_token=...
```

## Quick Test Without Email

Console मध्ये directly navigate करा:

```typescript
// Browser console (F12)
window.location.href = 'http://localhost:4200/reset-password';
```

## Verify Setup

Console मध्ये check करा:
```
🔗 Reset link will redirect to: http://localhost:4200/reset-password
```

---

**Supabase Dashboard → Authentication → URL Configuration → Add URLs → Save**

आता link काम करेल! 🚀
