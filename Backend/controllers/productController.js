const Product = require('../models/product');
const path = require('path');

// ✅ Helper function to add image URLs
const addImageUrls = (product) => {
  if (product.image) {
    // Return relative URL so Vite proxy can intercept in dev
    product.imageUrl = product.image;
  } else {
    product.imageUrl = null;
  }
  return product;
};

// ✅ NEW: Search products by query
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || !q.trim()) {
      return res.json([]);
    }

    // Search in name, description, and category
    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate('seller', 'name email')
      .lean();

    const productsWithUrls = products.map(addImageUrls);

    res.json(productsWithUrls);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).populate('seller', 'name email').lean();

    const productsWithUrls = products.map(addImageUrls);

    res.json(productsWithUrls);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email').lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productWithUrl = addImageUrls(product);
    res.json(productWithUrl);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } }).populate('seller', 'name email').lean();

    const productsWithUrls = products.map(addImageUrls);

    res.json(productsWithUrls);
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
    // Get image path if file was uploaded
    const imagePath = req.file ? path.posix.join('/uploads', req.file.filename) : null;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category' });
    }

    const product = new Product({
      name,
      price: Number(price),
      description: description || '',
      category,
      image: imagePath, // Save the image path
      contact: contact || '',
      location: location || '',
      seller: req.user?.id || null
    });

    await product.save();
    await product.populate('seller', 'name email');

    const productObj = product.toObject();
    const productWithUrl = addImageUrls(productObj);

    res.status(201).json({
      message: 'Product created successfully',
      product: productWithUrl
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

    // Handle image update
    if (req.file) {
      product.image = path.posix.join('/uploads', req.file.filename);
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

    const productObj = product.toObject();
    const productWithUrl = addImageUrls(productObj);

    res.json({
      message: 'Product updated successfully',
      product: productWithUrl
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
  searchProducts, // ✅ ADD THIS
};