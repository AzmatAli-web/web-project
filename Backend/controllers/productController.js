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

// Get products by seller ID
const getProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 }).populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, contact, location } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Create a URL path for the image, suitable for frontend consumption
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category' });
    }

    const product = new Product({
      name,
      price: Number(price),
      description: description || '',
      category,
      image: imageUrl, // Store image URL
      contact: contact || '',
      location: location || '',
      seller: req.user?.id || null
    });

    await product.save();
    await product.populate('seller', 'name email');

    res.status(201).json({
      message: 'Product created successfully',
      product: product
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, contact, location, status } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.seller || !product.seller.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    } else if (req.body.removeImage === 'true') {
      product.image = null;
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.contact = contact || product.contact;
    product.location = location || product.location;
    product.status = status || product.status;

    await product.save();
    await product.populate('seller', 'name email');

    res.json({
      message: 'Product updated successfully',
      product: product
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

    if (!product.seller || !product.seller.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();

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
  getProductsBySeller,
  getProductsByCategory,
};