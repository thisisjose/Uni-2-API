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
  organizer: {  // AGREGAR ESTE CAMPO
    type: String,
    required: true
  },
  targetGoal: {  // AGREGAR ESTE CAMPO (opcional)
    type: Number,
    default: 0
  },
  currentProgress: {  // AGREGAR ESTE CAMPO
    type: Number,
    default: 0
  },
  category: {  // AGREGAR ESTE CAMPO
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
    // userName NO va aquí porque viene del User referenciado
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
  createdBy: {  // AGREGAR - RELACIÓN CON USUARIO
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);