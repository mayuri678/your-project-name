# Supabase Login Test Guide

## Step 1: First Register (Sign Up)
1. Go to `/supabase-login`
2. Click "Don't have an account? Sign Up"
3. Enter your email: `test@example.com`
4. Enter your password: `password123`
5. Click "Sign Up"
6. You will be redirected to profile page

## Step 2: Then Login
1. Go to `/supabase-login` 
2. Make sure it shows "Login" (not Sign Up)
3. Enter same email: `test@example.com`
4. Enter same password: `password123`
5. Click "Login"
6. You will be redirected to profile page

## Why This Happens:
- Supabase requires users to first register (create account)
- Only registered users can login
- If you try to login without registering first, you get "Invalid email or password"

## Test Flow:
1. **First time**: Sign Up → Creates account → Redirects to profile
2. **Next time**: Login → Uses existing account → Redirects to profile

## Check Your Supabase Dashboard:
1. Go to your Supabase project
2. Click "Authentication" → "Users"
3. You should see your registered user there
4. This confirms the account was created successfully