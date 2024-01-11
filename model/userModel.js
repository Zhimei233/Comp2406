const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // Assuming you want each username to be unique
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, { collection: 'users' }); // This is specifying which collection to use

const User = mongoose.model('User', userSchema);

module.exports = User;
