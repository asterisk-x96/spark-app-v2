const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const checkInSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    goal: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    created_datetime: String
  });

const checkIn = mongoose.model('Goal', goalSchema);

module.exports = checkIn;
