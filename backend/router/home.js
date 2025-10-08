const express = require("express");
const HomeRouter = express.Router();
const jwt = require("jsonwebtoken");
const slider = require("../models/slider.js");
const mongoose = require("mongoose");
const Data = require("../models/model");
const AnimeDB = require("../models/AniDB.js");
const JSONAUTH = process.env.jsonauth;
const validAdminReqJs = require("../middleware/validReqfAdmin.js");
HomeRouter.get("/", (req, res) => {
    res.render("index");
})

HomeRouter.get("/Home", async (req, res) => {
    const animeDb = await AnimeDB.find().sort({
        updatedAt: -1
    }).limit(20);
    let ArrayList =[];
    slider.findById(1)
    .then(async ar=>{
        const b = ar.slArray;
        b.forEach(c=>{
            ArrayList.push(c);
        })
    const DBarray = ArrayList;
    const DBAnime = await AnimeDB.find({
        _id: {
            $in: DBarray
        }
    })
    const Token = req.cookies.anipub;
    let linkI = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
    AnimeDB.find({"Status":"Ongoing"}).sort({createdAt:-1}).limit(10)
    .then(Airing=>{
    if (Token) {
        jwt.verify(Token, JSONAUTH, (err, data) => {
            if (err) {
                console.log(err);
            }

            Data.findById(`${data.id}`)
                .then((info) => {
                    let link = info.Image;
                    const Gender = info.Gender;

                    if (Gender === "Male") {
                        const finalLink = `boys/` + link;

                        res.render("Home", {
                            Anime: animeDb,
                            DBAnime,
                            Airing,
                            auth: true,
                            ID: data.id,
                            Link: finalLink
                        });

                    } else {

                        res.render("Home", {
                            Anime: animeDb,
                            Airing,
                            DBAnime,
                            auth: true,
                            ID: data.id,
                            Link: link
                        });
                    }



                })

        })
    } else {
        res.render("Home", {
            Anime: animeDb,
            DBAnime,
            Airing,
            auth: false,
            ID: "guest",
            Link: linkI
        });
    }

 })
    })
})

HomeRouter.get("/Slider/:id1/:id2/:id3/:id4",validAdminReqJs,(req,res)=>{
    const id1 = Number(req.params.id1);
     const id2 = Number(req.params.id2);
      const id3 = Number(req.params.id3);
       const id4 = Number(req.params.id4);
    slider.findOne({"_id":1})
    .then(info=>{
        if(info) {
            slider.findByIdAndUpdate(1,{
                slArray:[id1,id2,id3,id4]
            })
            .then(u=>{
                console.log("Slider Cover update");
                res.json(0);
            })
        }
        else {
              slider.create({
        _id:1,
        slArray:[id1,id2,id3,id4]
         })
          .then(u=>{
                console.log("Slider Cover update");
                res.json(0)
            })
        }
    })
     

})
module.exports = HomeRouter;
