# Supabase Edge Function Setup for Email Sending

## 1. Supabase CLI Install करा
```bash
npm install -g supabase
```

## 2. Project Link करा
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

## 3. Edge Function Create करा
```bash
supabase functions new send-otp-email
```

## 4. Function Code (supabase/functions/send-otp-email/index.ts):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { email, otp, userName, subject } = await req.json()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Your App <noreply@yourdomain.com>',
        to: [email],
        subject: subject || 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🔐 Your OTP Code</h2>
            <p>Hello ${userName},</p>
            <p>Your One-Time Password (OTP) is:</p>
            <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
              ${otp}
            </div>
            <p>⏰ This OTP will expire in 5 minutes.</p>
            <p>🔒 Security Notice:</p>
            <ul>
              <li>Do not share this OTP with anyone</li>
              <li>Use this OTP only on the official website</li>
            </ul>
            <p>Generated at: ${new Date().toLocaleString()}</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" } },
    )
  }
})
```

## 5. Environment Variables Set करा
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## 6. Function Deploy करा
```bash
supabase functions deploy send-otp-email
```

## 7. Resend Account Setup
1. https://resend.com/ वर account बनवा
2. API key generate करा
3. Domain verify करा (optional, resend.dev domain use कर सकते हैं)

## Current Status:
- ✅ Supabase service updated
- ✅ Profile component updated  
- ⚠️ Edge Function needs to be deployed
- ⚠️ Resend API key needed

## Fallback:
अगर Edge Function setup नहीं करना चाहते तो current system OTP popup में दिखाता है।