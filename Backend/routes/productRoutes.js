const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  getProductsByCategory,
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
router.post('/', auth, upload.single('image'), createProduct);
 
// Get all products
router.get('/', getProducts);

// Get products by category
router.get('/category/:categoryName', getProductsByCategory);

// Get single product by id
router.get('/:id', getProductById);

// Update a product
router.put('/:id', auth, updateProduct);

// Delete a product
router.delete('/:id', auth, deleteProduct);

module.exports = router;