const express = require('express');
const router = express.Router();
const prodCtrl = require('../controllers/productController');

// public list/get
router.get('/', prodCtrl.getProducts);
router.get('/:id', prodCtrl.getProduct);

// protected-looking (no real auth) — for demo we accept requests
router.post('/', prodCtrl.createProduct);
router.put('/:id', prodCtrl.updateProduct);
router.delete('/:id', prodCtrl.deleteProduct);

module.exports = router;
