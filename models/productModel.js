const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.length <= 4;
      },
      message: 'Images array should contain a maximum of 4 URLs',
    },
  },
  owner: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  published: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
