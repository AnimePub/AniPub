const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vcode = new Schema({
    _id: {
        type: String,
        required: true,
    },
    vCode: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        expires: 1800,
        default: Date.now
    }
})

const VCODE = mongoose.model("verify", Vcode);
module.exports = VCODE;