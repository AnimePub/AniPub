const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Episodes = new Schema({
    _id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false,
        trim: true,
    },

    link: {
        type: String,
        trim: true,
        required: false,
    },
    title: {
        type: String,
        trim: true,
        required: false,
    },
})
// trim removes exta space !
//enum ensures that it set's a predicted value
const AnimeDB = new Schema({
    name: {
        type: String,
        required: true,
    },
    _id: {
        type: Number,
        required: false,
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    ImagePath: {
        type: String,
        trim: true
    },
    Cover: {
        type: String,
        trim: true
    },
    Synonyms: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: false,
        trim: true
    },
    poster: {
        type: String,
        trim: true
    },
    Aired: {
        type: String,
        trim: true
    },
    Premiered: {
        type: String,
        trim: true
    },
    Duration: {
        type: String,
        trim: true
    },
    Status: {
        type: String,
        trim: true,
    },
    MALScore: {
        type: String,
        trim: true
    },
    RatingsNum: {
        type: Number,
        min: 0
    },
    Genres: {
        type: Array,
        required: true,
    },
    Studios: {
        type: String,
        trim: true
    },
    Producers: {
        type: String,
        trim: true
    },
    DescripTion: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true,
        enum: ['iframe', 'mp4', 'other']
    },
    ep: [Episodes]

}, {
    timestamps: true
})

const AniDB = mongoose.model("AniDB", AnimeDB);

module.exports = AniDB;