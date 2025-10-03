const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const Data = new Schema({
    Name: {
        type: String,
        required: true,
    },
    AcStats: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: [true, "This email is already registered"],
        lowercase: true,
    },
    Password: {
        type: String,
        required: false,
        minlength: [8, "please use a pass 8 cher long"]
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    profilePicture: {
        type: String,
        required: false,
    },
    GenreList: {
        type: Array,
        required: false,
    },
    Bio: {
        type: String,
        required: false,
    },
    Image: {
        type: String,
        required: false,
    },
    Gender: {
        type: String,
        required: false,
    },
    Hobby: {
        type: String,
        required: false,
    },
    Address: {
        type: String,
        required: false,
    },
    RelationshipStatus: {
        type: String,
        required: false,
    },
    BloodGroup: {
        type: String,
        required: false,
    },
    Hide: {
        type:Array,
        required:false
    },
    Premium:{
        type:String,
        required:false,
    },
    userType: {
        type: String,
        required: true,
    }
})

Data.pre("save", async function(next) {
    if (this.Password && this.Password.length > 0) {
        const salt = await bcrypt.genSalt();
        const hashedpass = await bcrypt.hash(this.Password, salt);
        this.Password = hashedpass;
    }
    next();
});

const RegistrationData = mongoose.model("Data", Data);
module.exports = RegistrationData;