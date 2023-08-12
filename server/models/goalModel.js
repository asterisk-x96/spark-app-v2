const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const goalSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    title: {
      type: String,
      required: true
    },
    description: String,
    due_date: String,
    category: String,
    buddy: String,
    creator: String,
    penalty_enabled: Boolean,
    daily_penalty: Number,
    penalty_fund: Number,
    isCompleted: Boolean,
    created_date: String,
    fund: Number
  });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;

