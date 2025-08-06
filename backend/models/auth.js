const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Vcode = new Schema({
    vCode :{
        type:Number,
        required:false,
    },
    createdAt: 
    { type: Date, 
        expires: 3600, 
        default: Date.now }
}
) 

const VCODE = mongoose.model("verify",Vcode);
module.exports = VCODE;