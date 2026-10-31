const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsBySeller,
} = require("../controllers/productController");
const upload = require("../utils/multerConfig");
const auth = require("../middleware/auth");

const router = express.Router();

// Create new product
router.post("/", auth, upload.single("image"), createProduct);

// Get all products
router.get("/", getProducts);

// ✅ NEW: Search products by query (must come before /:id)
router.get("/search", searchProducts);

// Get products by category
router.get("/category/:categoryName", getProductsByCategory);

// Get single product by id
router.get("/user/:sellerId", getProductsBySeller);
router.get("/:id", getProductById);

// Update a product
router.put("/:id", auth, upload.single("image"), updateProduct);

// Delete a product
router.delete("/:id", auth, deleteProduct);

module.exports = router;
