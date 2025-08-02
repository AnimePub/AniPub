const express = require("express");
const HomeRouter = express.Router();
const jwt = require("jsonwebtoken");
const OP = require("../Data/data");


HomeRouter.get("/",(req,res)=>{
    res.render("index");
})
HomeRouter.get("/Home",(req,res)=>{
    const Token = req.cookies.anipub;
    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err) {
                console.log(err);
            }
            
           
             res.render("Home",{Anime:OP,auth:true,ID:data.id});
        })
    }
    else {
        res.render("Home",{Anime:OP,auth:false,ID:"guest"});
    }
    
    
})

module.exports = HomeRouter;

// This is how we add router hehe ...