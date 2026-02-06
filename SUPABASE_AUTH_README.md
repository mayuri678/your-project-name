# Supabase Authentication Setup

## 📦 Installation

Install Supabase client:
```bash
npm install @supabase/supabase-js
```

## 🔧 Supabase Configuration

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get your project URL and anon key

### 2. Update Service Configuration
Edit `services/supabase-auth.service.ts`:
```typescript
this.supabase = createClient(
  'YOUR_SUPABASE_URL',     // Replace with your project URL
  'YOUR_SUPABASE_ANON_KEY' // Replace with your anon key
);
```

### 3. Database Setup
Run the SQL in `supabase-schema.sql` in your Supabase SQL editor:
- Creates `profiles` table
- Sets up Row Level Security (RLS)
- Creates policies for user data access
- Adds updated_at trigger

## 🚀 Usage

### Routes
- `/supabase-login` - Login/signup form
- `/supabase-profile` - User profile (protected)

### Test Flow
1. Navigate to `/supabase-login`
2. Sign up with email/password
3. Check email for verification
4. Login after verification
5. View/edit profile at `/supabase-profile`

## 🔐 Features

### Authentication
- ✅ Email/password signup
- ✅ Email/password login
- ✅ Email verification
- ✅ Session management
- ✅ Auto logout on session expire

### Profile Management
- ✅ Fetch user profile from database
- ✅ Create/update profile data
- ✅ Real-time auth state
- ✅ Route protection with guards

### Security
- ✅ Row Level Security (RLS)
- ✅ User can only access own data
- ✅ Secure session storage
- ✅ Auto token refresh

## 📁 Files Created

### Services
- `services/supabase-auth.service.ts` - Main auth service

### Components
- `components/supabase-login.component.ts` - Login/signup form
- `components/supabase-profile.component.ts` - Profile management

### Guards
- `guards/supabase-auth.guard.ts` - Route protection

### Database
- `supabase-schema.sql` - Database schema

## 🔄 Service Methods

### Authentication
```typescript
// Sign up
await authService.signUp(email, password);

// Sign in
await authService.signIn(email, password);

// Sign out
await authService.signOut();

// Get current user
const user = authService.getCurrentUser();

// Subscribe to auth changes
authService.currentUser$.subscribe(user => {
  // Handle user state changes
});
```

### Profile Management
```typescript
// Get user profile
const { data, error } = await authService.getUserProfile(userId);

// Update profile
const { data, error } = await authService.updateUserProfile(userId, updates);

// Create/update profile
const { data, error } = await authService.upsertUserProfile(profile);
```

## 🛡️ Security Best Practices

### Row Level Security
- Users can only access their own profile data
- Policies enforce data isolation
- Automatic user ID validation

### Session Management
- Sessions stored securely by Supabase
- Auto refresh tokens
- Secure httpOnly cookies (when configured)

## 🎨 Customization

### Add Profile Fields
1. Update database schema
2. Update `UserProfile` interface
3. Add form fields in profile component

### Custom Styling
- Components use inline styles
- Extract to CSS files for customization
- Add your brand colors/fonts

## 🐛 Troubleshooting

### Common Issues

**Login fails:**
- Check Supabase URL/key configuration
- Verify email confirmation if required
- Check browser console for errors

**Profile not loading:**
- Verify database schema is created
- Check RLS policies are active
- Ensure user is authenticated

**Database errors:**
- Run schema SQL in Supabase dashboard
- Check table permissions
- Verify RLS policies

### Debug Tips
```typescript
// Check auth state
console.log('Current user:', authService.getCurrentUser());
console.log('Is authenticated:', authService.isAuthenticated());

// Check session
console.log('Current session:', authService.getCurrentSession());
```

## 📚 Next Steps

1. Configure email templates in Supabase
2. Add password reset functionality
3. Implement social login (Google, GitHub, etc.)
4. Add profile image upload to Supabase Storage
5. Set up real-time subscriptions
6. Add user roles and permissions