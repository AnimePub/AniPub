const express = require("express");
const APIKEY = express.Router();
const jwt = require("jsonwebtoken");
const apikey = process.env.apikey;
const mongoose = require("mongoose");
const Data = require("../models/model");
const getID = require("../middleware/getcookieID");
const JSONAUTH = process.env.jsonauth;

//let's make it for 1 year heh ..
const KeyGen = (id) => {
    return jwt.sign({
        id
    }, apikey , {
        expiresIn:  31536000
    });
}

APIKEY.get("/APIKEY",async (req,res)=>{
     const id = await getID(req,JSONAUTH);
     const myKey = KeyGen(id);
    if (id) {
         const userINFO = await Data.findById(id)
             const userData = {
                  ID: userINFO._id,
                        Name:  userINFO.Name,
                        Email:  userINFO.Email,
                        Image:   userINFO.Image,
                        Count:userINFO.count,
                        Gender:  userINFO.Gender,
                        userType : userINFO.userType,
            }
            res.render("APIKEY", {
                Auth: true,
                userInfo:{
                ID: id
                },
                alu: "s",
                userData,
                myKey
            });
    }
    else {
         res.redirect("/Login")
    }

})


module.exports = APIKEY