const express = require("express");
const Settings = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Data = require("../models/model");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt")

Settings.post("/data/change",(req,res)=>{
    const token = req.cookies.anipub;
    const data = req.body;
    
    console.log(token,data);
    if(token) {
        jwt.verify(token,"I Am Naruto",async(err,Ddata)=>{
            if(err){
                console.log(err);
            }
            const AccID  = Ddata.id;
            if(data.type === "name") {
                Data.findByIdAndUpdate(AccID,{Name:data.info})
                            .then(info=>{
                               res.json(1); 
                    
                            })

            }
            else if (data.type === "mail") {
                Data.findByIdAndUpdate(AccID,{Email:data.info})
                            .then(info=>{
                                res.json(2);
                           
                            })
            }
            else if (data.type === "pass") {
                const pass = data.info
                const Salt =await bcrypt.genSalt();
                const HashedPass =await bcrypt.hash(pass,Salt); 
                Data.findByIdAndUpdate(AccID,{Password:HashedPass})
                            .then(info=>{
                                res.json(3)
                         
                            })
            }
        })
    }
})

module.exports = Settings;