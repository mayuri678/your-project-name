# JWT Authentication Implementation

Complete Angular JWT authentication system with login form, profile page, and token-based API calls.

## 📁 Files Created

### Services
- **`services/jwt-auth.service.ts`** - Main authentication service
- **`services/mock-api.service.ts`** - Mock backend API (replace with real API)

### Components
- **`components/jwt-login.component.ts`** - Login form with email/password
- **`components/jwt-profile.component.ts`** - User profile display

## 🚀 Quick Start

### 1. Navigate to Login Page
```
http://localhost:4200/jwt-login
```

### 2. Test Credentials
**User Account:**
- Email: `user@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

### 3. After Login
- JWT token is stored in localStorage
- Automatically redirected to profile page
- Profile data fetched using Authorization Bearer token

## 🔧 Implementation Details

### JWT Auth Service (`jwt-auth.service.ts`)

```typescript
// Login - stores JWT token in localStorage
login(credentials: LoginRequest): Observable<LoginResponse>

// Get Profile - uses Authorization Bearer token
getProfile(): Observable<UserProfile>

// Logout - clears token from localStorage
logout(): void

// Get stored token
getToken(): string | null
```

### Login Component (`jwt-login.component.ts`)

Features:
- Email/password form
- Form validation
- Loading state
- Error handling
- Auto-redirect on success

### Profile Component (`jwt-profile.component.ts`)

Features:
- Displays user information
- Refresh profile button
- Logout functionality
- Error handling
- Auto-redirect to login if unauthorized

## 📝 Usage Examples

### Login Flow
```typescript
// User enters credentials
credentials = {
  email: 'user@example.com',
  password: 'password123'
}

// Service calls API
authService.login(credentials).subscribe({
  next: (response) => {
    // Token stored: localStorage.setItem('auth_token', response.token)
    // Navigate to profile
  },
  error: (error) => {
    // Show error message
  }
});
```

### Profile Fetch Flow
```typescript
// Service gets token from localStorage
const token = localStorage.getItem('auth_token');

// Calls API with Authorization header
// Headers: { 'Authorization': 'Bearer <token>' }
authService.getProfile().subscribe({
  next: (profile) => {
    // Display profile data
  },
  error: (error) => {
    // Handle error (e.g., redirect to login if 401)
  }
});
```

## 🔄 Replacing Mock API with Real API

### Step 1: Update JWT Auth Service

Replace the mock API calls with real HTTP calls:

```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';

constructor(private http: HttpClient) {}

private apiUrl = 'https://your-api.com/api';

login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(
    `${this.apiUrl}/auth/login`, 
    credentials
  ).pipe(
    tap(response => {
      localStorage.setItem(this.tokenKey, response.token);
      this.isAuthenticatedSubject.next(true);
    })
  );
}

getProfile(): Observable<UserProfile> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.getToken()}`
  });
  return this.http.get<UserProfile>(
    `${this.apiUrl}/user/profile`, 
    { headers }
  );
}
```

### Step 2: Backend API Requirements

Your backend should provide these endpoints:

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**GET /api/user/profile**
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "avatar": "https://example.com/avatar.jpg"
}
```

## 🔐 Security Features

- ✅ JWT token stored in localStorage
- ✅ Authorization Bearer header for API calls
- ✅ Token validation on profile fetch
- ✅ Auto-logout on 401 unauthorized
- ✅ Token cleared on logout

## 🎨 Customization

### Styling
Both components use inline styles. To customize:
1. Extract styles to separate CSS files
2. Modify colors, spacing, and layout
3. Add your brand styling

### Form Fields
To add more fields to login:
1. Update `LoginRequest` interface
2. Add form fields in template
3. Update form model binding

### Profile Fields
To display more profile data:
1. Update `UserProfile` interface
2. Add fields in profile template
3. Update backend API response

## 🧪 Testing

### Test Login
1. Navigate to `/jwt-login`
2. Enter test credentials
3. Click "Login"
4. Check localStorage for `auth_token`
5. Verify redirect to `/jwt-profile`

### Test Profile
1. After login, check profile displays
2. Click "Refresh Profile" to reload data
3. Click "Logout" to clear token
4. Verify redirect to login page

### Test Token Expiry
1. Login successfully
2. Manually remove token from localStorage
3. Try to access profile page
4. Should redirect to login

## 📦 Dependencies

Required Angular packages:
- `@angular/common`
- `@angular/core`
- `@angular/forms`
- `@angular/router`
- `rxjs`

Already configured in your project.

## 🔗 Routes

Add these routes to `app.routes.ts`:
```typescript
{ path: 'jwt-login', component: JwtLoginComponent },
{ path: 'jwt-profile', component: JwtProfileComponent }
```

## 💡 Tips

1. **Token Storage**: localStorage is used for simplicity. Consider using httpOnly cookies for production.
2. **Token Refresh**: Implement token refresh logic for long-lived sessions.
3. **Route Guards**: Add auth guards to protect routes.
4. **Interceptors**: Use HTTP interceptors to automatically add Authorization headers.
5. **Error Handling**: Implement global error handling for API calls.

## 🐛 Troubleshooting

**Login fails:**
- Check credentials match mock API users
- Check browser console for errors
- Verify mock API service is working

**Profile not loading:**
- Check token exists in localStorage
- Verify token format is correct
- Check browser console for API errors

**Token not persisting:**
- Check localStorage is enabled
- Verify browser privacy settings
- Check for localStorage quota errors

## 📚 Next Steps

1. Replace mock API with real backend
2. Add route guards for protected routes
3. Implement token refresh mechanism
4. Add HTTP interceptor for automatic token injection
5. Add password reset functionality
6. Implement remember me feature
7. Add social login options

## 🤝 Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are created correctly
3. Check Angular version compatibility
4. Review implementation against this README
