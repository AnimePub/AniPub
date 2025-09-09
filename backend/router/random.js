const express = require("express");
const Random = express.Router();
const mongoose = require("mongoose");
const AnimeDB = require("../models/AniDB.js");



Random.get("/Random",async (req,res)=>{
   const total = await AnimeDB.find().estimatedDocumentCount();
   const RanDOm = Number(total)
   const NUM = getRandomNum(RanDOm,1) ;
   res.redirect(`/AniPlayer/${NUM}/0`)
})

function getRandomNum (max,min) {
    const Alu = Math.floor(Math.random() * (max-min) + min );
    return Alu;
}
module.exports = Random;