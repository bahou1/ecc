const bcrypt = require('bcrypt');
const multer = require('multer'); 
const path = require('path');
const User = require('../models/UserModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, 'profile-' + Date.now() + ext);
    },
  });
  
  const upload = multer({ storage: storage }).single('profilePicture');
  
  exports.registerUser = async (req, res, next) => {
    try {
      upload(req, res, async function (err) {
        if (err) {
          console.error('Error during file upload:', err);
          return res.status(500).json({ error: 'Error during file upload' });
        }
  
        const { username, email, password } = req.body;
        console.log('Received registration request:', { username, email, password });
  
        const existingUser = await User.findOne({ email });
  
        if (existingUser) {
          return res.status(400).json({ error: 'Email already exists' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          profilePicture: req.file ? req.file.path : null,
        });
  
        await newUser.save(); // Save the user to the database
  
        console.log('User saved successfully');
  
        // Log file information
        if (req.file) {
          console.log('Uploaded file information:', {
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: req.file.path,
          });
        }
  
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  res.send('get user page');
};

exports.updateUserProfile = async (req, res) => {
  res.send('update user page');
};

exports.deleteUserProfile = async (req, res) => {
  res.send('delete user profile');
};
