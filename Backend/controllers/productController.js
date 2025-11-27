const Product = require('../models/product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } }).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    console.log('=== DEBUG CREATE PRODUCT ===');
    console.log('req.body:', req.body);
    console.log('req.body type:', typeof req.body);
    console.log('req.body keys:', Object.keys(req.body || {}));
    console.log('req.file:', req.file);
    console.log('req.headers:', req.headers);
    console.log('=== END DEBUG ===');

    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('❌ Request body is empty after multer processing.');
      return res.status(400).json({ message: 'Request body is empty. Ensure form data is sent correctly.' });
    }

    // SAFE FIELD ACCESS
    const name = req.body?.name;
    const price = req.body?.price;
    const description = req.body?.description;
    const category = req.body?.category;
    const contact = req.body?.contact;
    const location = req.body?.location;

    console.log('Extracted fields:', { name, price, category, description, contact, location });

    // Validate only essential fields
    if (!name || !price || !category) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields: name, price, category',
        received: { name, price, category }
      });
    }

    // IMAGE HANDLING
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    console.log('Image path:', image);

    const product = new Product({
      name: name.toString().trim(),
      price: Number(price),
      description: description?.toString().trim() || '',
      category: category.toString().trim(),
      image,
      contact: contact?.toString().trim() || '',
      location: location?.toString().trim() || '',
      seller: req.user?.id || null
    });

    await product.save();
    await product.populate('seller', 'name email');

    console.log('✅ Product created successfully');
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('❌ Product creation error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, status } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Update fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.image = image || product.image;
    product.status = status || product.status;

    await product.save();
    await product.populate('seller', 'name email');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};