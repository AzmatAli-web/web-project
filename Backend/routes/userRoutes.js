 
// module.exports = router;
const express = require('express');
const { 
  getUsers, 
  getUserById, 
  getCurrentUser,
  updateProfile,  // ✅ ADD
  approveUser,      
  deleteUser        
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', auth, adminAuth, getUsers);        
router.get('/me', auth, getCurrentUser);
router.get('/:id', auth, adminAuth, getUserById);  
router.put('/profile', auth, updateProfile);        // ✅ NEW ROUTE
router.put('/:id/approve', auth, adminAuth, approveUser);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;