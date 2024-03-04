const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('../models/ProductModel');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json(allProducts);
  } catch (error) {
    console.error('Error getting all products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
}).single('profilePicture');

exports.createProduct = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { title, description, price, category, owner, stock, published } = req.body;

      if (!title || !description || !price || !category || !owner || stock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const images = req.file ? [req.file.path] : [];

      const newProduct = new Product({
        title,
        description,
        price,
        category,
        owner,
        stock,
        published: published || true,
        images,
      });

      await newProduct.validate();
      await newProduct.save();

      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error.errors) {
      const errorFields = Object.keys(error.errors);
      return res.status(400).json({ error: `Validation error for fields: ${errorFields.join(', ')}` });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price, category, owner, stock, published } = req.body;

    console.log('Updating product with ID:', productId);

    // Check if productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.error('Invalid ObjectId:', productId);
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    // Create an object with the fields to update
    const updateFields = {};
    if (typeof title !== 'undefined') updateFields.title = title;
    if (typeof description !== 'undefined') updateFields.description = description;
    if (typeof price !== 'undefined' && !isNaN(price)) updateFields.price = Number(price);
    if (typeof category !== 'undefined') updateFields.category = category;
    if (typeof owner !== 'undefined') updateFields.owner = owner;
    if (typeof stock !== 'undefined' && !isNaN(stock)) updateFields.stock = Number(stock);
    if (typeof published !== 'undefined') updateFields.published = published;

    console.log('Update fields:', updateFields);

    // Use findByIdAndUpdate to update the product
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateFields,
        { new: true }
      );

      if (!updatedProduct) {
        console.error('Product not found for ID:', productId);
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log('Product updated successfully:', updatedProduct);

      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (updateError) {
      console.error('Error updating product:', updateError);
      res.status(500).json({ error: 'Error updating product' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductsByQuery = async (req, res) => {
  try {
    const filteredProducts = await Product.find(req.query);
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error('Error getting products by query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getProductsStats = async (req, res) => {
  try {
    const productStats = await Product.aggregate([
      { $group: { _id: null, count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
    ]);

    res.status(200).json(productStats[0] || { count: 0, avgPrice: 0 });
  } catch (error) {
    console.error('Error getting products stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
