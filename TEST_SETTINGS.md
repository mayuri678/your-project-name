# Settings Test Guide

## Test Steps:

1. **Open Browser Console** (F12)
2. **Go to Settings Page** (http://localhost:4200/settings)
3. **Check Console for Errors**
4. **Fill Settings:**
   - Name: Test User
   - Phone: +91 1234567890
   - Address: Test Address
   - Bio: Test Bio
   - Website: https://test.com
   - LinkedIn: https://linkedin.com/in/test
   - GitHub: https://github.com/test

5. **Click "Save Changes" Button**
6. **Check Console Output**

## Expected Console Output:
```
Saving settings...
Backend save result: { data: {...}, error: null }
Settings saved successfully!
```

## If Button Not Working:
- Check if button is disabled
- Check console for JavaScript errors
- Check if SupabaseAuthService is injected properly
- Check network tab for API calls

## Verify in Supabase:
```sql
SELECT * FROM user_settings WHERE user_email = 'your-email';
```
