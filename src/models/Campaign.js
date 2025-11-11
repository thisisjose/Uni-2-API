const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  targetGoal: {
    type: Number,
    required: true
  },
  currentProgress: {
    type: Number,
    default: 0
  },
  participants: [{
    userId: String,
    userName: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['food', 'clothes', 'books', 'toys', 'medical', 'other'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);