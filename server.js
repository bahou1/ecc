const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/routes'); // Import the routes file

const app = express(); // Initialize the express app first
app.use(cors()); // Apply CORS middleware
dotenv.config();

const port = process.env.PORT || 3000;

// Use the routes in your application
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
