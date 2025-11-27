const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/users/my-products
// @desc    Get all products for the logged-in user
// @access  Private
router.get('/my-products', auth, userController.getMyProducts);

module.exports = router;