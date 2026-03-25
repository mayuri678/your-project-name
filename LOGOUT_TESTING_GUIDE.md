# Logout Feature - Testing Guide

## Test Credentials

### Regular Users:
- Email: `user1` | Password: `user1`
- Email: `user2` | Password: `user2`
- Email: `john@example.com` | Password: `john123`
- Email: `jane@example.com` | Password: `jane123`
- Email: `test@example.com` | Password: `test123`
- Email: `gulvemayuri63@gmail.com` | Password: `mayuri123`

### Admin User:
- Email: `admin` | Password: `admin`

---

## Test Case 1: Basic Logout Flow ✅

**Steps:**
1. Open application → Navigate to `/login`
2. Enter credentials (e.g., `user1` / `user1`)
3. Click LOGIN button
4. Verify redirected to `/home`
5. Click user avatar in header (top right)
6. Click "Logout" button
7. **Expected:** Login form should appear

**What happens behind the scenes:**
- All localStorage keys cleared: `loggedIn`, `currentUserEmail`, `currentUserName`, `currentUserRole`
- All tokens cleared: `jwtToken`, `refreshToken`
- User data cleared from localStorage
- Navigation to `/login` with `replaceUrl: true`

---

## Test Case 2: Verify Tokens Are Cleared ✅

**Steps:**
1. Login with any user
2. Open Browser DevTools → Application → Local Storage
3. Note the keys: `loggedIn`, `currentUserEmail`, `jwtToken` (if present)
4. Click Logout
5. Refresh the page
6. **Expected:** All auth keys should be gone from localStorage

---

## Test Case 3: Protected Routes After Logout ✅

**Steps:**
1. Login with any user
2. Navigate to `/profile` (protected route)
3. Verify page loads
4. Click Logout
5. Try to access `/profile` directly via URL
6. **Expected:** Should redirect to `/login`

---

## Test Case 4: Back Button After Logout ✅

**Steps:**
1. Login → Navigate to some pages
2. Click Logout
3. Try clicking browser back button
4. **Expected:** Should NOT go back to previous logged-in page (due to `replaceUrl: true`)

---

## Test Case 5: Multiple Users Logout ✅

**Steps:**
1. Login as User A
2. Open account menu → See "Logout" option
3. Click Logout
4. Verify redirected to login
5. Login as User B
6. Verify User B's data is shown (not User A's)
7. **Expected:** No data leakage between users

---

## Test Case 6: Session Storage Clearing ✅

**Steps:**
1. Open DevTools → Application → Session Storage
2. Login with a user
3. Check if any auth data in Session Storage
4. Click Logout
5. **Expected:** Session Storage should be cleared of auth data

---

## Test Case 7: Logout and Re-login Same User ✅

**Steps:**
1. Login as `user1`
2. Create/modify some user data
3. Click Logout
4. Login again as `user1`
5. **Expected:** Should start fresh (no previous data)

---

## Test Case 8: Admin Logout ✅

**Steps:**
1. Login as admin (`admin` / `admin`)
2. Verify redirected to `/admin/dashboard`
3. Click user avatar → Logout
4. **Expected:** Should redirect to `/login` (not admin login)

---

## Troubleshooting

### Issue: Login form not showing after logout
**Solution:**
- Clear browser cache and localStorage manually
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check console for errors

### Issue: Still logged in after logout
**Solution:**
- Check if `loggedIn` key exists in localStorage
- Verify `AuthService.logout()` is being called
- Check if tokens are still present

### Issue: Can still access protected routes after logout
**Solution:**
- Verify `authGuard` is applied to routes
- Check if `isLoggedIn()` returns false after logout
- Clear localStorage and refresh

---

## Expected Behavior After Logout

✅ User redirected to login page
✅ All localStorage auth keys removed
✅ All sessionStorage auth keys removed
✅ JWT tokens cleared
✅ User profile data cleared
✅ Cannot access protected routes
✅ Back button doesn't go to previous logged-in page
✅ Can login again with fresh session

---

## Files Modified

1. `src/app/auth.service.ts` - Enhanced logout with token clearing
2. `src/app/auth.guard.ts` - Fixed to properly block access
3. `src/app/logout.guard.ts` - Simplified logout guard
4. `src/app/header/header.component.ts` - Added replaceUrl flag
5. `src/app/login/login.component.ts` - Improved login state handling
