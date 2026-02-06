# Contact Form Setup Guide

## Overview
This guide explains how to set up the contact form with Supabase backend and SendGrid email integration.

## Prerequisites
- Supabase project
- SendGrid account with API key
- Supabase CLI installed

## Setup Steps

### 1. Create Database Table
Run the SQL migration in your Supabase SQL Editor:
```bash
# File: migrations/009_create_contact_messages_table.sql
```
Or run directly in Supabase Dashboard > SQL Editor

### 2. Deploy Supabase Edge Function

#### Install Supabase CLI (if not installed)
```bash
npm install -g supabase
```

#### Login to Supabase
```bash
supabase login
```

#### Link your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

#### Set SendGrid API Key as secret
```bash
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here
```

#### Deploy the Edge Function
```bash
supabase functions deploy send-contact-email
```

### 3. SendGrid Setup

1. Go to https://sendgrid.com/
2. Create an account or login
3. Navigate to Settings > API Keys
4. Create a new API key with "Mail Send" permissions
5. Copy the API key and set it as a Supabase secret (see step 2 above)
6. Verify your sender email domain or use Single Sender Verification

**Important:** Update the `from` email in the Edge Function:
- File: `supabase/functions/send-contact-email/index.ts`
- Change `noreply@yourdomain.com` to your verified SendGrid sender email

### 4. Test the Integration

1. Run your Angular app: `ng serve`
2. Navigate to the Contact page
3. Fill in the form and submit
4. Check:
   - Supabase Dashboard > Table Editor > contact_messages (data should be inserted)
   - Email inbox at gulvemayuri63@gmail.com (should receive email)

## Troubleshooting

### Edge Function Logs
```bash
supabase functions logs send-contact-email
```

### Common Issues

1. **Email not sending:**
   - Verify SendGrid API key is set correctly
   - Check sender email is verified in SendGrid
   - Check Edge Function logs for errors

2. **Database insert fails:**
   - Verify RLS policies are created
   - Check Supabase logs in Dashboard

3. **CORS errors:**
   - Edge Function includes CORS headers
   - Ensure Supabase URL is correct in environment.ts

## Files Created/Modified

### New Files:
- `migrations/009_create_contact_messages_table.sql` - Database schema
- `supabase/functions/send-contact-email/index.ts` - Edge Function
- `src/app/services/contact.service.ts` - Angular service

### Modified Files:
- `src/app/contact/contact.component.ts` - Updated to use ContactService
- `src/app/contact/contact.component.html` - Added message field
- `src/app/header/header.component.html` - Changed Contact button
- `src/app/header/header.component.ts` - Added openContactForm method

## Environment Variables

Make sure your `src/environments/environment.ts` has Supabase configuration:
```typescript
export const environment = {
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

## Security Notes

- RLS policies allow anyone to insert contact messages (public form)
- Only authenticated users can read their own messages
- Admin users can read all messages
- SendGrid API key is stored securely as Supabase secret
- Never commit API keys to version control
