const express = require("express");
const Settings = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Data = require("../models/model");
const JSONAUTH = process.env.jsonauth;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const mailChanger = require("../models/VERIFY.js");
const passwordMsge = require("../templates/passChange.js");
const PASSRECOVER = require("../models/PassChanger.js");
const AUTHSMTP = process.env.auth;
const mailBody = require("../templates/Chverification.js");
const nodemailer = require("nodemailer")
const PASSWORD = process.env.pass;
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: AUTHSMTP,
        pass: PASSWORD,
    }
})
const generateKey = (value) => {
   return  jwt.sign({"key":value},"This is pass",{
         expiresIn:345600
    })
}

Settings.post("/data/change", (req, res) => {
    const token = req.cookies.anipub;
    const data = req.body;

    if (token) {
        jwt.verify(token, JSONAUTH , async (err, Ddata) => {
            if (err) {
                console.log(err);
            }
            const AccID = Ddata.id;
            if (data.type === "name") {
                Data.findByIdAndUpdate(AccID, {
                        Name: data.info
                    })
                    .then(info => {
                        res.json(1);

                    })

            } else if (data.type === "mail") {

                const ran = Math.round(Math.random() * 10000);

                mailChanger.create({
                        _id: AccID,
                        CODEV: ran,
                        newmail: data.info
                    })
                    .then((info) => {
                        const mailOptions = {
                            from: `mail@adnandluffy.site`,
                            to: data.info,
                            subject: `Confirm Your New Mail`,
                            html: mailBody("Buddy", info._id, info.CODEV),
                        }
                        transporter.sendMail(mailOptions, (err, DATAINFO) => {
                            if (err) {
                                console.log(err)
                            }
                            Data.findByIdAndUpdate(AccID, {
                                    AcStats: "Pending"
                                })
                                .then(heh => {
                                    if (heh) {
                                        res.cookie("anipub", AccID, {
                                            maxAge: 1
                                        })
                                        res.json(2);
                                    }
                                })
                        })
                    })


                // Data.findByIdAndUpdate(AccID,{Email:data.info})
                //             .then(info=>{
                //                 res.json(2);

                //             })
            } else if (data.type === "pass") {
                const pass = data.info
                const Salt = await bcrypt.genSalt();
                const HashedPass = await bcrypt.hash(pass, Salt);
                PASSRECOVER.findById(AccID)
                .then(isPresent=>{
                    if(isPresent){
                        res.json(4)
                    }
                    else {
                              Data.findByIdAndUpdate(AccID, {
                        Password: HashedPass
                    })
                    .then(async info => {
                        if(info) {
                            const KEY = generateKey(info.id);
                            const mailOptions = {
                            from: `mail@adnandluffy.site`,
                            to: info.Email,
                            subject: `Your AniPub Account Pass Have Been Changed`,
                            html: passwordMsge(info.Name,info.Email,KEY),
                            }
                           await PASSRECOVER.create({
                                _id:info.id,
                                KEY:KEY,
                            })
                             transporter.sendMail(mailOptions, (err, DATAINFO) => { 
                                if(err) {
                                    console.log(err)
                                }
                                 res.json(3)
                             })

                        }
                       

                    })
                    }
                })
          
            }
        })
    }
})


module.exports = Settings;