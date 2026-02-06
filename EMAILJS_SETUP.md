# EmailJS Setup Instructions

## Real Email भेजने के लिए EmailJS Setup करें:

### 1. EmailJS Account बनाएं
- https://www.emailjs.com/ पर जाएं
- Free account बनाएं

### 2. Email Service Add करें
- Dashboard में "Email Services" पर जाएं
- Gmail/Outlook/Yahoo जो भी use करते हैं वो add करें
- Service ID copy करें

### 3. Email Template बनाएं
- "Email Templates" section में जाएं
- New template बनाएं
- Template में ये variables use करें:
```
Subject: OTP Verification - {{from_name}}

Hello {{to_name}},

Your OTP code is: {{otp_code}}

Generated at: {{generated_time}}

This OTP will expire in 5 minutes.

Best regards,
{{from_name}}
```

### 4. Configuration Update करें
`src/app/config/email.config.ts` file में अपनी details डालें:

```typescript
export const EMAIL_CONFIG = {
  EMAILJS_PUBLIC_KEY: 'your_actual_public_key',
  EMAILJS_SERVICE_ID: 'your_actual_service_id',  
  EMAILJS_TEMPLATE_ID: 'your_actual_template_id',
  // ... rest remains same
};
```

### 5. Test करें
- Profile page पर जाकर "Send OTP" button दबाएं
- अगर EmailJS properly configured है तो real email आएगा
- अगर नहीं तो fallback mailto link खुलेगा

## Current Status:
- ✅ EmailJS library installed
- ✅ Service updated to use EmailJS
- ⚠️ Configuration needed (आपको अपनी EmailJS details डालनी होंगी)

## Fallback:
अगर EmailJS setup नहीं करना चाहते तो current mailto system भी काम करता है - बस email client खुलता है और आप manually send कर सकते हैं।