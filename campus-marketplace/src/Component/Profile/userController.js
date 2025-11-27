const Product = require('../models/Product');

/**
 * @desc    Get products for the logged-in user
 * @route   GET /api/users/my-products
 * @access  Private
 */
exports.getMyProducts = async (req, res) => {
  try {
    // req.user.id is set by the auth middleware
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};