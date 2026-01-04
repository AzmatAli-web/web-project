const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT token for email verification
const generateVerificationToken = (userId, email) => {
  const token = jwt.sign(
    { 
      id: userId, 
      email: email,
      type: 'email-verification'
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '24h' } // Token expires in 24 hours
  );
  
  return token;
};

// Generate simple random token for database storage (if needed for additional security)
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Verify email verification token
const verifyEmailToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );
    
    if (decoded.type !== 'email-verification') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired verification token');
  }
};

// Generate password reset token
const generatePasswordResetToken = (userId, email) => {
  const token = jwt.sign(
    { 
      id: userId, 
      email: email,
      type: 'password-reset'
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1h' } // Reset token expires in 1 hour
  );
  
  return token;
};

// Verify password reset token
const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    );
    
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
};

module.exports = {
  generateVerificationToken,
  generateRandomToken,
  verifyEmailToken,
  generatePasswordResetToken,
  verifyPasswordResetToken
};
