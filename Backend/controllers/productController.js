const Product = require('../models/product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
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

// Create new product - UPDATED WITH DEBUG LOGGING
const createProduct = async (req, res) => {
  try {
    console.log('🟡 CREATE PRODUCT - Request received');
    console.log('🟡 Request body:', req.body);
    console.log('🟡 User ID from auth:', req.user?.id);

    const { name, price, description, category, image } = req.body;

    // Validate required fields
    if (!name || !price || !description || !category) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields: name, price, description, category' 
      });
    }

    console.log('🟡 Creating product with data:', {
      name, price, description, category, image
    });

    const product = new Product({
      name,
      price,
      description,
      category,
      image: image || '/images/default-product.jpg',
      seller: req.user.id // From auth middleware
    });

    console.log('🟡 Product object created, saving to database...');

    await product.save();
    console.log('✅ Product saved to database successfully');
    
    // Populate seller info in response
    await product.populate('seller', 'name email');
    console.log('✅ Product populated with seller info');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('❌ ERROR creating product:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error creating product: ' + error.message 
    });
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
  deleteProduct
};