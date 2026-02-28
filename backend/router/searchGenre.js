const express = require("express");
const SearchGenre = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model");
const AnimeDB = require("../models/AniDB.js");
const JSONAUTH = process.env.jsonauth;

SearchGenre.get("/Search",async(req,res)=>{
    const Token = req.cookies.anipub;
    let query = req.query.genre;
      if(req.query.genre){
           query = query.toLowerCase()
    }
    let page = 1;
    if(req.query.page === undefined) {
        page = 1;
    }
    else {
        if( !isNaN(req.query.page))
        {
              page = Number((req.query.page));
        }
        else {
            page =1 
        }
        
    }
       let alus = 20*(page-1);
     let linkI = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
    AnimeDB.find({"Genres":query},{Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1,finder:1}).skip(alus).limit(20)
    .then(info=>{
        const AniData = info;
            if (Token) {
            jwt.verify(Token, JSONAUTH, (err, data) => {
                if (err) {
                    console.log(err);
                }
                Data.findById(`${data.id}`)
                    .then((INFO) => {
                        let link = INFO.Image;
                        const Gender = INFO.Gender;
    
                        if (Gender === "Male") {
                            const finalLink = `boys/` + link;
    
                            res.render("search", {
                                Anime: AniData, 
                                query,
                                auth: true,
                                ID: data.id,
                                Link: finalLink
                            });
    
                        } else {
    
                            res.render("search", {
                                Anime: AniData, 
                                query,
                                auth: true,
                                ID: data.id,
                                Link: link
                            });
                        }
                    })
    
            })
        } 
        else {
            res.render("search", {
            Anime: AniData, 
            query,
            auth: false,
            ID: "guest",
            Link: linkI,
        });
    }
     })
})

module.exports = SearchGenre;
