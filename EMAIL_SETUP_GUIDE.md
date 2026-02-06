# Email Setup Guide - Forgot Password Feature

## Problem
The forgot password feature was not sending actual emails, only logging to console.

## Solution
Updated `email.service.ts` to use **Web3Forms** API for sending real emails.

---

## Setup Instructions

### Option 1: Web3Forms (Recommended - FREE & Easy)

1. **Get Free Access Key**
   - Visit: https://web3forms.com
   - Sign up with your email
   - Get your free access key

2. **Update Configuration**
   - Open: `src/app/services/email.service.ts`
   - Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key (2 places)

3. **Test**
   ```bash
   ng serve
   ```
   - Go to forgot password page
   - Enter email and submit
   - Check email inbox

---

### Option 2: EmailJS (Alternative)

1. **Setup EmailJS**
   - Visit: https://www.emailjs.com
   - Create account and email service
   - Create email template
   - Get: Public Key, Service ID, Template ID

2. **Update Configuration**
   - Open: `src/app/config/email.config.ts`
   - Add your EmailJS credentials

3. **Update Service**
   ```typescript
   // In email.service.ts, replace Web3Forms with EmailJS
   import emailjs from '@emailjs/browser';
   
   emailjs.send(
     'YOUR_SERVICE_ID',
     'YOUR_TEMPLATE_ID',
     { to_email: email, message: '...' },
     'YOUR_PUBLIC_KEY'
   );
   ```

---

## Current Implementation

### Files Modified
- `src/app/services/email.service.ts` - Added Web3Forms integration

### How It Works
1. User enters email on forgot password page
2. System generates reset token
3. Email service sends reset link via Web3Forms API
4. User receives email with reset link
5. User clicks link and resets password

---

## Testing

1. Start development server:
   ```bash
   ng serve
   ```

2. Navigate to: `http://localhost:4200/forgot-password`

3. Enter a valid email address

4. Check email inbox for reset link

---

## Troubleshooting

### Email not received?
- Check spam/junk folder
- Verify access key is correct
- Check browser console for errors
- Ensure email address is valid

### Still not working?
- Use EmailJS as alternative (Option 2)
- Or use Supabase Auth email (built-in)
- Check network tab for API errors

---

## Production Deployment

For production, consider:
- **SendGrid** - Professional email service
- **AWS SES** - Amazon email service
- **Mailgun** - Developer-friendly
- **Supabase Auth** - Built-in authentication emails

---

## Quick Start (5 minutes)

1. Get Web3Forms key: https://web3forms.com
2. Update `email.service.ts` with your key
3. Test forgot password feature
4. Done! ✅
