# Change Password Feature - Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Angular)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              ChangePasswordComponent                      │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Form Fields:                                      │  │   │
│  │  │  - currentPassword                                 │  │   │
│  │  │  - newPassword                                     │  │   │
│  │  │  - confirmPassword                                 │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Validation:                                       │  │   │
│  │  │  ✓ All fields required                             │  │   │
│  │  │  ✓ Passwords match                                 │  │   │
│  │  │  ✓ Min 8 characters                                │  │   │
│  │  │  ✓ Contains number                                 │  │   │
│  │  │  ✓ Contains special character                       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         ChangePasswordService                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  changePassword(                                   │  │   │
│  │  │    currentPassword,                                │  │   │
│  │  │    newPassword,                                    │  │   │
│  │  │    token                                           │  │   │
│  │  │  )                                                 │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│                    HTTP POST Request                             │
│                    + JWT Token Header                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  POST /api/auth/change-password                          │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  1. Verify JWT Token                              │  │   │
│  │  │     ├─ Extract token from header                  │  │   │
│  │  │     ├─ Verify signature                           │  │   │
│  │  │     └─ Get user ID from token                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  2. Validate Input                                │  │   │
│  │  │     ├─ Check all fields present                   │  │   │
│  │  │     ├─ Check password length                      │  │   │
│  │  │     ├─ Check password contains number             │  │   │
│  │  │     └─ Check password contains special char       │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  3. Verify Current Password                       │  │   │
│  │  │     ├─ Find user in database                      │  │   │
│  │  │     └─ Compare with stored password               │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  4. Update Password                               │  │   │
│  │  │     ├─ Hash new password (bcrypt)                 │  │   │
│  │  │     ├─ Update in database                         │  │   │
│  │  │     └─ Log change event                           │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  5. Return Response                               │  │   │
│  │  │     ├─ Success: 200 OK                            │  │   │
│  │  │     └─ Error: 400/401/500                         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow - Standalone Page

```
┌─────────────────┐
│  User Navigates │
│ to /change-pwd  │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Check if Logged In   │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │          │
   NO         YES
    │          │
    ▼          ▼
Redirect   Display Form
to Login   with 3 fields
           │
           ▼
    ┌──────────────────┐
    │ User Fills Form  │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Frontend Validation  │
    └────────┬─────────────┘
             │
        ┌────┴────┐
        │          │
      FAIL       PASS
        │          │
        ▼          ▼
    Show Error  Submit to
    Message     Backend
                 │
                 ▼
    ┌──────────────────────┐
    │ Backend Validation   │
    └────────┬─────────────┘
             │
        ┌────┴────┐
        │          │
      FAIL       PASS
        │          │
        ▼          ▼
    Return Error  Update
    Message       Password
                   │
                   ▼
              Return Success
                   │
                   ▼
         ┌──────────────────┐
         │ Show Success Msg │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Wait 2 seconds   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Redirect to      │
         │ Settings Page    │
         └──────────────────┘
```

## User Flow - Inline Form (Settings Page)

```
┌──────────────────────┐
│ User on Settings Pg  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────┐
│ Click "Change Password"  │
│ Button                   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Toggle showChangePassword│
│ = true                   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Display Inline Form      │
│ with 3 input fields      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ User Fills Form          │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Click "Update Password"  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Frontend Validation      │
└──────────┬───────────────┘
           │
      ┌────┴────┐
      │          │
    FAIL       PASS
      │          │
      ▼          ▼
  Show Error  Submit via
  in Form     Fetch API
              │
              ▼
  ┌──────────────────────┐
  │ Backend Validation   │
  └──────────┬───────────┘
             │
        ┌────┴────┐
        │          │
      FAIL       PASS
        │          │
        ▼          ▼
    Show Error  Update
    Message     Password
                 │
                 ▼
            Return Success
                 │
                 ▼
    ┌──────────────────────┐
    │ Show Success Message │
    │ in Form              │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Clear Form Fields    │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Wait 2 seconds       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Hide Form            │
    │ (showChangePassword  │
    │  = false)            │
    └──────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  form = {                                                         │
│    currentPassword: string                                        │
│    newPassword: string                                            │
│    confirmPassword: string                                        │
│  }                                                                │
│                                                                   │
│  successMessage: string                                           │
│  errorMessage: string                                             │
│  isLoading: boolean                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VALIDATION LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ✓ Check all fields filled                                        │
│  ✓ Check passwords match                                          │
│  ✓ Check length >= 8                                              │
│  ✓ Check contains digit                                           │
│  ✓ Check contains special char                                    │
│                                                                   │
│  If validation fails:                                             │
│    └─ Set errorMessage                                            │
│    └─ Return early                                                │
│                                                                   │
│  If validation passes:                                            │
│    └─ Continue to API call                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ChangePasswordService.changePassword(                            │
│    currentPassword,                                               │
│    newPassword,                                                   │
│    token                                                          │
│  )                                                                │
│                                                                   │
│  Creates HTTP POST request:                                       │
│  ├─ URL: http://localhost:3000/api/auth/change-password          │
│  ├─ Headers:                                                      │
│  │  ├─ Authorization: Bearer <token>                              │
│  │  └─ Content-Type: application/json                             │
│  └─ Body:                                                         │
│     ├─ currentPassword                                            │
│     ├─ newPassword                                                │
│     └─ confirmPassword                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Middleware: verifyToken                                       │
│     ├─ Extract token from header                                  │
│     ├─ Verify JWT signature                                       │
│     └─ Attach user to request                                     │
│                                                                   │
│  2. Validation                                                    │
│     ├─ Check currentPassword provided                             │
│     ├─ Check newPassword provided                                 │
│     ├─ Check password length                                      │
│     ├─ Check password contains digit                              │
│     └─ Check password contains special char                       │
│                                                                   │
│  3. Authentication                                                │
│     ├─ Find user by ID                                            │
│     └─ Verify currentPassword matches stored                      │
│                                                                   │
│  4. Update                                                        │
│     ├─ Hash new password                                          │
│     ├─ Update user record                                         │
│     └─ Log change event                                           │
│                                                                   │
│  5. Response                                                      │
│     ├─ Success: { success: true, message, data }                  │
│     └─ Error: { success: false, message }                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONSE HANDLING                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Subscribe to Observable:                                         │
│                                                                   │
│  next: (response) => {                                            │
│    if (response.success) {                                        │
│      ├─ Set successMessage                                        │
│      ├─ Clear form fields                                         │
│      └─ Schedule redirect                                         │
│    } else {                                                       │
│      └─ Set errorMessage                                          │
│    }                                                              │
│  }                                                                │
│                                                                   │
│  error: (error) => {                                              │
│    └─ Set errorMessage from error response                        │
│  }                                                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    SETTINGS COMPONENT                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  goToChangePassword()                                      │  │
│  │  ├─ Toggle showChangePassword                             │  │
│  │  ├─ Reset form fields                                     │  │
│  │  └─ Clear messages                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  submitChangePassword()                                    │  │
│  │  ├─ Validate form                                         │  │
│  │  ├─ Get JWT token from localStorage                       │  │
│  │  ├─ Call fetch API                                        │  │
│  │  ├─ Handle response                                       │  │
│  │  └─ Show message                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  cancelChangePassword()                                    │  │
│  │  ├─ Hide form                                             │  │
│  │  ├─ Clear form fields                                     │  │
│  │  └─ Clear messages                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│              CHANGE PASSWORD COMPONENT                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  onSubmit()                                                │  │
│  │  ├─ Validate form                                         │  │
│  │  ├─ Get JWT token from localStorage                       │  │
│  │  ├─ Call ChangePasswordService                            │  │
│  │  ├─ Handle response                                       │  │
│  │  └─ Redirect on success                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  goBack()                                                  │  │
│  │  └─ Navigate to /settings                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│           CHANGE PASSWORD SERVICE                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  changePassword(                                           │  │
│  │    currentPassword,                                        │  │
│  │    newPassword,                                            │  │
│  │    token                                                   │  │
│  │  ): Observable<any>                                        │  │
│  │                                                            │  │
│  │  ├─ Create headers with JWT token                         │  │
│  │  ├─ Create request body                                   │  │
│  │  └─ Return http.post() Observable                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIOS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. VALIDATION ERROR (Frontend)                                   │
│     ├─ Missing fields                                             │
│     ├─ Passwords don't match                                      │
│     ├─ Password too short                                         │
│     ├─ Missing number                                             │
│     └─ Missing special character                                  │
│     └─ Action: Show errorMessage, don't call API                  │
│                                                                   │
│  2. AUTHENTICATION ERROR (Backend)                                │
│     ├─ No token provided                                          │
│     ├─ Invalid token                                              │
│     └─ Token expired                                              │
│     └─ Action: Return 401, redirect to login                      │
│                                                                   │
│  3. VALIDATION ERROR (Backend)                                    │
│     ├─ Current password incorrect                                 │
│     ├─ Password too weak                                          │
│     └─ User not found                                             │
│     └─ Action: Return 400, show error message                     │
│                                                                   │
│  4. SERVER ERROR (Backend)                                        │
│     ├─ Database error                                             │
│     ├─ Unexpected exception                                       │
│     └─ Action: Return 500, show generic error                     │
│                                                                   │
│  5. NETWORK ERROR (Frontend)                                      │
│     ├─ No internet connection                                     │
│     ├─ Request timeout                                            │
│     └─ Action: Show error message, allow retry                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  LAYER 1: Frontend Validation                                     │
│  ├─ Prevent invalid data submission                               │
│  ├─ Improve UX with immediate feedback                            │
│  └─ Reduce server load                                            │
│                                                                   │
│  LAYER 2: HTTPS/TLS                                               │
│  ├─ Encrypt data in transit                                       │
│  ├─ Prevent man-in-the-middle attacks                             │
│  └─ Verify server identity                                        │
│                                                                   │
│  LAYER 3: JWT Authentication                                      │
│  ├─ Verify user identity                                          │
│  ├─ Prevent unauthorized access                                   │
│  └─ Token expiration                                              │
│                                                                   │
│  LAYER 4: Current Password Verification                           │
│  ├─ Prevent unauthorized password changes                         │
│  ├─ Verify user intent                                            │
│  └─ Additional security check                                     │
│                                                                   │
│  LAYER 5: Backend Validation                                      │
│  ├─ Enforce password strength                                     │
│  ├─ Prevent weak passwords                                        │
│  └─ Server-side security                                          │
│                                                                   │
│  LAYER 6: Password Hashing                                        │
│  ├─ Hash passwords with bcrypt                                    │
│  ├─ Never store plain text                                        │
│  └─ Prevent database breaches                                     │
│                                                                   │
│  LAYER 7: Audit Logging                                           │
│  ├─ Log all password changes                                      │
│  ├─ Track IP and user agent                                       │
│  └─ Detect suspicious activity                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```
