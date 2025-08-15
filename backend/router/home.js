const express = require("express");
const HomeRouter = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model");
const AnimeDB = require("../models/AniDB.js");

HomeRouter.get("/",(req,res)=>{
    res.render("index");
})
HomeRouter.get("/Home",async(req,res)=>{
     const animeDb = await AnimeDB.find().sort({createdAt: -1}).limit(20);
        const DBarray = [10,3,6,9]
     const DBAnime = await AnimeDB.find({_id:{$in:DBarray}})
    const Token = req.cookies.anipub;
    let linkI  = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err) {
                console.log(err);
            }

            Data.findById(`${data.id}`)
            .then((info)=>{
                let link = info.Image;
                const Gender = info.Gender;
               
                if (Gender === "Male") {
                    const finalLink = `boys/`+ link;
                                             
                    res.render("Home",{Anime:animeDb,DBAnime,auth:true,ID:data.id,Link:finalLink});

                }
                else {
                    
                     res.render("Home",{Anime:animeDb,DBAnime,auth:true,ID:data.id,Link:link});
                }
              
              
    
            })
             
        })
    }
    else {
        res.render("Home",{Anime:animeDb,DBAnime,auth:false,ID:"guest",Link:linkI});
    }
    
    
})

module.exports = HomeRouter;

// This is how we add router hehe ...