# Change Password Feature - Testing Guide

## Pre-Testing Setup

### 1. Start Backend Server
```bash
cd backend
npm install
node server.js
```

Expected output:
```
🚀 Server running on http://localhost:3000
📋 Available endpoints:
  POST /api/auth/login
  POST /api/auth/change-password
  GET /api/auth/password-change-history
  GET /api/health
```

### 2. Start Frontend Application
```bash
ng serve
```

Expected output:
```
✔ Compiled successfully.
Application bundle generated successfully.
Local: http://localhost:4200/
```

### 3. Open Browser
Navigate to `http://localhost:4200/`

## Test Users

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin | admin123 | admin | ✅ Active |
| user1 | user123 | user | ✅ Active |
| test@example.com | test123 | user | ✅ Active |

## Test Cases

### Test 1: Login with Valid Credentials
**Objective:** Verify user can login successfully

**Steps:**
1. Navigate to http://localhost:4200/login
2. Enter email: `admin`
3. Enter password: `admin123`
4. Click "Login"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to home page
- ✅ JWT token stored in localStorage
- ✅ User name displayed in header

**Verification:**
```javascript
// Open browser console and check:
localStorage.getItem('authToken')  // Should have token
localStorage.getItem('currentUserEmail')  // Should be 'admin'
```

---

### Test 2: Navigate to Settings Page
**Objective:** Verify Settings page loads correctly

**Steps:**
1. After login, click on "Settings" in navigation
2. Or navigate to http://localhost:4200/settings

**Expected Result:**
- ✅ Settings page loads
- ✅ User profile information displayed
- ✅ "Change Password" section visible
- ✅ "Change Password" button present

---

### Test 3: Open Change Password Form (Inline)
**Objective:** Verify inline form opens correctly

**Steps:**
1. On Settings page, scroll to "Change Password" section
2. Click "🔑 Change Password" button

**Expected Result:**
- ✅ Form expands
- ✅ Three input fields visible:
   - Current Password
   - New Password
   - Confirm Password
- ✅ "Update Password" and "Cancel" buttons visible
- ✅ Requirements text displayed

---

### Test 4: Validation - Empty Fields
**Objective:** Verify validation for empty fields

**Steps:**
1. Open Change Password form
2. Leave all fields empty
3. Click "Update Password"

**Expected Result:**
- ✅ Error message: "All fields are required"
- ✅ Form remains open
- ✅ No API call made

---

### Test 5: Validation - Mismatched Passwords
**Objective:** Verify validation for mismatched passwords

**Steps:**
1. Open Change Password form
2. Enter current password: `admin123`
3. Enter new password: `NewPass123!`
4. Enter confirm password: `DifferentPass123!`
5. Click "Update Password"

**Expected Result:**
- ✅ Error message: "New password and confirm password do not match"
- ✅ Form remains open
- ✅ No API call made

---

### Test 6: Validation - Password Too Short
**Objective:** Verify minimum length validation

**Steps:**
1. Open Change Password form
2. Enter current password: `admin123`
3. Enter new password: `Pass1!`
4. Enter confirm password: `Pass1!`
5. Click "Update Password"

**Expected Result:**
- ✅ Error message: "Password must be at least 8 characters"
- ✅ Form remains open
- ✅ No API call made

---

### Test 7: Validation - Missing Number
**Objective:** Verify number requirement validation

**Steps:**
1. Open Change Password form
2. Enter current password: `admin123`
3. Enter new password: `NewPassword!`
4. Enter confirm password: `NewPassword!`
5. Click "Update Password"

**Expected Result:**
- ✅ Error message: "Password must contain at least 1 number"
- ✅ Form remains open
- ✅ No API call made

---

### Test 8: Validation - Missing Special Character
**Objective:** Verify special character requirement validation

**Steps:**
1. Open Change Password form
2. Enter current password: `admin123`
3. Enter new password: `NewPassword123`
4. Enter confirm password: `NewPassword123`
5. Click "Update Password"

**Expected Result:**
- ✅ Error message: "Password must contain at least 1 special character"
- ✅ Form remains open
- ✅ No API call made

---

### Test 9: Wrong Current Password
**Objective:** Verify current password verification

**Steps:**
1. Open Change Password form
2. Enter current password: `wrongpassword`
3. Enter new password: `NewPass123!`
4. Enter confirm password: `NewPass123!`
5. Click "Update Password"

**Expected Result:**
- ✅ Loading state shows "⏳ Updating..."
- ✅ API call made to backend
- ✅ Error message: "Current password is incorrect"
- ✅ Form remains open
- ✅ Form fields not cleared

---

### Test 10: Successful Password Change
**Objective:** Verify successful password change

**Steps:**
1. Open Change Password form
2. Enter current password: `admin123`
3. Enter new password: `NewPass123!`
4. Enter confirm password: `NewPass123!`
5. Click "Update Password"

**Expected Result:**
- ✅ Loading state shows "⏳ Updating..."
- ✅ API call made to backend
- ✅ Success message: "Password changed successfully!"
- ✅ Form fields cleared
- ✅ After 2 seconds, form closes
- ✅ Redirected to Settings page

**Verification:**
```javascript
// Check browser console for API response
// Should see: { success: true, message: "...", data: {...} }
```

---

### Test 11: Login with New Password
**Objective:** Verify new password works for login

**Steps:**
1. After successful password change, logout
2. Navigate to login page
3. Enter email: `admin`
4. Enter password: `NewPass123!`
5. Click "Login"

**Expected Result:**
- ✅ Login successful with new password
- ✅ Redirected to home page
- ✅ User authenticated

---

### Test 12: Old Password No Longer Works
**Objective:** Verify old password is invalidated

**Steps:**
1. Logout
2. Navigate to login page
3. Enter email: `admin`
4. Enter password: `admin123` (old password)
5. Click "Login"

**Expected Result:**
- ✅ Login fails
- ✅ Error message: "Invalid password" or similar
- ✅ Remains on login page

---

### Test 13: Cancel Button
**Objective:** Verify cancel button closes form

**Steps:**
1. Open Change Password form
2. Enter some data in fields
3. Click "Cancel" button

**Expected Result:**
- ✅ Form closes
- ✅ Form fields cleared
- ✅ Error/success messages cleared
- ✅ Remains on Settings page

---

### Test 14: Standalone Change Password Page
**Objective:** Verify standalone page works

**Steps:**
1. Navigate to http://localhost:4200/change-password
2. Verify page loads

**Expected Result:**
- ✅ Page loads with form
- ✅ Same validation as inline form
- ✅ "Back to Settings" button present
- ✅ All functionality works

---

### Test 15: Not Logged In Access
**Objective:** Verify unauthorized access is blocked

**Steps:**
1. Logout
2. Navigate to http://localhost:4200/change-password

**Expected Result:**
- ✅ Redirected to login page
- ✅ Cannot access change password page

---

### Test 16: Multiple Users
**Objective:** Verify each user has separate password

**Steps:**
1. Login as `admin`, change password to `AdminNew123!`
2. Logout
3. Login as `user1` with password `user123`
4. Change password to `UserNew123!`
5. Logout
6. Try logging in as `admin` with `AdminNew123!` - should work
7. Try logging in as `user1` with `UserNew123!` - should work

**Expected Result:**
- ✅ Each user's password change is independent
- ✅ Other users' passwords unchanged
- ✅ All users can login with their new passwords

---

### Test 17: Password Change History
**Objective:** Verify password change is logged

**Steps:**
1. Login as `admin`
2. Open browser console
3. Run:
```javascript
fetch('http://localhost:3000/api/auth/password-change-history', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
}).then(r => r.json()).then(d => console.log(d))
```

**Expected Result:**
- ✅ API returns password change history
- ✅ Shows timestamp of changes
- ✅ Shows IP address and user agent

---

### Test 18: Mobile Responsiveness
**Objective:** Verify form works on mobile

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone 12)
4. Navigate to Settings
5. Open Change Password form
6. Fill and submit form

**Expected Result:**
- ✅ Form displays correctly on mobile
- ✅ All fields visible and usable
- ✅ Buttons are touch-friendly
- ✅ No horizontal scrolling
- ✅ Text is readable

---

### Test 19: Keyboard Navigation
**Objective:** Verify keyboard navigation works

**Steps:**
1. Open Change Password form
2. Press Tab to navigate through fields
3. Fill form using keyboard only
4. Press Enter to submit

**Expected Result:**
- ✅ Tab navigates through all fields
- ✅ Can fill form with keyboard
- ✅ Enter submits form
- ✅ Focus visible on all elements

---

### Test 20: Browser Console Errors
**Objective:** Verify no console errors

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Perform all above tests
4. Check for errors

**Expected Result:**
- ✅ No JavaScript errors
- ✅ No network errors
- ✅ No warnings (except expected ones)

---

## Performance Testing

### Test 21: API Response Time
**Objective:** Verify API responds quickly

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Change password
4. Check request timing

**Expected Result:**
- ✅ API response < 500ms
- ✅ No timeout errors
- ✅ Smooth user experience

---

### Test 22: Form Submission Speed
**Objective:** Verify form submission is responsive

**Steps:**
1. Open Change Password form
2. Fill with valid data
3. Click "Update Password"
4. Observe loading state

**Expected Result:**
- ✅ Loading state appears immediately
- ✅ Button disabled during submission
- ✅ Response received within 2 seconds
- ✅ Success/error message appears

---

## Security Testing

### Test 23: Token Expiration
**Objective:** Verify expired token is handled

**Steps:**
1. Login and get token
2. Wait for token to expire (or manually expire)
3. Try to change password

**Expected Result:**
- ✅ Error message about invalid token
- ✅ Redirected to login
- ✅ No security breach

---

### Test 24: CORS Headers
**Objective:** Verify CORS is properly configured

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Change password
4. Check response headers

**Expected Result:**
- ✅ Response includes CORS headers
- ✅ No CORS errors in console
- ✅ Request succeeds

---

### Test 25: Password Not Logged
**Objective:** Verify passwords not logged in console

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Change password
4. Check console output

**Expected Result:**
- ✅ Passwords not visible in console
- ✅ Only success/error messages shown
- ✅ No sensitive data logged

---

## Regression Testing

### Test 26: Settings Page Still Works
**Objective:** Verify other settings functionality unaffected

**Steps:**
1. On Settings page, update profile info
2. Change preferences
3. Save changes
4. Verify changes saved

**Expected Result:**
- ✅ Profile updates work
- ✅ Preferences save correctly
- ✅ No conflicts with password change

---

### Test 27: Navigation Still Works
**Objective:** Verify navigation unaffected

**Steps:**
1. From Settings, navigate to other pages
2. Use header navigation
3. Use back button

**Expected Result:**
- ✅ All navigation works
- ✅ No broken links
- ✅ Proper routing

---

## Test Summary Template

```
TEST EXECUTION SUMMARY
======================

Date: _______________
Tester: _______________
Environment: Development / Staging / Production

RESULTS:
--------
Total Tests: 27
Passed: ___
Failed: ___
Skipped: ___

ISSUES FOUND:
-------------
1. [Issue Description]
   Severity: Critical / High / Medium / Low
   Steps to Reproduce: [Steps]
   Expected: [Expected Result]
   Actual: [Actual Result]

2. [Issue Description]
   ...

NOTES:
------
[Any additional notes or observations]

SIGN-OFF:
---------
Tester: _______________
Date: _______________
```

## Automated Testing (Optional)

### Unit Tests
```typescript
// Example unit test
describe('ChangePasswordComponent', () => {
  it('should validate empty fields', () => {
    component.form = { currentPassword: '', newPassword: '', confirmPassword: '' };
    component.onSubmit();
    expect(component.errorMessage).toBe('All fields are required');
  });

  it('should validate password mismatch', () => {
    component.form = { 
      currentPassword: 'test123', 
      newPassword: 'NewPass123!', 
      confirmPassword: 'DifferentPass123!' 
    };
    component.onSubmit();
    expect(component.errorMessage).toContain('do not match');
  });
});
```

### E2E Tests
```typescript
// Example E2E test
describe('Change Password Feature', () => {
  it('should successfully change password', () => {
    cy.login('admin', 'admin123');
    cy.visit('/settings');
    cy.contains('Change Password').click();
    cy.get('#currentPassword').type('admin123');
    cy.get('#newPassword').type('NewPass123!');
    cy.get('#confirmPassword').type('NewPass123!');
    cy.contains('Update Password').click();
    cy.contains('Password changed successfully').should('be.visible');
  });
});
```

## Troubleshooting During Testing

| Issue | Solution |
|-------|----------|
| Backend not running | Start with `node server.js` in backend folder |
| CORS errors | Ensure backend has `app.use(cors())` |
| Token not found | Login first, check localStorage |
| API 404 error | Verify backend endpoint URL is correct |
| Form not submitting | Check browser console for errors |
| Validation not working | Verify regex patterns in component |
| Redirect not working | Check router configuration |
| Styling issues | Clear browser cache (Ctrl+Shift+Delete) |

## Sign-Off

Once all tests pass, the feature is ready for:
- ✅ Code review
- ✅ Staging deployment
- ✅ Production release
