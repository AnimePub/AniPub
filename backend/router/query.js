const express = require("express");
const SearchQ = express.Router();
const jwt = require("jsonwebtoken");
const JSONAUTH = process.env.jsonauth;
const mongoose = require("mongoose");
const Data = require("../models/model");
const AnimeDB = require("../models/AniDB.js");

SearchQ.post("/search/q",async (req,res)=>{
    const regex = new RegExp(req.body.query)
   AnimeDB.find({Name:{$regex:regex,$options:"i"}})
    .then(ser=>{
   if(ser.length>0) { 
   const sendBack = {
        Name: ser[0].Name,
        Id : ser[0]._id,
        Image : ser[0].ImagePath
    }
    res.json(JSON.stringify(sendBack));
    }
    else {
        res.json(0);
    }
      
    })
})

module.exports = SearchQ;