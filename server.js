const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Add this line
const userRoutes = require('./routes/UserRoutes');
const productRoutes = require('./routes/productRoutes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express(); // Initialize the express app
app.use(express.json());
app.use(cors()); // Apply CORS middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// MongoDB Connection
mongoose.connect('mongodb+srv://77anwarrr:benmolay@cluster0.yjfttsq.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
// Route Registrations
const port = process.env.PORT || 3000;
app.use('/api', userRoutes);
app.use('/api', productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
