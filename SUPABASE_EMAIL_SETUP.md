# 🚀 Supabase Email Setup - Password Reset

## ✅ Solution Implemented

आता **Supabase Auth** वापरून automatic emails जातील!

## How It Works

```
User → Forgot Password → Enter Email
  ↓
Supabase sends reset link to email
  ↓
User clicks link in email
  ↓
Opens reset-password page
  ↓
User enters new password
  ↓
Password updated in Supabase
```

## Supabase Email Settings

### Step 1: Enable Email Auth

1. Go to: https://supabase.com/dashboard
2. Select your project: `kwlaqovlzhxghwtilxxu`
3. Go to **Authentication** → **Providers**
4. Enable **Email** provider
5. Save changes

### Step 2: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Find **Reset Password** template
3. Customize if needed (optional)

### Step 3: Test Email Delivery

**Development Mode:**
- Supabase sends emails automatically
- Check your email inbox (including spam)
- Email comes from: `noreply@mail.app.supabase.io`

**Production Mode:**
- Configure custom SMTP (optional)
- Go to **Project Settings** → **Auth** → **SMTP Settings**

## Files Changed

1. ✅ `forgot-password.component.ts` - Uses Supabase Auth
2. ✅ `forgot-password.component.html` - Simplified UI
3. ✅ `reset-password.component.ts` - Handles password reset

## Testing Steps

### 1. Test Forgot Password

```bash
ng serve
```

1. Go to login page
2. Click "Forgot Password?"
3. Enter email: `test@example.com`
4. Click "Send Reset Link"
5. Check email inbox

### 2. Test Reset Link

1. Open email
2. Click reset link
3. Enter new password
4. Submit
5. Login with new password

## Email Template

Supabase sends email like this:

```
Subject: Reset Your Password

Hi,

Follow this link to reset your password:
[Reset Password Button]

If you didn't request this, ignore this email.

This link expires in 1 hour.
```

## Troubleshooting

### Email नाही येत?

1. **Check Spam Folder**
   - Supabase emails sometimes go to spam

2. **Verify Email Provider**
   ```
   Dashboard → Authentication → Providers
   Email provider enabled आहे का?
   ```

3. **Check Supabase Logs**
   ```
   Dashboard → Logs → Auth Logs
   Email sent होतो का check करा
   ```

4. **Test with Different Email**
   - Gmail, Outlook, Yahoo try करा

### Link काम करत नाही?

1. **Check URL**
   - Link should contain: `#access_token=...`
   - Supabase automatically handles this

2. **Link Expired?**
   - Links expire in 1 hour
   - Request new reset link

3. **Check Console**
   ```javascript
   // Browser console मध्ये errors check करा
   F12 → Console
   ```

## Development vs Production

### Development (Current)
- ✅ Supabase sends emails automatically
- ✅ No configuration needed
- ✅ Free tier: 30,000 emails/month

### Production (Future)
- Configure custom SMTP
- Use your own email domain
- Better deliverability

## Custom SMTP Setup (Optional)

For production, configure custom SMTP:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enter your SMTP details:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```

### Gmail SMTP Example

1. Enable 2-factor authentication
2. Generate App Password
3. Use in Supabase SMTP settings

## Email Limits

**Supabase Free Tier:**
- 30,000 emails/month
- 3 emails/hour per user
- Enough for development & small apps

**Need More?**
- Upgrade to Pro plan
- Or use custom SMTP

## Next Steps

1. ✅ Code already updated
2. ✅ Supabase configured
3. 🔄 Test the flow:
   ```bash
   ng serve
   Login → Forgot Password → Enter Email
   ```
4. 📧 Check your email inbox

## Support

**Supabase Docs:**
- https://supabase.com/docs/guides/auth/auth-email

**Email Issues:**
- Check Supabase Dashboard → Logs
- Contact Supabase support

---

**Note:** Supabase automatically handles email sending. तुम्हाला फक्त test करायचं आहे!
