const Cart = require('../models/cart');
const Product = require('../models/product');

// Get user's cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price image category');

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// Add item to cart - FIXED FOR NUMERIC IDs
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    console.log('🟡 Looking for product with ID:', productId);

    // ✅ FIXED: Find product by numeric ID instead of MongoDB _id
    const product = await Product.findOne({ id: parseInt(productId) });
    
    if (!product) {
      console.log('❌ Product not found for ID:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('✅ Product found:', product.name);

    // Check if product is available
    if (product.status !== 'available') {
      return res.status(400).json({ message: 'Product is not available' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === product._id.toString()
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: product._id, // Store MongoDB _id in cart
        quantity: quantity,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price image category');

    res.json({
      message: 'Product added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error adding to cart: ' + error.message });
  }
};

// Update cart item quantity - FIXED FOR NUMERIC IDs
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Valid product ID and quantity are required' });
    }

    // ✅ FIXED: Find product by numeric ID to get MongoDB _id
    const product = await Product.findOne({ id: parseInt(productId) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === product._id.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price image category');

    res.json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

// Remove item from cart - FIXED FOR NUMERIC IDs
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // ✅ FIXED: Find product by numeric ID to get MongoDB _id
    const product = await Product.findOne({ id: parseInt(productId) });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== product._id.toString()
    );

    await cart.save();
    await cart.populate('items.product', 'name price image category');

    res.json({
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error removing from cart' });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};