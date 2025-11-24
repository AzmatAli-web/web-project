 

// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, verify } = require('../controllers/authController');
const auth = require('../middleware/auth');

// PUBLIC routes - NO auth middleware
router.post('/register', register);
router.post('/login', login);

// PROTECTED routes - WITH auth middleware  
router.get('/verify', auth, verify);

module.exports = router;