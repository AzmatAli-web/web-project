const User = require('../models/user');
const Product = require('../models/product'); // ✅ FIX: Standardize path to lowercase 'product'

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile - UPDATED WITH DEBUG LOGGING
const getCurrentUser = async (req, res) => {
  try {
    console.log('🟡 getCurrentUser - Request received');
    console.log('🟡 User ID from token:', req.user.id);
    console.log('🟡 Token user object:', req.user);

    // Check if req.user.id exists and is valid
    if (!req.user.id) {
      console.log('❌ No user ID in request');
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    console.log('🟡 Searching for user in database...');
    const user = await User.findById(req.user.id).select('-password');
    
    console.log('🟡 Database query result:', user);

    if (!user) {
      console.log('❌ User not found in database for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ getCurrentUser - Success for user:', user.email);
    res.json(user);
  } catch (error) {
    console.error('❌ getCurrentUser - Error details:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error in getCurrentUser',
      error: error.message 
    });
  }
};

// ✅ NEW: Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    // Return user without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve user (Admin only)
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'approved';
    await user.save();

    res.json({ 
      message: 'User approved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products for the currently authenticated user
const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });

    // Process products to add image URL and remove binary data
    const processedProducts = products.map(product => {
      const productObj = product.toObject();
      if (productObj.image && productObj.image.data) {
        productObj.hasImage = true;
      } else {
        productObj.hasImage = false;
      }
      delete productObj.image; // Remove image data from the response
      return productObj;
    });

    res.json(processedProducts);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getUsers, 
  getUserById, 
  getCurrentUser,
  updateProfile,
  approveUser,
  deleteUser,
  getMyProducts // Export the new function
};