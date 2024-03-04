const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const User = require('../models/UserModel');
const emailjs = require('@emailjs/nodejs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage }).single('profilePicture');
const uploadFormData = multer().none();

exports.registerUser = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error during file upload:', err);
        return res.status(500).json({ error: 'Error during file upload' });
      }

      const { username, email, password } = req.body;

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

      await newUser.save();

      if (req.file) {
        console.log('Uploading file information:', {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: req.file.path,
        });
      }

      res.status(201).json({ message: 'User registered successfully' });

      const templateParams = {
        name: username,
        notes: 'Thank you for registering!',
      };

      await emailjs.send('service_mm9n37p', '063518', templateParams, {
        publicKey: 't6d38T_eKE7riU3k6',
        privateKey: 'KoX37a62Yjt52xD3s9UrM',
      })
        .then(response => console.log('Registration confirmation email sent successfully', response))
        .catch(error => console.error('Error sending registration confirmation email:', error));
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    cookieParser()(req, res, async (err) => {
      if (err) {
        console.error('Error during cookie parsing:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      uploadFormData(req, res, async (err) => {
        if (err) {
          console.error('Error during form-data parsing:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const { email, password } = req.body;
        console.log('Receiving login request:', { email, password });

        const user = await User.findOne({ email });

        if (user) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log('Input Password:', password);
          console.log('Stored Password:', user.password);
          console.log('Password Matching:', passwordMatch);

          if (passwordMatch) {
            res.cookie('user', { email: user.email, userId: user._id }, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.status(200).json({ message: 'Login successful' });
          } else {
            res.status(401).json({ error: 'Invalid credentials' });
          }
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    cookieParser()(req, res, async (err) => {
      if (err) {
        console.error('Error during cookie parsing:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const userCookie = req.cookies.user;

      if (!userCookie) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { userId } = userCookie;
      const userProfile = await User.findById(userId);
      res.status(200).json(userProfile);
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userCookie = req.cookies.user;

    if (!userCookie) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = userCookie;
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedData = {
      username: req.body.username || existingUser.username,
      email: req.body.email || existingUser.email,
    };

    // Check if a new password is provided
    if (req.body.password) {
      // Compare new password with existing hash
      const passwordMatch = await bcrypt.compare(req.body.password, existingUser.password);

      if (!passwordMatch) {
        // If passwords don't match, update the password hash
        updatedData.password = await bcrypt.hash(req.body.password, 10);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteUserProfile = async (req, res) => {
  try {
    cookieParser()(req, res, async (err) => {
      if (err) {
        console.error('Error during cookie parsing:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const userCookie = req.cookies.user;

      if (!userCookie) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { email, userId } = userCookie;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (deletedUser) {
        res.clearCookie('user');
        res.status(200).json({ message: 'User profile deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (error) {
    console.error('Error during profile deletion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
