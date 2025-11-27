const Product = require('../models/Product');

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ownership verification
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this product' });
    }

    // ... (rest of the update logic from your existing file)
    // This is a placeholder for your existing update logic.
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ownership verification
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this product' });
    }

    await product.remove();
    res.json({ message: 'Product removed' });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};