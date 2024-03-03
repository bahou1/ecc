// Import necessary modules and dependencies
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const User = require('../models/UserModel');

// Set up multer for handling file uploads
// Define storage settings for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Saving uploaded files in the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, 'profile-' + Date.now() + ext); // Setting a unique filename for each uploaded file
    },
});

// Create multer middleware with the defined storage settings, allowing only a single file with the field name 'profilePicture'
const upload = multer({ storage: storage }).single('profilePicture');

// Another multer middleware for handling 'form-data' parsing, allowing only text fields
const upload2 = multer().none();

// Registering a new user
exports.registerUser = async (req, res, next) => {
    try {
        // Using the 'upload' middleware to handle file upload
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error during file upload:', err);
                return res.status(500).json({ error: 'Error during file upload' });
            }

            // Extracting user registration information from the request body
            const { username, email, password } = req.body;
            console.log('Receiving registration request:', { username, email, password });

            // Checking if the user with the given email already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Hashing the user's password before storing it in the database
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Hashing Password:', hashedPassword);

            // Creating a new user instance with the provided information
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                profilePicture: req.file ? req.file.path : null, // Setting profilePicture to the file path if a file is uploaded, otherwise setting it to null
            });

            // Saving the new user to the database
            await newUser.save();

            console.log('User being saved successfully');

            // Logging file information if a file is uploaded
            if (req.file) {
                console.log('Uploading file information:', {
                    filename: req.file.filename,
                    originalname: req.file.originalname,
                    path: req.file.path,
                });
            }

            // Sending a success response
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Logging in an existing user
exports.loginUser = async (req, res) => {
    try {
        // Using the 'upload2' middleware to handle 'form-data' parsing
        upload2(req, res, async (err) => {
            if (err) {
                console.error('Error during form-data parsing:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Extracting login information from the request body
            const { email, password } = req.body;
            console.log('Receiving login request:', { email, password });

            // Finding the user with the provided email in the database
            const user = await User.findOne({ email });

            if (user) {
                // Comparing the provided password with the stored hashed password
                const passwordMatch = await bcrypt.compare(password, user.password);
                console.log('Input Password:', password);
                console.log('Stored Password:', user.password);
                console.log('Password Matching:', passwordMatch);

                // Sending an appropriate response based on password matching result
                if (passwordMatch) {
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Placeholder functions for user profile operations (not implemented yet)
exports.getUserProfile = async (req, res) => {
    res.send('Getting user page');
};

exports.updateUserProfile = async (req, res) => {
    res.send('Updating user page');
};

// Deleting a user profile
exports.deleteUserProfile = async (req, res) => {
    try {
        // Ensuring that multer has processed the form-data before reaching this handler
        upload(req, res, async function (err) {
            if (err) {
                console.error('Error during form-data processing:', err);
                return res.status(500).json({ error: 'Error during form-data processing' });
            }

            // Extracting the username from form-data
            const { username } = req.body;

            if (!username) {
                return res.status(400).json({ error: 'Username is required in form-data' });
            }

            // Finding the user by username and deleting the profile
            const deletedUser = await User.findOneAndDelete({ username });

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Optionally, you can also delete any associated data, like files or other related information
            // For example, if the user has a profile picture, you might want to delete the file from storage

            // Responding with a success message
            res.json({ message: 'User profile deleted successfully', deletedUser });
        });
    } catch (error) {
        console.error('Error during user profile deletion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
