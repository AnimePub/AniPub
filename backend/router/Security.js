const express = require("express");
const Security = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model");
const JSONAUTH = process.env.jsonauth;

Security.get("/privacy", (req, res) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                res.redirect("/Login");
            }
            const userInfo = {
                ID: data.id
            }
            const userINFO = await Data.findById(data.id)
            const userData = {
                  ID: userINFO._id,
                        Name:  userINFO.Name,
                        Email:  userINFO.Email,
                        Image:   userINFO.Image,
                        Gender:  userINFO.Gender,
                        Hide :  userINFO.Hide,
                        userType : userINFO.userType,
            }
            res.render("Security", {
                Auth: true,
                userInfo,
                alu: "s",
                userData
            });
        })
    } else {
        res.redirect("/Login")
    }
})

Security.get("/privacy/hide/:id",(req,res)=>{
     const Token = req.cookies.anipub;
     const hide = req.params.id;
     if(hide === "rlts" || hide === "email" || hide === "address")
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                res.json(0)
            }
            const userInfo = {
                ID: data.id
            }
            let up = "";
            if(hide === "email"){
                up = 1
            }
            else if (hide === "address") {
                up = 2
            }
            else if (hide === "rlts")
            {
                up = 3
            }
            Data.findById(data.id)
            .then(INFO=>{
                const HIDE = INFO.Hide;
                if(HIDE.includes(up)){
                    res.json(0)
                }
                else {
                     Data.findByIdAndUpdate(data.id,{$push:{"Hide":up}})
                     .then(()=>{
                        res.json(1)
                     })
                }
            })
        })
    } else {
        res.json(0);
    }
})

Security.get("/privacy/show/:id",(req,res)=>{
     const Token = req.cookies.anipub;
     const hide = req.params.id;
     if(hide === "rlts" || hide === "email" || hide === "address")
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                res.json(0)
            }
            const userInfo = {
                ID: data.id
            }
            let up = "";
            if(hide === "email"){
                up = 1
            }
            else if (hide === "address") {
                up = 2
            }
            else if (hide === "rlts")
            {
                up = 3
            }
            Data.findById(data.id)
            .then(INFO=>{
                const HIDE = INFO.Hide;
                if(HIDE.includes(up)){
                       Data.findByIdAndUpdate(data.id,{$pull:{"Hide":up}})
                     .then(()=>{
                        res.json(1)
                     })
                }
                else {
                    res.json(0)
                }
            })
        })
    } else {
        res.json(0);
    }
})

module.exports = Security;