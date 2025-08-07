const express = require("express");
const VERIFY = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Data = require("../models/model");
const cookieParser = require("cookie-parser");
const Vcode = require("../models/auth.js")

VERIFY.get("/verify/:code",(req,res)=>{
    const verificationCode = req.params.code;
    Vcode.findById(verificationCode)
    .then(info=>{
        if(info) {
            const id = info._id;
            Data.findById(id).then(alu=>{
                if(alu.AcStats === "Pending") {
                            Data.findByIdAndUpdate(id,{AcStats:"Active"})
                    .then(alu=>{
                            const myCookie = TokenGen(id);
                    res.cookie("anipub",myCookie,{httpOnly:true,maxAge:60*24*60*3});
                        const Msge = [`Hey ${alu.Name}!`
                        ,"Your Account Have been verified , You are now Good to Go!"]
                    res.render("Notify",{Msge})  })
                }
                else {
                    res.redirect("/Notify/?active=true")
                }
            })

            
         
        
            
        }
        else {
            const Msge = ["This Link Won't Work ? the link only stays for 30min"]
                    res.render("Notify",{Msge})
        }
    })
    .catch(err=>{
        console.log(err);
    })

})


module.exports = VERIFY;