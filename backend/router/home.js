const express = require("express");
const HomeRouter = express.Router();
const jwt = require("jsonwebtoken");
const OP = require("../Data/data");
const mongoose = require("mongoose");
const Data = require("../models/model");

HomeRouter.get("/",(req,res)=>{
    res.render("index");
})
HomeRouter.get("/Home",(req,res)=>{
    const Token = req.cookies.anipub;
    let linkI  = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err) {
                console.log(err);
            }
            
            Data.findById(`${data.id}`)
            .then(info=>{
                let link = info.Image;
                const Gender = info.Gender;
                if (Gender === "Male") {
                    const finalLink = `boys/`+ link;
                res.render("Home",{Anime:OP,auth:true,ID:data.id,Link:finalLink});

                }
                else {
                     res.render("Home",{Anime:OP,auth:true,ID:data.id,Link:link});
                }
              
              
    
            })
             
        })
    }
    else {
        res.render("Home",{Anime:OP,auth:false,ID:"guest",Link:linkI});
    }
    
    
})

module.exports = HomeRouter;

// This is how we add router hehe ...