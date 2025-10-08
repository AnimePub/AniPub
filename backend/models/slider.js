const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slides = new Schema({
    _id:{
        type:Number,
        require:false
    },
    slArray :{
        type:Array,
    }
})

const slider = mongoose.model("slides", slides);
module.exports = slider;