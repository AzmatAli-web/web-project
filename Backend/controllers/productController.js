const Product = require('../models/product');
const path = require('path');
const fs = require('fs');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).populate('seller', 'name email').lean();

    // ✅ Create absolute image URLs for each product
    const productsWithUrls = products.map(product => {
      if (product.image) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        product.imageUrl = `${baseUrl}${product.image}`;
      } else {
        product.imageUrl = null;
      }
      return product;
    });
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

    // ✅ Create absolute image URL for the single product
    if (product.image) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      product.imageUrl = `${baseUrl}${product.image}`;
    } else {
      product.imageUrl = null;
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
    const products = await Product.find({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } }).populate('seller', 'name email').lean();

    // ✅ Create absolute image URLs for the categorized products
    const productsWithUrls = products.map(product => {
      if (product.image) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        product.imageUrl = `${baseUrl}${product.image}`;
      } else {
        product.imageUrl = null;
      }
      return product;
    });
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
    let imageUrl = null;

    if (req.file) {
      // Use path.posix.join to ensure forward slashes for the URL
      imageUrl = path.posix.join('/uploads', req.file.filename);
    }

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category' });
    }

    const product = new Product({
      name,
      price: Number(price),
      description: description || '',
      category,
      image: imageUrl, // Store image URL as a string
      contact: contact || '',
      location: location || '',
      seller: req.user?.id || null
    });

    await product.save();
    await product.populate('seller', 'name email');

    // ✅ Convert to a plain object to add the absolute imageUrl
    const productObj = product.toObject();
    if (productObj.image) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      productObj.imageUrl = `${baseUrl}${productObj.image}`;
    }

    res.status(201).json({
      message: 'Product created successfully',
      product: productObj // ✅ Send the modified object
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
      // Set the image URL, ensuring forward slashes
      product.image = path.posix.join('/uploads', req.file.filename);
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

    // ✅ Convert to a plain object to add the absolute imageUrl
    const productObj = product.toObject();
    if (productObj.image) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      productObj.imageUrl = `${baseUrl}${productObj.image}`;
    }

    res.json({
      message: 'Product updated successfully',
      product: productObj // ✅ Send the modified object
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