const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  targetGoal: {
    type: Number,
    default: 0
  },
  currentProgress: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['food', 'clothes', 'books', 'toys', 'medical', 'other'],
    default: 'other'
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: null
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);