const express = require("express");
const PremiumR = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model.js");
const Pr = require("../models/premium.js");
const JSONAUTH = process.env.jsonauth;


PremiumR.get("/Admin/Premium",async (req,res)=>{
    const userData = await Pr.find();
    res.render("grant",{
        userData
    })
})