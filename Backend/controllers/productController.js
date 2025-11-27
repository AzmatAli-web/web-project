const Product = require('../models/product');

// Get all products - UPDATED
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).populate('seller', 'name email');
    
    // Process products to include hasImage flag and remove binary data
    const processedProducts = products.map(product => {
      const productObj = product.toObject();
      if (productObj.image && productObj.image.data) {
        productObj.hasImage = true;
      } else {
        productObj.hasImage = false;
      }
      delete productObj.image; // Remove actual image data from the response
      return productObj;
    });

    res.json(processedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single product by ID - UPDATED
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Process product to include hasImage flag and remove binary data
    const productObj = product.toObject();
    if (productObj.image && productObj.image.data) {
      productObj.hasImage = true;
    } else {
      productObj.hasImage = false;
    }
    delete productObj.image; // Remove actual image data from the response

    res.json(productObj);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by category - UPDATED
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: { $regex: new RegExp(`^${categoryName}$`, 'i') } }).populate('seller', 'name email');

    // Process products to include hasImage flag and remove binary data
    const processedProducts = products.map(product => {
      const productObj = product.toObject();
      productObj.hasImage = !!(productObj.image && productObj.image.data);
      delete productObj.image;
      return productObj;
    });

    res.json(processedProducts);

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

    const processedProducts = products.map(product => {
      const productObj = product.toObject();
      productObj.hasImage = !!(productObj.image && productObj.image.data);
      delete productObj.image;
      return productObj;
    });

    res.json(processedProducts);
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Create new product - UPDATED WITH DEBUG
const createProduct = async (req, res) => {
  try {
    // SAFE FIELD ACCESS
    const name = req.body?.name;
    const price = req.body?.price;
    const description = req.body?.description;
    const category = req.body?.category;
    const contact = req.body?.contact;
    const location = req.body?.location;

    console.log('🟡 Extracted fields:', { name, price, category });
    console.log('🟡 req.file exists:', !!req.file);
    console.log('🟡 req.file buffer length:', req.file?.buffer?.length);
    console.log('🟡 req.file mimetype:', req.file?.mimetype);

    // Handle image storage in database
    let imageData = null;
    if (req.file && req.file.buffer) {
      imageData = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      console.log('✅ Image stored in database - Size:', req.file.buffer.length, 'bytes');
    } else {
      console.log('❌ No file or file buffer received');
    }

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields: name, price, category' });
    }

    const product = new Product({
      name,
      price: Number(price),
      description: description || '',
      category,
      image: imageData, // Store image in database
      contact: contact || '',
      location: location || '',
      seller: req.user?.id || null
    });

    await product.save();
    await product.populate('seller', 'name email');

    // Don't send image data in response to avoid large payloads
    const responseProduct = product.toObject();
  delete responseProduct.image;

    res.status(201).json({ 
      message: 'Product created successfully', 
      product: responseProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Update product - UPDATED with ownership check
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, contact, location, status } = req.body;

    const product = await Product.findById(req.params.id).populate('seller', 'id');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product', owner: product.seller.toString(), currentUser: req.user.id });
    }

    // Handle image storage in database if a new file is uploaded
    if (req.file && req.file.buffer) {
      product.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
      console.log('✅ New image uploaded and stored in database - Size:', req.file.buffer.length, 'bytes');
    } else if (req.body.removeImage === 'true') { // Assuming frontend sends removeImage: true to clear image
      product.image = null;
      console.log('🗑️ Product image removed.');
    }


    // Update fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.contact = contact || product.contact;
    product.location = location || product.location;
    product.status = status || product.status;

    await product.save();
    await product.populate('seller', 'name email');

    // Don't send image data in response to avoid large payloads
    const responseProduct = product.toObject();
    delete responseProduct.image;

    res.json({
      message: 'Product updated successfully',
      product: responseProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product - UPDATED with ownership check
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

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product image from database
const getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.image || !product.image.data || !product.image.contentType) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', product.image.contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(product.image.data);
  } catch (error) {
    console.error('Error serving product image:', error);
    res.status(500).json({ message: 'Server error serving image' });
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
  getProductImage // Export the new function
};