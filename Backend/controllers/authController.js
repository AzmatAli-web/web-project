const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: 'user', status: 'pending' });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    return res.json({ message: 'Registration successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const verify = async (req, res) => {
  try {
    return res.json({ user: req.user || null });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error during verify' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login data submitted (controller):', { email, password });

    // ✅ ADMIN HANDLING
    if (email === 'admin@campus.com' && password === 'admin123') {
      let user = await User.findOne({ email: 'admin@campus.com' });

      // Create admin if doesn't exist
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
      }

      // Ensure admin role/status
      if (user.role !== 'admin' || user.status !== 'approved') {
        await User.updateOne({ email: 'admin@campus.com' }, { role: 'admin', status: 'approved' });
        user.role = 'admin';
        user.status = 'approved';
      }

      const token = jwt.sign({ id: user._id, role: 'admin', email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
      
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'admin'
        }
      });
    }

    // Regular user login (your existing code)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login, verify };