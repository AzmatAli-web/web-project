// controllers/authController.js
const jwt = require('jsonwebtoken');
const { users, userIdCounter } = require('../config/database'); // Import your in-memory DB

let currentUserId = userIdCounter; // Use your existing counter

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Registration attempt:', { username, email });

    // Check if user exists (using your existing users array)
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user matching your existing structure
    const user = {
      id: currentUserId++,
      name: username, // Your DB uses "name" not "username"
      email: email,
      password: password, // In real app, you should hash this
      createdAt: new Date()
    };
    
    // Add to your existing users array
    users.push(user);

    // Generate token
    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('✅ SIGNUP SUCCESSFUL:', { 
      userId: user.id, 
      name: user.name,
      email: user.email 
    });

    console.log('📝 Total users now:', users.length);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name, // Use "name" to match your structure
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

    // Find user in your existing users array
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password (simple comparison for now)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('✅ LOGIN SUCCESSFUL:', { 
      userId: user.id, 
      name: user.name,
      email: user.email 
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name, // Use "name" to match your structure
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
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name, // Use "name" to match your structure
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