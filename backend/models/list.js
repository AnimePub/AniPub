const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const playList = new Schema({
    _id: {
        type: String,
        required: true,
    },
    AniID: {
        type: String,
        required: false,
    },
    AniEP: {
        type: String,
        required: false,
    },
    Date: {
        type: String,
        required: false,
    },

}, {
    timestamps: true
})

const List = new Schema({
    AniID: {
        type: String,
        required: true,
    },
    AniEP: {
        type: String,
        required: true,
    },
    Date: {
        type: String,
        required: true,
    },
    Owner: {
        type: String,
        required: true,
    },
    Progress: {
        required: false,
        type: String,
    }
}, {
    timestamps: true
})

const newList = mongoose.model("List", List);
const myPlaylist = mongoose.model("myList", playList);
module.exports = {
    newList,
    myPlaylist
};