const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const premium = new Schema({
    _id:{
    type:String,    
    required:false
    },
    codes:{
        type:Array,
        required:true,
    },
    name:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:false,
    },
    number:{
        type:String,
        required:false,
    },
    country:{
          type:String,
        required:false,
    },
    trxID:{
         type:String,
        required:false,
    }
},{
    timestamps:{
        updatedAt:false,
        createdAt:true,
    }
})

const Premium = mongoose.model("premium",premium);
module.exports = Premium;