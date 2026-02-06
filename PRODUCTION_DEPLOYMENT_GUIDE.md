# Production Deployment Guide - Contact Form with SendGrid

## Prerequisites
- Supabase account and project
- SendGrid account (free tier available)
- Supabase CLI installed
- Node.js installed

---

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

---

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window. Authorize the CLI.

---

## Step 3: Link Your Project

Get your project reference ID from Supabase Dashboard (Settings > General > Reference ID)

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Example:
```bash
supabase link --project-ref abcdefghijklmnop
```

---

## Step 4: Get SendGrid API Key

1. Go to https://sendgrid.com/
2. Sign up or login
3. Navigate to: Settings > API Keys
4. Click "Create API Key"
5. Name: `Resume Builder Contact Form`
6. Permissions: Select "Restricted Access"
7. Enable: Mail Send > Full Access
8. Click "Create & View"
9. **COPY THE API KEY** (you won't see it again!)

---

## Step 5: Set SendGrid API Key as Supabase Secret

```bash
supabase secrets set SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY_HERE
```

Example:
```bash
supabase secrets set SENDGRID_API_KEY=SG.abc123xyz789...
```

Verify secret is set:
```bash
supabase secrets list
```

---

## Step 6: Verify SendGrid Sender Email

**IMPORTANT:** SendGrid requires sender verification.

### Option A: Single Sender Verification (Easiest)
1. Go to SendGrid Dashboard > Settings > Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in your details:
   - From Name: Resume Builder
   - From Email: your-email@gmail.com (use gulvemayuri63@gmail.com)
   - Reply To: same as above
4. Check your email and click verification link

### Option B: Domain Authentication (Professional)
1. Go to Settings > Sender Authentication > Authenticate Your Domain
2. Follow DNS setup instructions
3. Use your custom domain

---

## Step 7: Update Edge Function with Verified Sender

Edit: `supabase/functions/send-contact-email/index.ts`

Change line 24:
```typescript
from: { email: 'noreply@yourdomain.com', name: 'Resume Builder Contact Form' },
```

To your verified email:
```typescript
from: { email: 'gulvemayuri63@gmail.com', name: 'Resume Builder Contact Form' },
```

---

## Step 8: Deploy Edge Function

```bash
supabase functions deploy send-contact-email
```

You should see:
```
Deploying function send-contact-email...
Function deployed successfully!
```

---

## Step 9: Test Edge Function

### Test from command line:
```bash
supabase functions invoke send-contact-email --data '{"full_name":"Test User","email":"test@example.com","message":"Test message"}'
```

### Test from your app:
1. Run your Angular app: `ng serve`
2. Go to Contact page
3. Fill form and submit
4. Check:
   - Supabase Dashboard > Table Editor > contact_messages (data saved)
   - Email inbox at gulvemayuri63@gmail.com (email received)

---

## Step 10: View Edge Function Logs

If email doesn't arrive, check logs:

```bash
supabase functions logs send-contact-email
```

Or in Supabase Dashboard:
- Go to Edge Functions
- Click on `send-contact-email`
- View Logs tab

---

## Troubleshooting

### Error: "SENDGRID_API_KEY is not set"
```bash
supabase secrets set SENDGRID_API_KEY=YOUR_KEY
supabase functions deploy send-contact-email
```

### Error: "Sender email not verified"
- Verify sender email in SendGrid Dashboard
- Update Edge Function with verified email
- Redeploy function

### Error: "Function not found"
```bash
cd supabase/functions/send-contact-email
ls  # Should show index.ts
cd ../../..
supabase functions deploy send-contact-email
```

### Error: "RLS policy violation"
Run in Supabase SQL Editor:
```sql
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
```

### Email not received
1. Check SendGrid Dashboard > Activity Feed
2. Check spam folder
3. Verify sender email is verified
4. Check Edge Function logs

---

## Production Checklist

- [ ] Database table created
- [ ] RLS disabled (or proper policies set)
- [ ] SendGrid account created
- [ ] SendGrid API key obtained
- [ ] Sender email verified in SendGrid
- [ ] Supabase CLI installed
- [ ] Project linked to CLI
- [ ] Secret set in Supabase
- [ ] Edge Function deployed
- [ ] Sender email updated in function
- [ ] Test submission successful
- [ ] Email received in inbox

---

## File Structure

```
your-project-name/
├── supabase/
│   └── functions/
│       └── send-contact-email/
│           └── index.ts          ← Edge Function
├── migrations/
│   └── 009_create_contact_messages_table.sql
├── src/
│   └── app/
│       ├── services/
│       │   └── contact.service.ts
│       └── contact/
│           ├── contact.component.ts
│           └── contact.component.html
```

---

## Security Notes

- ✅ SendGrid API key stored as Supabase secret (not in code)
- ✅ RLS can be enabled with proper policies
- ✅ Edge Function runs server-side (secure)
- ✅ No API keys exposed to frontend
- ✅ CORS properly configured

---

## Cost

- Supabase: Free tier (500MB database, 2GB bandwidth)
- SendGrid: Free tier (100 emails/day)
- Total: **FREE** for small projects

---

## Support

If you encounter issues:
1. Check Edge Function logs: `supabase functions logs send-contact-email`
2. Check SendGrid Activity Feed
3. Verify all secrets are set: `supabase secrets list`
4. Ensure sender email is verified in SendGrid
