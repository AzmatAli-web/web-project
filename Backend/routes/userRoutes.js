 
// module.exports = router;
const express = require('express');
const { 
  getUsers, 
  getUserById, 
  getCurrentUser,
  updateProfile,  // ✅ ADD
  approveUser,
  getMyProducts, // ✅ NEW: Import getMyProducts
  deleteUser,
  deleteCurrentUser   // ✅ NEW: Import deleteCurrentUser for self-deletion
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', auth, adminAuth, getUsers);
router.get('/my-products', auth, getMyProducts); // ✅ NEW: Route for user's products
router.get('/me', auth, getCurrentUser);
router.get('/:id', auth, adminAuth, getUserById);  
router.put('/profile', auth, updateProfile);        // ✅ NEW ROUTE
router.put('/:id/approve', auth, adminAuth, approveUser);
router.delete('/me', auth, deleteCurrentUser);      // ✅ NEW: Route for user to delete their own account
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;