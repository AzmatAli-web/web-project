// Mock database for products
let products = [
  { 
    id: 1, 
    title: 'Used Laptop', 
    description: 'Dell laptop in good condition', 
    price: 15000, 
    category: 'Electronics', 
    seller: 'Sara Khan',
    image: '/uploads/laptop.jpg'
  },
  { 
    id: 2, 
    title: 'iPhone 13', 
    description: 'iPhone 13 128GB', 
    price: 60000, 
    category: 'Electronics', 
    seller: 'Ali Raza',
    image: '/uploads/iphone.jpg'
  },
];

let nextProductId = 3;

/**
 * GET all products
 */
exports.getAllProducts = (req, res) => {
  res.json(products);
};

/**
 * GET single product by ID
 */
exports.getProductById = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

/**
 * CREATE new product (with optional image upload)
 */
exports.createProduct = (req, res) => {
  const { title, description, price, category } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and price are required" });
  }

  const newProduct = {
    id: nextProductId++,
    title,
    description: description || '',
    price: parseFloat(price),
    category: category || 'Other',
    seller: 'Current User', // Replace with authenticated user
    image: req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg',
  };

  products.push(newProduct);

  // Return success message with minimal detail
  res.status(201).json({ 
    message: "Image received! Product created successfully.", 
    productId: newProduct.id 
  });
};

/**
 * UPDATE product
 */
exports.updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.body.title) product.title = req.body.title;
  if (req.body.description) product.description = req.body.description;
  if (req.body.price) product.price = req.body.price;
  if (req.body.category) product.category = req.body.category;

  res.json({ message: "Product updated", product });
};

/**
 * DELETE product
 */
exports.deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);
  res.json({ message: "Product deleted" });
};
