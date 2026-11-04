const { addImageUrls } = require("../utils/productImage");
const User = require("../models/user");
const Product = require("../models/product"); // ✅ FIX: Standardize path to lowercase 'product'

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password -verificationToken -verificationTokenExpiry",
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verificationToken -verificationTokenExpiry",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile - UPDATED WITH DEBUG LOGGING
const getCurrentUser = async (req, res) => {
  try {
    // Check if req.user.id exists and is valid
    if (!req.user.id) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(req.user.id).select(
      "-password -verificationToken -verificationTokenExpiry",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ getCurrentUser - Error details:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      message: "Server error in getCurrentUser",
      error: error.message,
    });
  }
};

// ✅ NEW: Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already taken" });
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
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve user (Admin only)
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "approved";
    await user.save();

    res.json({
      message: "User approved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(user._id) === String(req.user.id)) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete current user's account (User self-deletion)
const deleteCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    // Delete the user's account
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    // Also delete all user's products
    await Product.deleteMany({ seller: userId });

    res.json({
      message: "Your account has been permanently deleted",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error while deleting account" });
  }
};

// Get products for the currently authenticated user
const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .lean();

    const productsWithUrls = products.map(addImageUrls);
    res.json(productsWithUrls);
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  approveUser,
  deleteUser,
  deleteCurrentUser,
  getMyProducts, // Export the new function
};
