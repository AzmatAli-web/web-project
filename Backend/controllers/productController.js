const Product = require('../models/product');
const db = require('../config/database'); // Import once

const getProducts = (req, res) => {
  res.json(db.products);
};

const getProductById = (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
};

const createProduct = (req, res) => {
  const { name, price, description } = req.body;

  const product = new Product(name, price, description);
  product.id = db.productIdCounter;
  db.products.push(product);
  db.productIdCounter++;

  res.status(201).json({
    message: 'Product created successfully',
    product
  });
};

const updateProduct = (req, res) => {
  const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, price, description } = req.body;
  
  db.products[productIndex] = {
    ...db.products[productIndex],
    name: name || db.products[productIndex].name,
    price: price || db.products[productIndex].price,
    description: description || db.products[productIndex].description
  };

  res.json({
    message: 'Product updated successfully',
    product: db.products[productIndex]
  });
};

const deleteProduct = (req, res) => {
  const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  db.products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};