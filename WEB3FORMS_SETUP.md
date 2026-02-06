# Web3Forms Setup for Free Email Sending

## 1. Web3Forms Account बनवा
- https://web3forms.com/ वर जा
- Free account बनवा (no credit card required)
- Access Key मिळेल

## 2. Access Key Update करा
`src/app/services/simple-email.service.ts` मध्ये:
```typescript
formData.append('access_key', 'your_actual_access_key_here');
```

## 3. Test करा
- Profile page वर जाऊन "Send OTP" button दाबा
- Web3Forms configured असल्यास real email जाईल
- नाहीतर email client खुलेल manual sending साठी

## Features:
- ✅ Free service (1000 emails/month)
- ✅ No server setup needed
- ✅ Real email delivery
- ✅ HTML email support
- ✅ Fallback to email client

## Alternative: EmailJS
अगर Web3Forms नको असेल तर EmailJS use करा:
1. https://www.emailjs.com/ वर account बनवा
2. Service ID, Template ID, Public Key मिळवा
3. `sendOTPEmailViaEmailJS` method use करा

## Current Status:
- ✅ Simple email service created
- ✅ Profile component updated
- ⚠️ Web3Forms access key needed
- ✅ Email client fallback ready

## Test करण्यासाठी:
1. Web3Forms access key add करा
2. Profile page वर OTP send करा
3. gulvemayuri63@gmail.com वर email check करा