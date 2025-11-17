const products = []; // in-memory products
let productId = 1;

exports.getProducts = (req, res) => {
  res.json({ message: 'Products fetched successfully', products });
};

exports.createProduct = (req, res) => {
  const { title, description, price, stock } = req.body;
  if (!title || price == null) return res.status(400).json({ message: 'title and price required' });

  const p = { id: productId++, title, description: description || '', price: Number(price), stock: stock ? Number(stock) : 0 };
  products.push(p);
  res.status(201).json({ message: 'Product created successfully', product: p });
};

exports.getProduct = (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product fetched', product: p });
};

exports.updateProduct = (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).json({ message: 'Product not found' });

  const { title, description, price, stock } = req.body;
  if (title !== undefined) p.title = title;
  if (description !== undefined) p.description = description;
  if (price !== undefined) p.price = Number(price);
  if (stock !== undefined) p.stock = Number(stock);

  res.json({ message: 'Product updated successfully', product: p });
};

exports.deleteProduct = (req, res) => {
  const idx = products.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(idx, 1);
  res.json({ message: 'Product deleted successfully' });
};

// export internal products for tests if needed
exports._internal = { products };
