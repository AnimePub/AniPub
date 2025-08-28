const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KEY = new Schema({
    _id: {
        type: String,
        required: false,
    },
    KEY: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 345600,
        default: Date.now
    }
})

const PASSRECOVER = mongoose.model("passrec", KEY);
module.exports = PASSRECOVER;