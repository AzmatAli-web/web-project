const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  getProductsByCategory,
  getProductImage, // Import the new function
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const upload = require('../utils/multerConfig');
const auth = require('../middleware/auth');
 
const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('🟡 Product Route Hit:', req.method, req.url);
  next();
});

// Create new product
router.post('/', auth, upload.single('image'), (req, res, next) => {
  console.log('🟡 Multer processed - req.body:', req.body);
  console.log('🟡 Multer processed - req.file:', req.file);
  next();
}, createProduct);
 
// Get all products
router.get('/', getProducts);

// Get products by category
router.get('/category/:categoryName', getProductsByCategory);

// Get single product by id
router.get('/:id', getProductById);

// Add route for serving product image from DB
router.get('/:id/image', getProductImage); // Use the controller function

// Update a product
router.put('/:id', auth, upload.single('image'), (req, res, next) => {
  console.log('🟡 Multer processed for update - req.body:', req.body);
  console.log('🟡 Multer processed for update - req.file:', req.file);
  next();
}, updateProduct);

// Delete a product
router.delete('/:id', auth, deleteProduct);

module.exports = router;