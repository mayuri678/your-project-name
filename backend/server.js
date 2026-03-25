// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory database (replace with real database)
let users = [];
let passwordChangeHistory = [];

// Initialize with default users
function initializeUsers() {
  users = [
    { id: 1, email: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
    { id: 2, email: 'user1', password: 'user123', name: 'User One', role: 'user' },
    { id: 3, email: 'test@example.com', password: 'test123', name: 'Test User', role: 'user' }
  ];
}

initializeUsers();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Routes

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Change password endpoint
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log('🔍 Change password request for user:', userEmail);

    // Validation
    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is required'
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (!/\d/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 1 number'
      });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 1 special character'
      });
    }

    // Find user
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date().toISOString();

    // Log password change
    passwordChangeHistory.push({
      userId,
      email: userEmail,
      changedAt: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    console.log('✅ Password changed for user:', userEmail);

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: {
        email: user.email,
        changedAt: user.passwordChangedAt
      }
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Get password change history
app.get('/api/auth/password-change-history', verifyToken, (req, res) => {
  try {
    const userEmail = req.user.email;
    const history = passwordChangeHistory.filter(h => h.email === userEmail);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/change-password');
  console.log('  GET /api/auth/password-change-history');
  console.log('  GET /api/health');
});
