const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); 

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  username: {
    type: String,
    required: true,
    unique: true
  }, 
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: String,
  avatar: String,
  friends: [String],  
  fund: Number
});

userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it is new or modified
    if (!this.isModified('password')) {
      return next();
    }

    // Generate a salt and hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(this.password, 10);

    // Replace the plaintext password with the hashed password
    this.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;