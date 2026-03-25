# Change Password Feature - Implementation Guide

## Overview
This guide covers the complete implementation of the Change Password feature for your Angular application with a Node.js backend.

## Files Created/Modified

### Frontend Files

#### 1. **Change Password Service** (`src/app/services/change-password.service.ts`)
- Handles API calls to the backend
- Sends JWT token in Authorization header
- Validates password requirements

#### 2. **Change Password Component** (`src/app/change-password/`)
- `change-password.component.ts` - Component logic with form validation
- `change-password.component.html` - Standalone form page
- `change-password.component.css` - Styling for the form

#### 3. **Settings Component Updates** (`src/app/settings/`)
- Added inline change password form in settings page
- Added validation methods
- Added form submission handler

### Backend Files

#### 1. **Backend API** (`backend/server.js`)
- Updated `/api/auth/change-password` endpoint
- JWT token verification middleware
- Password validation (8+ chars, 1 number, 1 special char)
- Current password verification
- Password change history logging

## Features

### Frontend Validation
- All fields required
- New password and confirm password must match
- Password minimum 8 characters
- Password must contain at least 1 number
- Password must contain at least 1 special character
- Real-time error messages
- Success/error notifications

### Backend Validation
- JWT token verification
- Current password verification
- Password strength requirements
- Password change history tracking
- Proper error responses

## Setup Instructions

### 1. Backend Setup

Ensure your `backend/server.js` has:
- JWT middleware for token verification
- Password validation rules
- User password update logic

The backend is already configured with:
```javascript
POST /api/auth/change-password
- Requires: Authorization header with JWT token
- Body: { currentPassword, newPassword, confirmPassword }
- Returns: { success, message, data }
```

### 2. Frontend Setup

The route is already configured in `app.routes.ts`:
```typescript
{ path: 'change-password', loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent) }
```

### 3. Authentication Token Storage

Ensure your login component stores the JWT token:
```typescript
localStorage.setItem('authToken', token);
```

## Usage

### Option 1: Standalone Change Password Page
Navigate to `/change-password` for a dedicated form page.

### Option 2: Inline Form in Settings
In the Settings page, click "Change Password" button to expand the inline form.

## API Endpoint

### POST /api/auth/change-password

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123!",
  "newPassword": "newPassword456!",
  "confirmPassword": "newPassword456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "email": "user@example.com",
    "changedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400/401/500):**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Password Requirements

- **Minimum Length:** 8 characters
- **Must Contain:** At least 1 number (0-9)
- **Must Contain:** At least 1 special character (!@#$%^&*()_+-=[]{}';:"\\|,.<>/?)

## Testing

### Test Users (from backend/server.js)
```
Email: admin
Password: admin123

Email: user1
Password: user123

Email: test@example.com
Password: test123
```

### Test Steps
1. Login with a test user
2. Navigate to Settings page
3. Click "Change Password" button
4. Enter current password
5. Enter new password (must meet requirements)
6. Confirm new password
7. Click "Update Password"
8. Verify success message
9. Try logging in with new password

## Error Handling

The component handles:
- Missing fields validation
- Password mismatch validation
- Password strength validation
- Current password verification errors
- Network/API errors
- Loading states

## Security Considerations

1. **JWT Token:** Required for all password change requests
2. **Current Password Verification:** Must verify current password before allowing change
3. **Password Strength:** Enforced on both frontend and backend
4. **HTTPS:** Use HTTPS in production
5. **Token Expiration:** Implement token refresh mechanism
6. **Password Hashing:** Use bcrypt for password storage (currently using plain text for demo)

## Production Recommendations

1. **Hash Passwords:** Use bcrypt instead of storing plain text
2. **HTTPS Only:** Enforce HTTPS for all API calls
3. **Rate Limiting:** Implement rate limiting on password change endpoint
4. **Audit Logging:** Log all password changes with IP and user agent
5. **Email Notification:** Send email notification when password is changed
6. **Session Invalidation:** Invalidate all other sessions after password change
7. **Two-Factor Authentication:** Consider adding 2FA for password changes

## Troubleshooting

### Issue: "No token provided" error
**Solution:** Ensure JWT token is stored in localStorage after login:
```typescript
localStorage.setItem('authToken', response.token);
```

### Issue: "Current password is incorrect" error
**Solution:** Verify the current password is entered correctly

### Issue: "Password must contain..." error
**Solution:** Ensure password meets all requirements:
- At least 8 characters
- Contains at least 1 number
- Contains at least 1 special character

### Issue: CORS errors
**Solution:** Ensure backend has CORS enabled:
```javascript
app.use(cors());
```

## File Structure

```
src/app/
├── change-password/
│   ├── change-password.component.ts
│   ├── change-password.component.html
│   └── change-password.component.css
├── services/
│   └── change-password.service.ts
└── settings/
    ├── settings.component.ts (updated)
    ├── settings.component.html (updated)
    └── settings.component.css (updated)

backend/
└── server.js (updated)
```

## Next Steps

1. Test the feature with test users
2. Implement password hashing with bcrypt
3. Add email notifications
4. Implement rate limiting
5. Add audit logging
6. Deploy to production with HTTPS
