// routes/routes.js
const express = require('express');
const router = express.Router();

// Corrected paths for register and login routes
router.post('/auth/register', (req, res) => {
    res.send('User registration endpoint');
  });
  
  router.post('/auth/login', (req, res) => {
    res.send('User login endpoint');
  });
router.get('/profile', (req, res) => {
  res.send('Get user profile endpoint');
});
router.put('/profile', (req, res) => {
  res.send('Update user profile endpoint');
});
router.delete('/profile', (req, res) => {
  res.send('Delete user profile endpoint');
});
router.get('/products', (req, res) => {
  res.send('Get all products endpoint');
});
router.get('/products/:id', (req, res) => {
  res.send(`Get product with ID ${req.params.id} endpoint`);
});
router.post('/products', (req, res) => {
  res.send('Create new product endpoint');
});
router.put('/products/:id', (req, res) => {
  res.send(`Update product with ID ${req.params.id} endpoint`);
});
router.delete('/products/:id', (req, res) => {
  res.send(`Delete product with ID ${req.params.id} endpoint`);
});

module.exports = router;
