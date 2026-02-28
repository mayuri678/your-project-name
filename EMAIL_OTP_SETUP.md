# 📧 Email OTP Setup Guide

## Problem Fixed ✅
- OTP आता email वर जाईल, screen वर नाही दिसणार
- Forgot Password functionality properly काम करेल

## Setup Steps

### 1. Web3Forms API Key मिळवा (FREE)

1. Visit: https://web3forms.com
2. Enter your email
3. Click "Get Access Key"
4. Check your email for the API key

### 2. API Key Add करा

File: `src/app/services/email.service.ts`

Line 68 वर:
```typescript
access_key: 'YOUR_WEB3FORMS_ACCESS_KEY', // 👈 इथे तुमची API key paste करा
```

Replace करा:
```typescript
access_key: 'abc123-your-actual-key-xyz789',
```

### 3. Test करा

1. Run: `ng serve`
2. Login page वर जा
3. "Forgot Password?" वर click करा
4. Email enter करा
5. "Send OTP" वर click करा
6. तुमच्या email मध्ये OTP येईल (2-3 minutes लागू शकतात)

## How It Works Now

### Before (❌ Wrong):
```
User clicks "Forgot Password"
  ↓
OTP generates
  ↓
OTP shows on SCREEN ❌
  ↓
User copies from screen
```

### After (✅ Correct):
```
User clicks "Forgot Password"
  ↓
OTP generates
  ↓
OTP sends to EMAIL ✅
  ↓
User checks email inbox
  ↓
User enters OTP from email
```

## Development Mode

Console मध्ये OTP print होईल testing साठी:
```
📝 OTP (for testing): 123456
```

## Alternative: Supabase Email (Advanced)

तुम्ही Supabase वापरत असाल तर:

```typescript
// In forgot-password.component.ts
import { SupabaseAuthService } from '../services/supabase-auth.service';

async sendOtp(): Promise<void> {
  const { error } = await this.supabaseAuthService.resetPasswordForEmail(this.email);
  if (!error) {
    this.successMessage = 'Password reset link sent to your email!';
  }
}
```

## Troubleshooting

### Email नाही येत?
1. Spam folder check करा
2. API key correct आहे का check करा
3. Console मध्ये errors check करा
4. Web3Forms dashboard मध्ये delivery status check करा

### Still not working?
Console मध्ये OTP print होईल - testing साठी तो वापरा:
```
📝 OTP (for testing): 123456
```

## Files Changed

1. ✅ `forgot-password.component.ts` - OTP email वर send होतो
2. ✅ `forgot-password.component.html` - Screen वरून OTP remove केला
3. ✅ `email.service.ts` - Email sending logic fixed

## Next Steps

1. Web3Forms API key add करा
2. Test करा
3. Production मध्ये deploy करा

---

**Note:** Development मध्ये console मध्ये OTP दिसेल testing साठी. Production मध्ये हे remove करा.
