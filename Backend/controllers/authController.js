const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendResendVerificationEmail } = require('../utils/emailService');
const { generateVerificationToken, verifyEmailToken } = require('../utils/tokenService');

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
    
    // Generate verification token
    const verificationToken = generateVerificationToken(null, email); // Will use email for now
    
    const user = new User({ 
      name, 
      email, 
      password: hashed, 
      role: 'user', 
      status: 'pending',
      isVerified: false,
      verificationToken: verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    await user.save();

    // Update token with actual user ID
    const finalVerificationToken = generateVerificationToken(user._id, email);
    user.verificationToken = finalVerificationToken;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, finalVerificationToken, name);
      console.log(`✅ Verification email sent to ${email}`);
    } catch (emailError) {
      console.warn(`⚠️ Could not send verification email, but user created: ${emailError.message}`);
      // Continue registration even if email fails
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );

    return res.status(201).json({ 
      message: 'Registration successful! Please verify your email to continue.', 
      token, 
      requiresVerification: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isVerified: user.isVerified
      } 
    });
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

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Verify token validity
    const decoded = verifyEmailToken(token);
    
    // Find user and check if already verified
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    return res.json({ 
      message: 'Email verified successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error.message.includes('expired')) {
      return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
    }
    
    res.status(400).json({ message: error.message || 'Invalid verification token' });
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const newVerificationToken = generateVerificationToken(user._id, email);
    user.verificationToken = newVerificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send verification email
    try {
      await sendResendVerificationEmail(email, newVerificationToken, user.name);
      return res.json({ 
        message: 'Verification email sent! Please check your inbox.' 
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send verification email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error during resend verification' });
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

module.exports = { register, login, verify, verifyEmail, resendVerificationEmail };