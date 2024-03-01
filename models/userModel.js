// In your UserModel.js file
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String, 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
