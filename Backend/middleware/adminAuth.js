// middleware/adminAuth.js
const User = require('../models/user');

const adminAuth = async (req, res, next) => {
  try {
    console.log('🔍 ADMIN AUTH - Checking user:', req.user); // ✅ DEBUG LOG
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('❌ ADMIN AUTH - User not found');
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (user.role !== 'admin') {
      console.log('❌ ADMIN AUTH - User role is not admin:', user.role);
      return res.status(403).json({ 
        message: 'Admin privileges required', 
        yourRole: user.role 
      });
    }
    
    console.log('✅ ADMIN AUTH - Access granted for admin:', user.email);
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminAuth;