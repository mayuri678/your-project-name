# Backend Setup Guide

## Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "admin",
      "name": "Admin User",
      "role": "admin"
    }
  }
}
```

### 2. Change Password
**POST** `/api/auth/change-password`

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "currentPassword": "admin123",
  "newPassword": "NewPass@123",
  "confirmPassword": "NewPass@123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "email": "admin",
    "changedAt": "2026-03-24T06:15:00.000Z"
  }
}
```

### 3. Get Password Change History
**GET** `/api/auth/password-change-history`

Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "userId": 1,
      "email": "admin",
      "changedAt": "2026-03-24T06:15:00.000Z",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

### 4. Health Check
**GET** `/api/health`

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Default Users

The backend comes with these default users:

| Email | Password | Role |
|-------|----------|------|
| admin | admin123 | admin |
| user1 | user123 | user |
| test@example.com | test123 | user |

## Testing with cURL

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin","password":"admin123"}'
```

### Change Password:
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"admin123","newPassword":"NewPass@123","confirmPassword":"NewPass@123"}'
```

## Environment Variables

Create a `.env` file in the backend folder:

```
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## Notes

- The backend uses in-memory storage (data is lost on restart)
- For production, replace with a real database (MongoDB, PostgreSQL, etc.)
- Passwords are stored in plain text (NOT RECOMMENDED for production)
- Use bcrypt for password hashing in production
- Change JWT_SECRET in production
