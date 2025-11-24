const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import MongoDB User model

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });

    // Check if user exists (using MongoDB)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user in MongoDB
    const user = new User({
      name: name,
      email: email,
      password: password // In real app, you should hash this
    });
    
    await user.save();

    // ✅ TOKEN PART - UNCHANGED
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('✅ SIGNUP SUCCESSFUL:', { 
      userId: user._id, 
      name: user.name,
      email: user.email 
    });

    res.status(201).json({
      message: 'User registered successfully',
      token, // ✅ UNCHANGED
      user: {
        id: user._id, // Now using MongoDB _id
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password (simple comparison for now)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ TOKEN PART - UNCHANGED
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('✅ LOGIN SUCCESSFUL:', { 
      userId: user._id, 
      name: user.name,
      email: user.email 
    });

    res.json({
      message: 'Login successful',
      token, // ✅ UNCHANGED
      user: {
        id: user._id, // Now using MongoDB _id
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const verify = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id, // Now using MongoDB _id
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(500).json({ message: 'Token verification failed' });
  }
};

module.exports = {
  register,
  login, 
  verify
};