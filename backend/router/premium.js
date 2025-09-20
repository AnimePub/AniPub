const express = require("express");
const PremiumR = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model.js");
const Pr = require("../models/premium.js");
const JSONAUTH = process.env.jsonauth;
const validAdmin = require("../middleware/validAdmin.js");
const validAdminReq = require("../middleware/validReqfAdmin.js");

PremiumR.get("/Admin/Premium",validAdmin,async (req,res)=>{
    const userData = await Pr.find();
    res.render("grant",{
        userData
    })
})
PremiumR.get("/Admin/:type/Premium/:id",validAdminReq,async (req,res)=>{
    const ID = req.params.id;
    const type = req.params.type;
    Data.findById(ID)
    .then(async info=>{
        if(info) {
            if(type === "Grant") {
                  await Data.findByIdAndUpdate(ID,{"Premium":"Yes"})
          await Pr.findByIdAndUpdate(ID,{"grant":"Yes"})
           res.json(0)
            }
            else if (type === "Revoke") {
                 await Data.findByIdAndUpdate(ID,{"Premium":""})
          await Pr.findByIdAndUpdate(ID,{"grant":""})
           res.json(0)
            }
         
        }
        else {
            res.json(1)
        }
    })
})
PremiumR.get("/Pr/Photo/:id",validAdminReq,(req,res)=>{
    const ID = req.params.id;
    Data.findById(ID)
    .then(info=>{
        const body = {
            gender : info.Gender,
            Image : info.Image,
        }
        res.json(JSON.stringify(body));
    })
})

module.exports = PremiumR ;