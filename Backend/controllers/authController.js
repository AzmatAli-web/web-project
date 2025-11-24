const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ✅ ADD THIS LINE
const User = require('../models/user');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ MINIMAL CHANGE: Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with HASHED password
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword // ✅ CHANGED: Store hashed password
    });
    
    await user.save();

    // Token generation (unchanged)
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
      token,
      user: {
        id: user._id,
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

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ MINIMAL CHANGE: Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Token generation (unchanged)
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
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// verify function remains unchanged
const verify = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
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