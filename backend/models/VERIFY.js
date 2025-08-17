const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CODEFORYOU = new Schema ({
     _id:{
        type:String,
        required:true,
    },
    CODEV :{
        type:String,
        required:false,
    },
    newmail:{
        type:String,
        required:false,
    },
    createdAt: 
    { type: Date, 
        expires: 1800, 
        default: Date.now }

})

const mailChanger = mongoose.model("mail",CODEFORYOU);
module.exports = mailChanger;