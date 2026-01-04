// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, verify, verifyEmail, resendVerificationEmail } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// PUBLIC routes
router.post('/register', register);

// Email verification routes
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

// UPDATED LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login data submitted:', { email, password });

    // Admin shortcut: accept admin@campus.com with password 'admin123'
    if (email === 'admin@campus.com' && password === 'admin123') {
      let user = await User.findOne({ email });

      // Create admin user if it doesn't exist
      if (!user) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        user = new User({
          name: 'Admin',
          email: 'admin@campus.com',
          password: hashedPassword,
          role: 'admin',
          status: 'approved'
        });
        await user.save();
      } else {
        // Ensure role/status are admin
        if (user.role !== 'admin' || user.status !== 'approved') {
          await User.updateOne({ email }, { role: 'admin', status: 'approved' });
          user.role = 'admin';
          user.status = 'approved';
        }
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'admin',
          status: user.status
        }
      });
    }

    // Regular login flow
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// DEBUG route
router.get('/debug-role', auth, (req, res) => {
  res.json({ user: req.user });
});

// PROTECTED routes  
router.get('/verify', auth, verify);

module.exports = router;