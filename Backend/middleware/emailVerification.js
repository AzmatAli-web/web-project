// middleware/emailVerification.js
const User = require('../models/user');

/**
 * Middleware to check if user's email is verified
 * Attach to routes that require verified emails
 */
const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Email verification required',
        requiresVerification: true,
        email: user.email
      });
    }

    // User is verified, continue
    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = requireEmailVerification;
