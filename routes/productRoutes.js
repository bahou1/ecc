// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers'); // Adjusted import

// Product Routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/query', productController.getProductsByQuery);
router.get('/products/stats', productController.getProductsStats);
module.exports = router;