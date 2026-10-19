const mongoose = require('mongoose');

const downloads = new mongoose.Schema({
     _id: {
        type: String,
        required: false,
    },
    type:{
        type:String,
        required:true,
    },
    downloads:{
        type:Number,
        required:false,
    },
    email:{
         type:String,
        required:false,
         trim: true
    }
})


const Device = mongoose.model("device", downloads);

module.exports = Device;