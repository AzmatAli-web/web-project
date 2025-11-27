const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  getProductsByCategory
} = require('../controllers/productController');
const upload = require('../utils/multerConfig');
const Product = require('../models/product'); // ✅ ADD THIS IMPORT

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log('🟡 Product Route Hit:', req.method, req.url);
  next();
});

// Create new product
router.post('/', upload.single('image'), (req, res, next) => {
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

// ✅ ADD THIS NEW ROUTE - Get product image
router.get('/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.image || !product.image.data) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', product.image.contentType);
    res.send(product.image.data);
    
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Error fetching image' });
  }
});

module.exports = router;