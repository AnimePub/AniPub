const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const codes = new Schema({
    email:{
        required:true,
        type:String,
        trim:true,
    },
    code :{
        type:Number,
        trim:true,
        required:true
    }
 , createdAt: {
        type: Date,
        expires: 345600,
        default: Date.now
}
    })

const codeModel = mongoose.model("reset", codes);

module.exports = codeModel;