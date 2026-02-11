const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderAvatar: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DirectMessage',
    default: null
  },
  replyToMessage: {
    type: String,
    default: null
  },
  replyToSender: {
    type: String,
    default: null
  },
  reactions: [{
    emoji: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }],
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 259200 // Auto-delete after 3 days
  }
});

// Index for efficient queries
directMessageSchema.index({ participants: 1, createdAt: -1 });

module.exports = mongoose.model('DirectMessage', directMessageSchema);
