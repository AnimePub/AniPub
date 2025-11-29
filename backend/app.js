const express = require("express");
const app = express();
const morgan = require("morgan");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const Data = require("./models/model");
const {
    newList
} = require("./models/list");
const {
    myPlaylist
} = require("./models/list")
const validAdmin = require("./middleware/validAdmin.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    AuthAcc
} = require("./middleware/valideAcc.js");
const bcrypt = require("bcrypt");
require('dotenv').config();
const mailChanger = require("./models/VERIFY.js")
const nodemailer = require("nodemailer");
const Vcode = require("./models/auth.js")
const mailBody = require("./templates/verification.js");
const PerChase = require("./templates/perchase.js");
const OP = require("./Data/data");
const PASSRECOVER = require("./models/PassChanger.js");

//Anime DB init ..
const AnimeDB = require("./models/AniDB.js");
//premium init
const Premium = require("./models/premium.js");

// router 
const HomeRouter = require("./router/home.js");
const Settings = require("./router/pvchng.js");
const Notify = require("./router/notify.js");
const Random = require ("./router/random.js");
const AniDB = require("./models/AniDB.js");
const SearchGenre = require("./router/searchGenre.js")
const SearchQ = require("./router/query.js");
const Security = require("./router/Security.js");
const PremiumR = require("./router/premium.js");
const JSONAUTH = process.env.jsonauth;


const AUTHSMTP = process.env.auth;

const PASSWORD = process.env.pass;

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 2465,
    secure:true,
    auth: {
        user: AUTHSMTP,
        pass: PASSWORD,
    },
   
})

let accountId = "";

const DataBaseId = process.env.mongoDB || process.env.mongoToken  ;

// the token above is only for production !! 
// please if you are using your own token before push make 
// sure your env file is in gitignore - Adnan

const port = process.env.PORT || 3000;

mongoose.connect(DataBaseId)
    .then(() => {
        console.log(`Data Base Connected Successfully`);
        console.log(`
            Message from Dev:- 
            If you are a dev Please Privide Your Own SMTP credentials .. 
            check transporter and check the routers 
            `);
        console.log(`Or use smtp.gmail.com and your app password ! ~ not real password ! ThankYou`);
        app.listen(port, "0.0.0.0", (error) => {
            if (error) {
                console.log(error);
            }
            console.log(`Server Listening on Localhost:${port}`);
        });
    })
    .catch(error => {
       console.log(`If you are a dev just remove the example from example.env .
        just keep it as .env !
        .. error connecting to the database`)
       console.log("error");
    })



app.use(express.static(path.join(__dirname, "../style")));

app.use(express.static(path.join(__dirname, "../profilePic")));

app.use('/ProfilePic', express.static(path.join(__dirname, "../profilePic")));
app.use(express.static(path.join(__dirname, "../ratings")));
app.use(express.static(path.join(__dirname, "../Video")));
app.use(express.static(path.join(__dirname, "../Cover")));
app.use(express.static(path.join(__dirname, "../icon")));
app.use(express.static(path.join(__dirname, "../image")));
app.use(express.static(path.join(__dirname, "../JS")));
app.use(express.static(path.join(__dirname, "../Logo")));
app.use(express.static(path.join(__dirname, "../Poster Pic")));
app.use(express.static(path.join(__dirname, "../Styles")));
app.use(express.static(path.join(__dirname, "../google")));
app.use(express.urlencoded({
    extended: true
}));

app.set('trust proxy', true) 
app.use(morgan("common"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views-ejs"));

app.use(express.json());
app.use(cookieParser())

const session = require('express-session');
const passport = require('passport');
const { configureGoogleAuth } = require('./config/google');

app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

configureGoogleAuth();

//Home router
app.use(HomeRouter);
//Random 
app.use(Random);
// Auth router
const authRouter = require('./router/auth');
const { isNumberObject, isStringObject } = require("util/types");
app.use('/auth', authRouter);

app.get("/Sign-Up", (req, res) => {
    res.render("Sign-Up")
})
const TokenGen = (id) => {
    return jwt.sign({
        id
    }, JSONAUTH , {
        expiresIn: 60 * 24 * 60 * 3 * 60
    });
}


app.post("/Sign-Up", async (req, res) => {
    const mailChecker = (req.body.email).split("www.");
    let finalMail = "";
    if (mailChecker.length > 1) {
        finalMail = mailChecker[1];
    } else {
        finalMail = mailChecker[0];
    }
    try {
        const newacc = await Data.create({
            Name: req.body.name,
            Email: finalMail,
            Password: req.body.pass,
            AcStats: "Pending",
            userType: "Member"
        })
        const id = newacc._id;
        const aluV = await Vcode.create({
            _id: id,
            vCode: id,
        })
        const code = await aluV.id;
        const mailOptions = {
            from: `verify@anipub.xyz`,
            to: `${newacc.Email}`,
            subject: `Verify Your AniPub Account`,
            html: mailBody(newacc.Name, aluV.vCode),
        }
        transporter.sendMail(mailOptions, (err, DATAINFO) => {
            console.log(DATAINFO,err);
            res.json(['/Home'])
        })

    } catch (err) {
        console.log(err);
        const errorObj = [{
            error: err.message
        }];
        res.json(errorObj);

    }
})


//Verify Router 
app.get("/verify/:code", (req, res) => {
    const verificationCode = req.params.code;
    Vcode.findById(verificationCode)
        .then(info => {
            if (info) {
                const id = info._id;
                Data.findById(id).then(alu => {
                    if (alu.AcStats === "Pending") {
                        Data.findByIdAndUpdate(id, {
                                AcStats: "Active"
                            })
                            .then(alu => {
                                const Msge = [`Hey ${alu.Name}!`, "Your Account Have been verified , You are now Good to Go! And Login "]
                                res.render("Notify", {
                                    Msge
                                })
                            })
                    } else {
                        res.redirect("/Notify/?active=true")
                    }
                })

            } else {
                const Msge = ["This Link Won't Work ? the link only stays for 30min"]
                res.render("Notify", {
                    Msge
                })
            }
        })
        .catch(err => {
            console.log(err);
        })

})


app.post("/Login", async (req, res) => {
    const Email = req.body.email;
    const Pass = req.body.pass;
    Data.findOne({
            "Email": Email
        })
        .then(
            info => {
                if (info && info.AcStats === "Active") {
                    if (!info.Password || info.Password.length === 0 ) {
                          res.json(["Email or Pass is wrong"])
                    } 
                    else {
                    bcrypt.compare(Pass, info.Password, (err, value) => {
                        if (err) {
                            console.log(err)
                        }
                        if (value) {
                            const myCookie = TokenGen(info._id);
                            res.cookie("anipub", myCookie, {
                                httpOnly: true,
                                maxAge: 3 * 60 * 60 * 24 * 60
                            });
                            res.json(["/Home"]);
                        } else {
                            res.json(["Email or Pass is wrong"])

                        }
                    })
                }

                } 
                else if (info && info.AcStats === "Pending") {
                    res.json(`<p>This account is on Pending Stat Please Verify The Account first
                    The Link Only Stays for 30 min ! 
                    </p>`)
                } else {
                    res.json(["Could't find any account with this account"])
                }
            }
        )
})
app.get("/Login", (req, res) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , (err, data) => {
            if (err) {
                console.log(err)
            }

            if (data.id) {
                res.render("Login", {
                    Auth: true,
                    Data: data.id,
                    oauthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
                });
            }
        })
    } else {
        res.render("Login", {
            Auth: false,
            Data: "",
            oauthEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
        });
    }

})
//Logout 
app.get("/logout", (req, res) => {
    res.cookie("anipub", "", {
        maxAge: 1,
    })
    res.json(1);

})
app.get("/Profile", (req, res) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , (err, data) => {
            if (err) {
                console.log(err);
            };
            res.redirect(`/Profile/${data.id}`)
        })
    } else {
        res.redirect("/Login")
    }
})
app.get("/Profile/:id", (req, res) => {
    const profileID = req.params.id;
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , (err, data) => {
            if (err) {
                console.log(err);
            };
            Data.findById(profileID)
                .then(info => {
                    const userInfo = {
                        ID: info._id,
                        Name: info.Name,
                        Email: info.Email,
                        Bio: info.Bio,
                        BloodGroup: info.BloodGroup,
                        image: info.Image,
                        Gender: info.Gender,
                        Genre: info.GenreList,
                        Address: info.Address,
                        Relation: info.RelationshipStatus,
                        Hide : info.Hide,
                    }
                    res.render("Profile", {
                        SectionName: "Profile",
                        Auth: true,
                        userInfo,
                        alu: "p"
                    })
                })
                .catch(err => {
                    res.redirect("*")
                    // res.json("This user doesn't Exist, Why seeing this ? mail me :- abdullahal467bp@gmail.com")
                })

        })
    } else {
    
  Data.findById(profileID)
            .then(info => {
                const userInfo = {
                    ID: info._id,
                    Name: info.Name,
                     Hide : info.Hide,
                    Email: info.Email,
                    Bio: info.Bio,
                    BloodGroup: info.BloodGroup,
                    image: info.Image,
                    Gender: info.Gender,
                    Genre: info.GenreList,
                    Address: info.Address,
                    Relation: info.RelationshipStatus,
                }
                res.render("Profile", {
                    SectionName: "Profile",
                    Auth: false,
                    userInfo,
                    alu: "p"
                })
            })
            .catch(err=>{
                res.redirect("/*")
            })
    }


})
app.get("/Video/:id/:lang",(req,res)=>{
    const id = req.params.id;
    const lang = req.params.lang;
    if(id && lang) {
        if(!isNaN(id)) {
            const sID = Number(id);
           let sLang = "sub";
           if(lang.toLowerCase() === "dub") {
            sLang = "dub"
           }
           else {
            sLang = "sub"
           } 
              const alu = `${process.env.VIDEOAPI}/${sID}/${sLang}`;
              res.render("videoPlayer.ejs",{alu});
        }
        else {
              res.redirect("/*")
        }
    }
    else {
        res.redirect("/*")
    }
  
})

app.get(`/AniPlayer/:AniId/:AniEP`, async (req, res) => {
    const Token = req.cookies.anipub;  
    const AniId = req.params.AniId;
    const AniEP = req.params.AniEP; 
    let linkI = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
    let video = "";
    if(!isNaN(AniId) && !isNaN(AniEP)) {
         AniDB.findById(Number(AniId))
        .then( ANIMEIN=>{
            if (ANIMEIN === null) {
                  res.redirect("/*")
            }
            else if(ANIMEIN.length === 0 ) {
                 res.redirect("/*")
            }
            else if (ANIMEIN.ep.length >=  Number(req.params.AniEP)) {
         AnimeDB.findById(Number(AniId))
         .then(video=>{     
            AnimeDB.find({"Genres":{$in:video.Genres}},{Name:1,ImagePath:1,DescripTion:1,_id:1,MALScore:1,RatingsNum:1}).sort({createdAt:-1}).limit(10)
            .then(animeDb=>{
           
                if (Token) {
            jwt.verify(Token,JSONAUTH ,async (err, data) => {
                if (err) {
                    console.log(err)
                }

              Data.findById(`${data.id}`)
                                .then(async info => {
                                   
                                    let link = info.Image;
                                    const Gender = info.Gender;
                                  if (Gender === "Male") {
                                        const finalLink = `boys/` + link;
                                        res.render("AniPlayer", {
                                            AniDB: animeDb,
                                            video,
                                            AniId,
                                            AniEP,
                                            auth: true,
                                            ID: data.id,
                                            Link: finalLink
                                        });
                                    } else {
                                        res.render("AniPlayer", {
                                            AniDB: animeDb,
                                            video,
                                            AniId,
                                            AniEP,
                                            auth: true,
                                            ID: data.id,
                                            Link: link
                                        })
                                    }
                                })

                        })
                    } else {
                        res.render("AniPlayer", {
                            AniDB: animeDb,
                            video,
                            AniId,
                            AniEP,
                            auth: false,
                            ID: "guest",
                            Link: linkI
                        })
                    }
}) 
 })
                } else {
                    res.redirect("/*")
                }


            })
    }
    else {
        res.redirect("/*")
    }
});
app.get("/PlayList", AuthAcc, (req, res) => {
    const Token = req.cookies.anipub;
    const PlayListID = req.params.id;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                console.log(err)
            }
            res.redirect(`/PlayList/${data.id}`)
        })
    }
    else {
        res.redirect("/Login")
    }
})

app.get("/PlayList/:id", (req, res) => {
    const Token = req.cookies.anipub;
    const PlayListID = req.params.id;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                console.log(err)
            }

            const accountID = data.id;

            if (accountID === PlayListID) {
                let Aarray ;
               await newList.find({"Owner":accountID})
                .then(re=>{
                    Aarray = re;
                })
                Data.findById(accountID)
                    .then(async (info) => {
                        const DBarray = [];
                        Aarray.forEach(value => {
                            DBarray.push(value.AniID)
                        })
                        let link = info.Image;
                        let finalLink;
                        if (info.Gender === "Male") {
                            finalLink = `boys/` + link;
                        } else {
                            finalLink = link;
                        }
                        const DBAnime = await AnimeDB.find({
                            _id: {
                                $in: DBarray
                            }
                        })
                        res.render("PlayList", {
                            SectionName: "PlayList Section",
                            AniDB: DBAnime,
                            AniArray:Aarray,
                            Auth: true,
                            ID: accountID,
                            Link: finalLink,
                            alu: "pl"
                        });
                    })
            } else {
                res.redirect(`/PlayList/${Token}`)
            }

        })


    } else {
        res.redirect("/Login")
    }

    // .then(info=> {
    //     res.render("PlayList",{SectionName:"PlayList Section",List: info,AniDB:OP,Auth:false});
    // })

})
app.post("/WatchList/Updater", (req, res) => {
    const Token = req.cookies.anipub;

     if (Token) {
        jwt.verify(Token,JSONAUTH , async (err, data) => {
            if(err){
                console.log(err)
            }
            // console.log(req.body)req.body.EpisodeID
            newList.find({
                    "Owner": data.id,
                    "AniID": req.body.AnimeID
                })
                .then(info => {
                    if (info.length === 0) {
                        console.log("Watched")
                    } else {
                        console.log(info[0].AniEP, req.body.AnimeID)
                        if (Number(info[0].AniEP) < Number(req.body.AnimeID)) {
                            newList.findOneAndUpdate({
                                    "Owner": data.id,
                                    "AniID": req.body.AnimeID
                                }, {
                                    $set: {
                                        "Progress": req.body.EpisodeID
                                    }
                                })
                                .then(() => {
                                    res.json(["Watchlist Updated"])
                                })
                        } else {
                            res.json(["Watched"])
                        }

                    }
                })

        })
    }

})
app.post('/PlayList/Update',async (req, res) => {
    const Token = req.cookies.anipub;

    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                console.log(err)
            }
            newList.find({
                    "Owner": data.id,
                    "AniID": req.body.AniID
                })
                .then(async already => {
                    if (already.length === 0) {
                        const ListID = await newList.create({
                            AniID: req.body.AniID,
                            AniEP: req.body.EpID,
                            Date: Date(),
                            Owner: data.id,
                            Progress: req.body.EpID,
                        })
                        .then(info => {
                                res.json(["PlayList Updated"])
                            })


                    } else {
                        res.json(["Already"])
                        console.log(already)
                    }
                })

        })



    } else {
        res.json(["/Login"])
    }

})




app.delete('/PlayList/Delete/:DeleteID', (req, res) => {
    const Token = req.cookies.anipub;
    const postId = req.params.DeleteID;
    if (Token) {
        jwt.verify(Token, JSONAUTH , (err, data) => {
            if (err) {
                console.log(err)
            }
            newList.findById(postId)
                .then(info => {
                    const POSTID = info.id;
                    if (info.Owner === data.id) {
                        newList.findByIdAndDelete(req.params.DeleteID)
                            .then(info => {
                                if (info) {
                                    res.json(["Delete Done"])
                                } else {
                                    res.json(["Can't find the list"])
                                }
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    } else {
                        res.redirect("*")
                    }
                })
        })
    }

})


//Settings 

app.get("/Settings", (req, res) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                res.redirect("/Login");
            }
            const userInfo = {
                ID: data.id
            }
            const userDATA = await Data.findById(data.id)
             const userData = {
                    id: userDATA._id,
                        Name: userDATA.Name,
                        Email: userDATA.Email,
                        Bio: userDATA.Bio,
                        BloodGroup: userDATA.BloodGroup,
                        Image: userDATA.Image,
                        Gender: userDATA.Gender,
                        GenreList: userDATA.GenreList,
                        Address: userDATA.Address,
                        RelationshipStatus: userDATA.RelationshipStatus,
                        Hide : userDATA.Hide,
                        userType : userDATA.userType,
               
            } 
            res.render("Settings", {
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
//security
app.use(Security)

//Router
app.use(Settings);

app.post("/Settings/ad-st", async (req, res) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                res.status(501).send("You are not Authorized"); // will be focused on letter
            }
            const rlst = req.body.finalAdSt[0].Relation;
            const addr = req.body.finalAdSt[1].address;
            const bld = req.body.finalAdSt[2].bloodGroup;
            const genre = req.body.finalAdSt[3].Genre;
            console.log(genre)
            await Data.findByIdAndUpdate(data.id, {
                RelationshipStatus: rlst
            });
            await Data.findByIdAndUpdate(data.id, {
                Address: addr
            });
            await Data.findByIdAndUpdate(data.id, {
                BloodGroup: bld
            });
            await Data.findByIdAndUpdate(data.id, {
                GenreList: genre
            });

            res.json(["/Info Saved"]);
        })
    } else {
        res.json(["/Login"])
    }



})
// { image: [], Gender: false, bio: ' Bio  ' }

app.post("/settings/account-info", (req, res) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                res.json(["You are not Authorized"]);
            }
            let image = req.body.image[0];
            if (image === undefined) {
                image = "/Shinbou.jpg"
            }
            let gender = req.body.Gender;

            if (gender) {
                gender = "Female"
            } else {
                gender = "Male"
            }
            const bio = req.body.bio;

            await Data.findByIdAndUpdate(data.id, {
                Bio: bio
            });
            await Data.findByIdAndUpdate(data.id, {
                Gender: gender
            });
            await Data.findByIdAndUpdate(data.id, {
                Image: image
            });
            res.json(["/Info Saved"]);
        })
    } else {
        res.json(['/Login']);

    }


})
// Notify
app.use(Notify)

//Update --- false auth to cheking
app.get("/About-Us", (req, res) => {
    res.render("About-Us");

})

app.get("/Privacy-Policy", (req, res) => {
  
        res.render("Privacy-Policy", {
            Auth: false,
            alu: "pr"
        });

});

app.get("/Terms", (req, res) => {
        res.render("terms", {
            Auth: false,
            alu: "tr"
        });

});

//Search By Genre
app.use(SearchGenre);
//search By Query
app.use(SearchQ);
app.get("/Uploader", validAdmin, (req, res) => {
    res.render("Uploader", {
        SectionName: "Uploader Section"
    });
});

//Upload
app.post("/Upload", validAdmin, async (req, res) => {
    try {
        const Update = await AnimeDB.create({
            name: req.body.epName,
            _id: Number(req.body.id),
            Name: req.body.Name,
            ImagePath: req.body.ip,
            Cover: req.body.cover,
            Synonyms: req.body.syn,
            link: req.body.link,
            Aired: req.body.aired,
            Premiered: req.body.premiered,
            Duration: req.body.duration,
            Status : req.body.Status,
            MALScore: req.body.malscore,
            RatingsNum: Number(req.body.ratings),
            Genres: req.body.genre,
            Studios: req.body.studios,
            Producers: req.body.producers,
            DescripTion: req.body.des,
            type: req.body.type,
        })
        if (Update) {
            res.json(1)
        }
    } catch (err) {
        res.json(2)
        console.log(err);
    }
})

app.post("/update/info", validAdmin, (req, res) => {
    AnimeDB.findById(Number(req.body.id))
        .then(info => {
            if (info) {
                AnimeDB.findByIdAndUpdate(Number(req.body.id), {
                        $push: {
                            ep: {
                                name: req.body.epName,
                                link: req.body.link,
                            }
                        }
                    })
                    .then(Info => {
                        if (Info) {
                            console.log("DB updated");
                            res.json(1);
                        } else {
                            console.log("There was a error while updating DB")
                            res.json(2);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                console.log("Couldn't Find The Account")
                res.json(2);
            }
        })
})

app.post("/update/ext", validAdmin, async (req, res) => {
    // { ID: '3', EP: '1', TYPE: 'link', Value: 'alu.com' }
    const Type = req.body.TYPE;
    const EP = Number(req.body.EP);
    const ID = Number(req.body.ID);
    const Value = req.body.Value;
    if (Type === "link") {
        if (EP === 0) {
            AnimeDB.findByIdAndUpdate(ID, {
                    $set: {
                        link: Value
                    }
                })
                .then(info => {
                    if (info) {
                        res.json(1);
                    } else {
                        res.json(2)
                    }
                })
        } else {
            const epNum = EP - 1;
            const update = {
                [`ep.${epNum}.link`]: Value
            }
            //dynamic update 
            AnimeDB.findByIdAndUpdate(ID, {
                    $set: update
                })
                .then(info => {
                    if (info) {
                        res.json(1);
                    } else {
                        res.json(2)
                    }
                })
        }
    } else if (Type === "name") {
        if (EP === 0) {
            AnimeDB.findByIdAndUpdate(ID, {
                    name: Value
                })
                .then(info => {
                    if (info) {
                        res.json(1);
                    } else {
                        res.json(2)
                    }
                })
        } else {
            const epNum = EP - 1;
            const update = {
                [`ep.${epNum}.name`]: Value
            }
            AnimeDB.findByIdAndUpdate(ID, {
                    $set: update
                })
                .then(info => {
                    if (info) {
                        res.json(1);
                    } else {
                        res.json(2)
                    }
                })

        }
    } else if (Type === "image") {
        AnimeDB.findByIdAndUpdate(ID, {
                ImagePath: Value
            })
            .then(info => {
                if (info) {
                    res.json(1);
                } else {
                    res.json(2)
                }
            })
    } else if (Type === "cover") {
        AnimeDB.findByIdAndUpdate(ID, {
                Cover: Value
            })
            .then(info => {
                if (info) {
                    res.json(1);
                } else {
                    res.json(2)
                }
            })
    } else {
        res.json(2);
    }

})

app.post("/Bulk/Add", validAdmin, async (req, res) => {
    const ID = req.body.ID;
    const ARY = req.body.ARY;
    const Yo = await AnimeDB.bulkWrite([{
        updateOne: {
            filter: {
                "_id": Number(ID)
            },
            update: {
                $push: {
                    ep: {
                        $each: ARY
                    }
                }
            }
        }
    }])
    if (Yo) {
        res.json(1)
    } else {
        res.json(2)
    }

})
app.post("/Bulk/Edit", validAdmin, async (req, res) => {
    const ID = req.body.ID;
    const start = Number(req.body.start);
    const end = Number(req.body.end);
    const lang = req.body.lang;
    const min = end - start;
    let ARY = {};
    for (let i = 0; i <= min; i++) {
        ARY[`ep.${start+i}.link`] = `https://www.anipub.xyz/Video/${start+i}/${lang}`
    }
    const Yo = await AnimeDB.updateOne({"_id":Number(ID)},{
        $set:ARY
    })
    if (Yo) {
        ARY = {}
        res.json(1)
    } else {
          ARY = {}
        res.json(2)
    }

})
app.post("/Status-Change",validAdmin , (req,res)=>{
    AnimeDB.findById(req.body.id)
    .then(info=>{
        if(info){
            if(Number(req.body.value) === 2) {
                AnimeDB.findByIdAndUpdate(req.body.id,{
                    "Status":"Finished"
                })
                .then(()=>{
                    res.json(0)
                })
            }
            else if (Number(req.body.value) === 1){
                AnimeDB.findByIdAndUpdate(req.body.id,{
                    "Status":"Ongoing"
                })
                .then(()=>{
                    res.json(0)
                })
            }
        }
        else {
            res.json(1);
        }
    })
})
app.get("/verify-email-change/:id/:code", (req, res) => {
    const ID = req.params.id;
    const code = req.params.code;
    mailChanger.findById(ID)
        .then(info => {
            if (info && info.CODEV === code) {
                Data.findByIdAndUpdate(ID, {
                        "AcStats": "Active"
                    })
                    .then(ishq => {
                        if (ishq) {
                            Data.findByIdAndUpdate(ID, {
                                    "Email": info.newmail,
                                    "googleId":"",
                                })
                                .then(hein => {
                                    console.log("Email Changed")
                                    res.json("Bruh Account Got Verified now go to login page ! hehe")
                                })
                        }
                    })
            } else {
                res.redirect("*")
            }
        })
})
//Sitemap
app.get("/sitemaps",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../sitemaps/sitemap.xml"))
    AnimeDB.find()
    .then(async info=>{
        const i =  info.length;
         res.contentType(".xml")
         res.render("sitemap",{i})
        })
    })

app.get("/sitemap.xml",(req,res)=>{
    // res.sendFile(path.join(__dirname,"../sitemaps/sitemap.xml"))
    AnimeDB.find()
    .then(async info=>{
        const i =  info.length;
         res.contentType(".xml")
         res.render("sitemap",{i})
        })
    })      
app.get("/robots.txt",(req,res)=>{
     res.sendFile(path.join(__dirname,"../sitemaps/robots.txt"))
})
app.get("/premium",(req,res)=>{
    res.render("premium",{
          Auth: false,
            alu: "tr"
    })
})

app.post("/premium",(req,res)=>{
    const number = req.body.Number ;
    const trxID = req.body.ID;
     const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if(err) {
                
                console.log(err)
                res.json(0)
            }
            else {
    if(number.length === 10 && data) {
        let codes = [];
        for (let i = 0; i <= 3; i++) {
            codes.push(Math.floor(Math.random()*10000))            
        }
        const BODY = {_id:data.id,codes,number,trxID}
        Data.findById(data.id)
        .then(async INFO=>{
            const EMAIL = INFO.Email;
            const Name = INFO.Name;
             
          const findPr = await Premium.findOne({"_id":data.id})
          if(findPr) {
            res.json(0)
          }
          else {
 Premium.create(BODY)
                .then(()=>{
                      const mailOptions = {
                            from: `anipub@anipub.xyz`,
                            to: EMAIL,
                            subject: `-- AniPub Premium --`,
                            html: PerChase(Name,BODY),
                        }
                        transporter.sendMail(mailOptions, (err, DATAINFO) => {
                            if (err) {
                                console.log(err)
                                 res.json(0);
                            }
                                res.json(2)
                        })
                })
          }
               
                        
        
        })
    }
    else {
        res.json(0)
    }

}
})
    }
    else {
        res.json(1)
    }
})
//pr admin
app.use(PremiumR)
app.get("/password/change/",(req,res)=>{
    const key = req.query.key; 
    if(key) {
        jwt.verify(key,"This is pass",(err,data)=>{
            if(err) {
                res.redirect("/*")
            }
            const alu = data.key;
            console.log(alu)
            PASSRECOVER.findOne({"_id":alu})
            .then(info=>{
                if(info) {
                    if(info.KEY === key) {
                          Data.findByIdAndUpdate(alu,{"AcStats":"Pending"})
                    .then(a=>{
                                             res.cookie("anipub", "", {
        maxAge: 1,
    })
    res.json("ID Blocked")
                    })
                    }
                    else {
                       res.json("Key MissMatch") ;
                    }
                  
                }
                else {
                    res.json("Invalid Req");
                }
            })
        })
    }
    else {
        res.json("Invalid Key");
    }
})

// Redirect 404
app.use("*", (req, res) => {
    res.status(404).render("404")
})
