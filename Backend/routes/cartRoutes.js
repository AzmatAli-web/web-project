const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart, clearCart, createCheckoutSession } = require('../controllers/cartController');
const auth = require('../middleware/auth');

// POST /api/cart/add - Add item to cart (requires auth)
router.post('/add', auth, addToCart);

// GET /api/cart - Get user's cart (requires auth) 
router.get('/', auth, getCart);

// DELETE /api/cart/:itemId - Remove item from cart (requires auth)
router.delete('/:itemId', auth, removeFromCart);

// DELETE /api/cart - Clear entire cart (requires auth)
router.delete('/', auth, clearCart);

// POST /api/cart/create-checkout-session - Create a stripe checkout session
router.post('/create-checkout-session', auth, createCheckoutSession);

module.exports = router;
