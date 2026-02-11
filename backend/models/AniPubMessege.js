const mongoose = require('mongoose');

const anipubMessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  messages: [{
    role: String,
    content: String
  }],
  aiResponse: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 259200
  }
});

module.exports = mongoose.model('AnipubMessage', anipubMessageSchema);
