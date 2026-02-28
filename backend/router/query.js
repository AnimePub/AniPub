const express = require("express");
const SearchQ = express.Router();
const jwt = require("jsonwebtoken");
const JSONAUTH = process.env.jsonauth;
const mongoose = require("mongoose");
const Data = require("../models/model");
const AnimeDB = require("../models/AniDB.js");

SearchQ.post("/search/q",async (req,res)=>{
    
    const regex = new RegExp(req.body.query)
   AnimeDB.find({Name:{$regex:regex,$options:"i"}},{Name:1,finder:1,Image:1})
    .then(ser=>{
   if(ser.length>0 && ser.length === 1 ) { 
   const sendBack = {
        Name: ser[0].Name,
        Id : ser[0].finder,
        Image : ser[0].ImagePath
    }
    res.json(JSON.stringify(sendBack));
    }
    else if (ser.length > 1) {
        const ArrayDB = [];
        ser.forEach((value,i)=>{
             ArrayDB.push(
    {
        Name: ser[i].Name,
        Id : ser[i]._id,
        Image : ser[i].ImagePath
    }
    )
    })
      res.json(JSON.stringify(ArrayDB));
    }
    else {
        res.json(0);
    }
      
    })
})
SearchQ.get("/search/q",async(req,res)=>{
    const query = req.query.query ;
    let type = false ;
    if(req.query.type){
           type = (req.query.type).toLowerCase()
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
     const Token = req.cookies.anipub;
    //  const dlenght = await AnimeDB.countDocuments();
     let alus = 20*(page-1);
    let linkI = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
    if( type === "airing") {
          AnimeDB.find({Status:"Ongoing"},{Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1,finder:1}).skip(alus).limit(20)
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
                                    query:"Airing",
                                    auth: true,
                                    ID: data.id,
                                    Link: finalLink
                                });
        
                            } else {
        
                                res.render("search", {
                                    Anime: AniData, 
                                    query:"Airing",
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
                query:"Airing",
                auth: false,
                ID: "guest",
                Link: linkI,
            });
        }
         })
    }
    else if (type === "all") {
        AnimeDB.find({},{Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1,finder:1}).sort({
        updatedAt: -1
    }).skip(alus).limit(20)
    
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
                                    query:"All",
                                    auth: true,
                                    ID: data.id,
                                    Link: finalLink
                                });
        
                            } else {
        
                                res.render("search", {
                                    Anime: AniData, 
                                    query:"All",
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
                 query:"All",
                auth: false,
                ID: "guest",
                Link: linkI,
            });
        }
         })
    }
    else {
    const regex = new RegExp(query);
           AnimeDB.find({Name:{$regex:regex,$options:"i"}}).skip(alus).limit(20)
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
           }
})

module.exports = SearchQ;
