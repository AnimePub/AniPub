const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const Data = new Schema({
    Name:{
        type:String,
        required:true,
    },
    AcStats:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        unique:[true,"This email is already registered"],
        lowercase:true,
    },
    Password:{
        type:String,
        required:true,
        minlength:[8,"please use a pass 8 cher long"]
    },
    GenreList:{
        type:Array,
        required:false,
    },
    Bio : {
        type:String,
        required:false,
    },
    Image : {
        type:String,
        required:false,
    },
    Gender : {
        type:String,
        required:false,
    },
    Hobby:{
        type:String,
        required:false,
    },
    Address:{
        type:String,
        required:false,
    },
    RelationshipStatus:{
        type:String,
        required:false,
    },
    BloodGroup :{
        type:String,
        required:false,
    },
    userType:{
     type:String,
     required:true,   
    },
    List: [
        {
            _id:{
                type:String,
                required:false,
            },
            id:{
                type:String,
                required:false,
            }
        }
    ]
})

Data.pre("save",async function(next){
 const salt = await bcrypt.genSalt();
const hashedpass = await bcrypt.hash(this.Password,salt);
 this.Password = hashedpass;
 next();
});


const RegistrationData = mongoose.model("Data",Data);
module.exports = RegistrationData ;

