const express = require("express");
const DetailsRouter = express.Router();
const jwt = require("jsonwebtoken");
const AnimeDB = require("../models/AniDB.js");
const Data = require("../models/model");
const JSONAUTH = process.env.jsonauth;

// Fetch anime details from Jikan API
async function fetchJikanDetails(malId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.log("Error fetching from Jikan API:", error.message);
        return null;
    }
}

// Fetch characters from Jikan API
async function fetchJikanCharacters(malId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/characters`);
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return data.data.slice(0, 10); // Get top 10 characters
    } catch (error) {
        console.log("Error fetching characters:", error.message);
        return [];
    }
}

// GET /details/:id - Display anime details page
DetailsRouter.get("/details/:id", async (req, res) => {
    try {
        const animeId = req.params.id;
        const token = req.cookies.anipub;

        // Fetch anime from local database
        const localAnime = await  AnimeDB.findOne({"_id":Number(animeId)},{Genres:1,MALID:1,Cover:1,ImagePath:1,Synonyms:1,Producers:1,Premiered:1,Aired:1,Duration:1,Status:1,Studios:1,Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1,epCount:{$size:"$ep"}})
        if (!localAnime) {
            return res.status(404).render("404", { message: "Anime not found" });
        }

        // Check if user is authenticated
        let userAuth = false;
        let userId = null;
        let userLink = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;

        if (token) {
            try {
                const decoded = jwt.verify(token, JSONAUTH);
                userAuth = true;
                userId = decoded.id;
                const user = await Data.findById(userId);
                if (user) {
                    userLink = user.Gender === "Male" ? `boys/${user.Image}` : user.Image;
                }
            } catch (error) {
                console.log("Token verification error:", error.message);
            }
        }

        let malId = "" ;
        // Extract MAL ID from local anime data (if available)
        // Assuming the _id field is the MAL ID or we can store it separately
        if(localAnime.MALID === null || localAnime.MALID === undefined  || localAnime.MALID === false || localAnime.MALID === "") {
             malId = localAnime._id;
        }
        else {
           
            malId = localAnime.MALID;
             
            console.log(malId)  
        }
       

        // Fetch detailed info from Jikan API in parallel
        const [jikanDetails, jikanCharacters] = await Promise.all([
            fetchJikanDetails(malId),
            fetchJikanCharacters(malId)
        ]);

        // Combine local and external data
        const animeDetails = {
            ...localAnime.toObject(),
            jikanData: jikanDetails,
            characters: jikanCharacters
        };

        res.render("details", {
            anime: animeDetails,
            auth: userAuth,
            userId: userId,
            Link: userLink
        });

    } catch (error) {
        console.error("Error in /details route:", error);
        res.status(500).render("500", { message: "Internal server error" });
    }
});

// GET /api/details/:id - JSON endpoint for details data
DetailsRouter.get("/anime/api/details/:id", async (req, res) => {
    try {
        const animeId = req.params.id;

        const localAnime = await  AnimeDB.findOne({"_id":Number(animeId)},{Genres:1,MALID:1,Cover:1,ImagePath:1,Synonyms:1,Producers:1,Premiered:1,Aired:1,Duration:1,Status:1,Studios:1,Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1,epCount:{$size:"$ep"}})

        if (!localAnime) {
            return res.status(404).json({ error: "Anime not found" });
        }

        const malId = localAnime._id;
        const [jikanDetails, jikanCharacters] = await Promise.all([
            fetchJikanDetails(malId),
            fetchJikanCharacters(malId)
        ]);

        res.json({
            local: localAnime,
            jikan: jikanDetails,
            characters: jikanCharacters
        });

    } catch (error) {
        console.error("Error in /api/details route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = DetailsRouter;
