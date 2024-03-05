// routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers'); // Adjusted import


 router.get('/products', productControllers.getAllProducts);
// router.get('/products/:id', productControllers.getProductById);
 router.post('/products', productControllers.createProduct);
 router.put('/products/:id', productControllers.updateProduct);
 router.delete('/products/:id', productControllers.deleteProduct);


router.get('/products/category', productControllers.getProductsByCategory);
router.get('/products/sort', productControllers.getProductsSorted);
router.get('/products/search', productControllers.searchProducts);
router.get('/products/price-range', productControllers.getProductsByPriceRange);
router.get('/products/paginated', productControllers.getPaginatedProducts);


module.exports = router;