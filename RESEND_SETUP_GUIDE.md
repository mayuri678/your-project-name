# Resend Email Setup Guide

## Why Resend?
- ✅ Free tier: 100 emails/day, 3,000/month
- ✅ No credit card required
- ✅ No sender verification needed for onboarding@resend.dev
- ✅ Simple API
- ✅ Better than SendGrid for testing

---

## Step 1: Get Resend API Key

1. Go to https://resend.com/
2. Click "Start Building" or "Sign Up"
3. Sign up with your email
4. After login, go to **API Keys** (left sidebar)
5. Click "Create API Key"
6. Name: `Contact Form`
7. Permission: **Full Access** (or Sending Access)
8. Click "Add"
9. **COPY THE API KEY** (starts with `re_`)

Example: `re_123abc456def789...`

---

## Step 2: Set Resend API Key in Supabase

```bash
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
```

Verify:
```bash
supabase secrets list
```

---

## Step 3: Deploy Edge Function

```bash
supabase functions deploy send-contact-email
```

---

## Step 4: Test

### From Command Line:
```bash
supabase functions invoke send-contact-email --data '{"full_name":"Test User","email":"test@example.com","message":"Test message"}'
```

### From Your App:
1. Run: `ng serve`
2. Go to Contact page
3. Fill form and submit
4. Check email at: gulvemayuri63@gmail.com

---

## Important Notes

### Sender Email
- **Free plan**: Must use `onboarding@resend.dev`
- **Paid plan**: Can use your own domain

### Receiver Email
- Can send to any email address
- Currently set to: `gulvemayuri63@gmail.com`

### Rate Limits
- Free: 100 emails/day, 3,000/month
- Paid: Unlimited

---

## Troubleshooting

### Check Logs:
```bash
supabase functions logs send-contact-email
```

### Check Resend Dashboard:
- Go to https://resend.com/emails
- See all sent emails and their status

### Common Errors:

**"Invalid API key"**
```bash
supabase secrets set RESEND_API_KEY=re_your_key
supabase functions deploy send-contact-email
```

**"Rate limit exceeded"**
- Free plan: 100 emails/day limit reached
- Wait 24 hours or upgrade plan

---

## Comparison: Resend vs SendGrid

| Feature | Resend | SendGrid |
|---------|--------|----------|
| Free emails/day | 100 | 100 |
| Setup complexity | Easy | Medium |
| Sender verification | Not needed | Required |
| API simplicity | Simple | Complex |
| Best for | Testing/Small apps | Production/Large apps |

---

## Production Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] Secret set in Supabase
- [ ] Edge Function deployed
- [ ] Test email sent successfully
- [ ] Email received at gulvemayuri63@gmail.com

---

## Upgrade to Custom Domain (Optional)

If you want to use your own domain instead of `onboarding@resend.dev`:

1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records (provided by Resend)
5. Verify domain
6. Update Edge Function:
   ```typescript
   from: 'noreply@yourdomain.com',
   ```

---

## Cost

- **Free Plan**: 100 emails/day, 3,000/month - **FREE**
- **Pro Plan**: $20/month - 50,000 emails/month
- **Enterprise**: Custom pricing

For small projects, free plan is sufficient!
