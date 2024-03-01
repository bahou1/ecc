const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/routes'); // Import the routes file
const mongoose = require('mongoose');


const app = express(); // Initialize the express app first
app.use(cors()); // Apply CORS middleware
dotenv.config();

const port = process.env.PORT || 3000;
// Use the routes in your application
app.use('/api', routes);



// MongoDB
mongoose.connect('mongodb+srv://yeezyanwar:benmolay@project1.zurxw0g.mongodb.net/?retryWrites=true&w=majority&appName=project1', {})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });







app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
