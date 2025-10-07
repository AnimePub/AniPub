const express = require("express");
const HomeRouter = express.Router();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const Data = require("../models/model");
const AnimeDB = require("../models/AniDB.js");
const JSONAUTH = process.env.jsonauth;

HomeRouter.get("/", (req, res) => {
    res.render("index");
})
HomeRouter.get("/Home", async (req, res) => {
    const animeDb = await AnimeDB.find().sort({
        updatedAt: -1
    }).limit(20);
    const DBarray = [9,10,13,6]
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

module.exports = HomeRouter;
