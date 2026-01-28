const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Message schema for storing chat messages
const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Data',
        required: true,
    },
    senderName: {
        type: String,
        required: true,
    },
    senderImage: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Room schema for chat groups/rooms
const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    messages: [messageSchema],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Data',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);
const Room = mongoose.model('Room', roomSchema);

module.exports = {
    Message,
    Room,
};
