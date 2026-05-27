const express = require("express");
const PremiumR = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model.js");
const Pr = require("../models/premium.js");
const JSONAUTH = process.env.jsonauth;
const getID = require("../middleware/getcookieID");
const validAdmin = require("../middleware/validAdmin.js");
const validAdminReq = require("../middleware/validReqfAdmin.js");
const mailBody = require("../templates/preconf.js");
const nodemailer = require("nodemailer")
const AUTHSMTP = process.env.auth;
const PASSWORD = process.env.pass;
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 2465,
    secure: true,
    auth: {
        user: AUTHSMTP,
        pass: PASSWORD,
    }
})

PremiumR.get("/Admin/Premium",validAdmin,async (req,res)=>{
    const userData = await Pr.find();
    res.render("grant",{
        userData
    })
})
PremiumR.get("/Admin/:type/Premium/:id",validAdminReq,async (req,res)=>{
    const ID = req.params.id;
    const type = req.params.type;
    Data.findOne({"_id":ID})
    .then(async info=>{
        if(info) {
            if(type === "Grant") {
                  await Data.findByIdAndUpdate(ID,{"Premium":"Yes"})
          await Pr.findByIdAndUpdate(ID,{"grant":"Yes"})
          const mailOptions = {
                            from: `premium@anipub.xyz`,
                            to:info.Email,
                            subject: `Premium Account Activated!`,
                            html: mailBody(info.Name),
                        }
                         transporter.sendMail(mailOptions, (err, DATAINFO) => { 
                            if(err) {
                                console.log("Error")
                                res.json(1)
                            }
                            else {
                                 console.log(DATAINFO)
                                      res.json(0)
                            }
                           
                         })

     
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
PremiumR.post("/pr/change/cover",async(req,res)=>{
    let cover = req.body.coverlink
    let userID = await getID(req,JSONAUTH);
    let stat = await Data.find({"_id":userID},{Premium:1})
    if(stat[0].Premium === "Yes") {
        Data.findByIdAndUpdate(userID,{Cover:cover})
        .then(info=>{
            res.json([9])
        })
    }
    else {
        res.json([10])
    }

})
module.exports = PremiumR ;