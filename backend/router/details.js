const express = require("express");
const DetailsRouter = express.Router();
const jwt = require("jsonwebtoken");
const AnimeDB = require("../models/AniDB.js");
const Data = require("../models/model");
const JSONAUTH = process.env.jsonauth;
const {streamLimiter,infoLimiter} = require("../middleware/ratelimit.js")

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

// Fetch anime details from MAL API (for authenticated MAL users)
const MAL_FIELDS = "id,title,alternative_titles,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,status,media_type,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,studios,pictures";
async function fetchMALDetails(malId, accessToken) {
    try {
        const response = await fetch(
            `https://api.myanimelist.net/v2/anime/${malId}?fields=${MAL_FIELDS}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.log("Error fetching from MAL API:", error.message);
        return null;
    }
}

function isTokenValid(user) {
    return !!(user.accessToken && user.tokenExpiresAt && new Date() < new Date(user.tokenExpiresAt));
}

// GET /details/:id - Display anime details page
DetailsRouter.get("/details/:id", async (req, res) => {
    try {
        const anime = req.params.id;
        const token = req.cookies.anipub;
        // Fetch anime from local database
        const localAnime = await  AnimeDB.findOne({"finder":anime},{finder:1,Genres:1,MALID:1,Cover:1,ImagePath:1,Synonyms:1,Producers:1,Premiered:1,Aired:1,Duration:1,Status:1,Studios:1,Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1,epCount:{$size:"$ep"}})
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
        if(localAnime.MALID === null || localAnime.MALID === undefined  || localAnime.MALID === false || localAnime.MALID === "") {
             malId = localAnime._id;
        }
        else {
            malId = localAnime.MALID;
            console.log(malId)
        }

        // Check if user has a valid MAL access token
        let isMalUser = false;
        let malAccessToken = null;
        let user = null;
        if (userAuth && userId) {
            user = await Data.findById(userId);
            if (user && isTokenValid(user)) {
                isMalUser = true;
                malAccessToken = user.accessToken;
            }
        }

        // Fetch detailed info: prefer MAL for authenticated users, fall back to Jikan
        let jikanDetails = null;
        let malData = null;
        if (isMalUser) {
            [malData, jikanDetails] = await Promise.all([
                fetchMALDetails(malId, malAccessToken),
                fetchJikanDetails(malId)
            ]);
        } else {
            jikanDetails = await fetchJikanDetails(malId);
        }

        // Always use Jikan for characters (MAL API v2 has no character endpoint)
        const jikanCharacters = await fetchJikanCharacters(malId);

        // Combine local and external data
        const animeDetails = {
            ...localAnime.toObject(),
            jikanData: jikanDetails,
            malData: malData,
            characters: jikanCharacters
        };

        res.render("details", {
            anime: animeDetails,
            auth: userAuth,
            userId: userId,
            Link: userLink,
            isMalUser: isMalUser
        });

    } catch (error) {
        console.error("Error in /details route:", error);
        res.status(500).render("500", { message: "Internal server error" });
    }
});

// GET /api/details/:id - JSON endpoint for details data
DetailsRouter.get("/anime/api/details/:id",infoLimiter, async (req, res) => {
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
DetailsRouter.get("/v1/api/details/:id",streamLimiter, async (req, res) => {
    try {
        const animeId = req.params.id;

        const localAnime = await  AnimeDB.findOne({"_id":Number(animeId)},{Genres:0,MALID:0,Cover:0,ImagePath:0,Synonyms:0,Producers:0,Premiered:0,Aired:0,Duration:0,Status:0,Studios:0,Name:0,ImagePath:0,DescripTion:0,MALScore:0,RatingsNum:0})

        if (!localAnime) {
            return res.status(404).json({ error: "Anime not found" });
        }
        res.json({
            local: localAnime
        });

    } catch (error) {
        console.error("Error in /api/details route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


DetailsRouter.post(["/anime/api/check","/api/check"], async (req, res) => {
    try {
        const { Name, Genre } = req.body;
        if (!Name || (Genre === undefined || Genre === null)) {
            return res.status(400).json({ error: "Name and Genre are required" });
        }

        // search by name case-insensitively (exact match)
        const regex = new RegExp(`^${Name}$`, "i");
        const anime = await AnimeDB.findOne({ Name: regex });

        if (!anime) {
            return res.json({ exists: false, genreMatch: false });
        }

        // Determine if any of the provided genres match the anime's genres.
        // Accept Genre as a string or an array of strings.
        let requested = [];
        if (Array.isArray(Genre)) {
            requested = Genre.map(g => String(g).toLowerCase());
        } else {
            requested = [String(Genre).toLowerCase()];
        }

        let genreMatch = false;
        if (Array.isArray(anime.Genres)) {
            const animeGenres = anime.Genres.map(g => String(g).toLowerCase());
            genreMatch = requested.some(r => animeGenres.includes(r));
        }

        res.json({ exists: true, genreMatch });
    } catch (err) {
        console.error("Error in /api/check route:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/mal/anime/:id/score  — update MAL list status & score (requires MAL auth)
DetailsRouter.post("/api/mal/anime/:id/score", async (req, res) => {
    try {
        const token = req.cookies.anipub;
        if (!token) return res.status(401).json({ error: "Not authenticated" });

        let userId;
        try {
            const decoded = jwt.verify(token, JSONAUTH);
            userId = decoded.id;
        } catch {
            return res.status(401).json({ error: "Invalid session" });
        }

        const user = await Data.findById(userId);
        if (!user || !isTokenValid(user)) {
            return res.status(403).json({ error: "MAL account not linked or token expired" });
        }

        const malAnimeId = req.params.id;
        const { score, status } = req.body;

        const body = new URLSearchParams();
        if (score !== undefined) body.append("score", String(score));
        if (status) body.append("status", status);

        const malRes = await fetch(
            `https://api.myanimelist.net/v2/anime/${malAnimeId}/my_list_status`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: body.toString()
            }
        );

        if (!malRes.ok) {
            const errData = await malRes.json().catch(() => ({}));
            return res.status(malRes.status).json({ error: "MAL update failed", details: errData });
        }

        const result = await malRes.json();
        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Error updating MAL score:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = DetailsRouter;
