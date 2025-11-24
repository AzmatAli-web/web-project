// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, verify } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/user'); // ✅ ADD THIS

// PUBLIC routes - NO auth middleware
router.post('/register', register);
router.post('/login', login);

// ✅ TEMPORARY: Create admin route (remove after use)
router.post('/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOneAndUpdate(
      { email: email },
      { 
        role: 'admin', 
        status: 'approved' 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User promoted to admin:', user.email);
    res.json({ 
      message: 'User promoted to admin successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// PROTECTED routes - WITH auth middleware  
router.get('/verify', auth, verify);

module.exports = router;