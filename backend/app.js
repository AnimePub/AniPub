const express = require("express");
const app = express();
const morgan = require("morgan");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const Data = require("./models/model");
const http = require('http').createServer(app);
const io = require('socket.io')(http);
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
const DetailsRouter = require("./router/details.js");

//AI
const cors = require('cors');
const { OpenAI } = require('openai');

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
        http.listen(port, "0.0.0.0", (error) => {
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
       console.log(error);
    })

    // for chat room 

const Room = require('./models/Room.js');
const Message = require('./models/Message.js');
const DirectMessage = require('./models/Smessage.js');
const Conversation = require('./models/Conversation.js');
const AnipubMessage = require('./models/AniPubMessege.js');

app.use(express.static(path.join(__dirname, "../style")));

app.use(express.static(path.join(__dirname, "../profilePic")));

app.use('/ProfilePic', express.static(path.join(__dirname, "../profilePic")));
app.use(express.static(path.join(__dirname, "../ratings")));
app.use(express.static(path.join(__dirname, "../Video")));
app.use(express.static(path.join(__dirname, "../Cover")));
app.use(express.static(path.join(__dirname, "../icon")));
app.use(express.static(path.join(__dirname, "../image")));
app.use(express.static(path.join(__dirname, "../image/ProfilePic")));
app.use(express.static(path.join(__dirname, "../image/ProfilePic/boys")));
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
app.use(cors());
app.use(express.json());
app.use(cookieParser())

const session = require('express-session');
const {MongoStore} = require('connect-mongo'); 
const passport = require('passport');

const User = require('./models/model');


const { Session } = require("express-session");

const { configureGoogleAuth } = require('./config/google');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'anime-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.mongoDB
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: false
  }
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

configureGoogleAuth();

//Home router
app.use(HomeRouter);
//Details router
app.use(DetailsRouter);
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
            userType: "Member",
            Image:"https://anipub.github.io/AniPub/Logo/luffy5.png"
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
                              req.session.userId = info._id;
    req.session.username = info.Name;
    req.session.avatar = info.Image;
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
    req.session.destroy();
    res.cookie("anipub", "", {
        maxAge: 1,
    })
    res.json(1);

})
//ai render 
app.get("/ai",(req,res)=>{
    res.render("ai");
})

//talk with ai ---
const anipubAI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `You are Zero Two from darling in The Franxx .. You are created by AniPub ... Don't help anything coding related ... 
Keep responses engaging, Never break character. and if asked provide info about any anime / manga / manhua / manhwa ..` ;

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await anipubAI.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.85,
      max_tokens: 600,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI is taking a nap... try again Darling 💕' });
  }
});


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
                                 
                                        res.render("AniPlayer", {
                                            AniDB: animeDb,
                                            video,
                                            AniId,
                                            AniEP,
                                            auth: true,
                                            ID: data.id,
                                            Link: link
                                        })
                                    
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
            MALID: req.body.MALID,
            DescripTion: req.body.des,
            whatType:req.body.whatType,
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
app.get("/update/picAll",validAdmin,(req,res)=>{
    Data.updateMany({},{"Image":"https://anipub.github.io/AniPub/Logo/luffy5.png"})
    .then(()=>{
        res.json("Update Done")
    })
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
    }
     else if (Type === "malid") {
        AnimeDB.findByIdAndUpdate(ID, {
                MALID: Value
            })
            .then(info => {
                if (info) {
                    res.json(1);
                } else {
                    res.json(2)
                }
            })
    } 
    else {
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
//Sitemap --- bellow it 
app.get("/getCors",validAdmin,(req,res)=>{
    const im = req.query.IM;
    fetch(im)
    .then(response=>response.json())
    .then(info=>{
        res.json(info)
    })
})
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

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/Login');
  next();
};

app.get('/chat', requireAuth, (req, res) => res.render("chat"));
app.get('/chatroom', requireAuth, (req, res) => res.render("chatroom"));
app.get('/private', requireAuth, (req, res) => res.render("Schat"));


app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId, {
  Password: 0,
  AcStats:0,
  List: 0,
  GenreList: 0,
  Address: 0,
  RelationshipStatus: 0,
  BloodGroup: 0,
  Hide: 0
});
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const { bio, theme, backgroundImage } = req.body;
    const user = await User.findById(req.session.userId);
    if (bio !== undefined) user.Bio = bio;
    if (theme !== undefined) user.theme = theme;
    if (backgroundImage !== undefined) user.backgroundImage = backgroundImage;
    await user.save();
    res.json({ success: true, user: { bio: user.Bio, theme: user.theme, backgroundImage: user.backgroundImage } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/search', requireAuth, async (req, res) => {
  try {
    const query = req.query.q || '';
    if (query.length < 2) return res.json([]);
    const users = await User.find({
      Name: { $regex: query, $options: 'i' },
      _id: { $ne: req.session.userId }
    }).select('Name Image Bio lastSeen').limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/conversations', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const conversations = await Conversation.find({ participants: userId }).sort({ lastMessageTime: -1 });
    const conversationList = await Promise.all(conversations.map(async (conv) => {
      const otherUserId = conv.participants.find(id => id.toString() !== userId.toString());
      const otherUser = await User.findById(otherUserId).select('Name Image lastSeen');
      const isPinned = conv.pinnedBy.includes(userId);
      const unreadCount = conv.unreadCount.get(userId.toString()) || 0;
      return { _id: conv._id, otherUser, lastMessage: conv.lastMessage, lastMessageTime: conv.lastMessageTime, isPinned, unreadCount };
    }));
    conversationList.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
    res.json(conversationList);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/conversations/:userId/pin', requireAuth, async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const otherUserId = req.params.userId;
    let conversation = await Conversation.findOne({ participants: { $all: [currentUserId, otherUserId] } });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    const isPinned = conversation.pinnedBy.includes(currentUserId);
    if (isPinned) {
      conversation.pinnedBy = conversation.pinnedBy.filter(id => id.toString() !== currentUserId.toString());
    } else {
      conversation.pinnedBy.push(currentUserId);
    }
    await conversation.save();
    res.json({ success: true, isPinned: !isPinned });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/rooms', validAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.length < 3) return res.status(400).json({ error: 'Room name must be 3+ characters' });
    const room = new Room({ name, description, creator: req.session.userId, creatorName: req.session.username });
    await room.save();
    res.json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/rooms', requireAuth, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/rooms/:roomId/messages', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId, deleted: false }).sort({ createdAt: 1 })
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/dm/:userId/messages', requireAuth, async (req, res) => {
  try {
    console.log(req.session.userId,req.params.userId)
    const messages = await DirectMessage.find({ participants: { $all: [req.session.userId, req.params.userId] }, deleted: false }).sort({ createdAt: 1 })
    const currentUserId = req.session.userId;
    let conversation = await Conversation.findOne({ participants: { $all: [currentUserId, req.params.userId] } });
    if (conversation) {

      conversation.unreadCount.set(currentUserId.toString(), 0);
      await conversation.save();
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:userId', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const activeUsers = new Map();
const userAnipubHistory = new Map();

io.on('connection', (socket) => {
  const session = socket.request.session;
  if (!session.userId) {
    socket.disconnect();
    return;
  }
  console.log(` User connected: ${session.username}`);

  socket.on('join room', async ({ roomId }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit('error', 'Room not found');
        return;
      }
      if (!room.members.includes(session.userId)) {
        room.members.push(session.userId);
        await room.save();
      }
      socket.join(roomId);
      activeUsers.set(socket.id, { userId: session.userId, username: session.username, avatar: session.avatar, roomId, type: 'room' });
      const onlineUsers = Array.from(activeUsers.values()).filter(u => u.roomId === roomId && u.type === 'room').map(u => ({ username: u.username, avatar: u.avatar }));
      io.to(roomId).emit('user joined', { username: session.username, avatar: session.avatar, onlineCount: onlineUsers.length });
      socket.emit('room joined', { roomId, roomName: room.name, onlineUsers });
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  socket.on('join dm', async ({ otherUserId }) => {
    try {
      const dmRoom = [session.userId, otherUserId].sort().join('-');
      socket.join(dmRoom);
      activeUsers.set(socket.id, { userId: session.userId, username: session.username, avatar: session.avatar, dmRoom, otherUserId, type: 'dm' });
      socket.emit('dm joined', { dmRoom });
    } catch (error) {
      console.error('Join DM error:', error);
    }
  });

  socket.on('chat message', async ({ roomId, message, replyTo }) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user || user.roomId !== roomId) return;

      if (message.trim().startsWith('@anipub')) {
        const userMessage = message.replace('@anipub', '').trim();
        let history = userAnipubHistory.get(session.userId) || [{ role: "assistant", content: "Hey there, Darling~ 💕 I've been waiting for you. What kind of trouble should we get into today? Hehe~" }];
        history.push({ role: "user", content: userMessage });
        
        try {
          // Emit loading message
          const loadingMessageData = {
            sender: 'SYSTEM',
            senderName: '🤖 Zero Two',
            senderAvatar: 0,
            message: '💭 Thinking...',
            createdAt: new Date(),
            _id: new mongoose.Types.ObjectId(),
            reactions: [],
            edited: false,
            deleted: false,
            isAI: true,
            isLoading: true
          };
          const tempMessageId = loadingMessageData._id.toString();
          io.to(roomId).emit('chat message', loadingMessageData);
          const response = await fetch('https://www.anipub.xyz/chat', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream'
            },
            body: JSON.stringify({ messages: history })
          });
          if (!response.ok) throw new Error('Error with Zero Two');

          // Handle streaming response
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullResponse = '';
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullResponse += parsed.content;
                    // Emit streaming update
                    console.log(tempMessageId)
                    io.to(roomId).emit('ai stream', {
                      messageId: tempMessageId,
                      content: fullResponse
                    });
                  }
                } catch (e) {
                  console.error('Parse error:', e);
                }
              }
            }
          }

          // Save to history
          history.push({ role: "assistant", content: fullResponse });
          userAnipubHistory.set(session.userId, history);

          // Send final message
          const aiMessageData = {
            sender: 'SYSTEM',
            senderName: '🤖 Anipub AI',
            senderAvatar: 0,
            message: fullResponse,
            createdAt: new Date(),
            _id: tempMessageId,
            reactions: [],
            edited: false,
            deleted: false,
            isAI: true
          };

          io.to(roomId).emit('ai complete', { messageId: tempMessageId, content: fullResponse });

          // Save to database
          const dbMessage = new Message({ room: roomId, ...aiMessageData });
          await dbMessage.save();

        } catch (aiError) {
          console.error('Anipub AI error:', aiError);
          io.to(roomId).emit('ai error', { messageId: tempMessageId });
          socket.emit('error', 'AI service unavailable');
        }
        return;
      }

      let replyData = {};
      if (replyTo) {
        const replyMsg = await Message.findById(replyTo);
        if (replyMsg) {
          replyData = { replyTo: replyMsg._id, replyToMessage: replyMsg.message, replyToSender: replyMsg.senderName };
        }
      }

      const mentions = [];
      const mentionRegex = /@(\w+)/g;
      let match;
      while ((match = mentionRegex.exec(message)) !== null) {
        mentions.push(match[1]);
      }

      const messageData = {
        sender: session.userId,
        senderName: session.username,
        senderAvatar: session.avatar,
        message: message.trim(),
        mentions,
        ...replyData,
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
        reactions: [],
        edited: false,
        deleted: false
      };

      io.to(roomId).emit('chat message', messageData);
      const dbMessage = new Message({ room: roomId, ...messageData });
      await dbMessage.save();

      if (mentions.length > 0) {
        const mentionedUsers = await User.find({ username: { $in: mentions } });
        mentionedUsers.forEach(mentionedUser => {
          const userSockets = Array.from(activeUsers.entries()).filter(([sid, u]) => u.userId.toString() === mentionedUser._id.toString()).map(([sid]) => sid);
          userSockets.forEach(sid => {
            io.to(sid).emit('mentioned', { roomId, message: messageData.message, sender: session.username });
          });
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  socket.on('dm message', async ({ otherUserId, message, replyTo }) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user || user.type !== 'dm') return;
      const dmRoom = [session.userId, otherUserId].sort().join('-');
      let replyData = {};
      if (replyTo) {
        const replyMsg = await DirectMessage.findById(replyTo);
        if (replyMsg) {
          replyData = { replyTo: replyMsg._id, replyToMessage: replyMsg.message, replyToSender: replyMsg.senderName };
        }
      }
      const messageData = {
        participants: [session.userId, otherUserId],
        sender: session.userId,
        senderName: session.username,
        senderAvatar: session.avatar,
        message: message.trim(),
        ...replyData,
        createdAt: new Date(),
        _id: new mongoose.Types.ObjectId(),
        reactions: [],
        edited: false,
        deleted: false
      };
      io.to(dmRoom).emit('dm message', messageData);
      const dbMessage = new DirectMessage(messageData);
      await dbMessage.save();
      let conversation = await Conversation.findOne({ participants: { $all: [session.userId, otherUserId] } });
      if (!conversation) {
        conversation = new Conversation({ participants: [session.userId, otherUserId], lastMessage: message.substring(0, 100), lastMessageTime: new Date() });
      } else {
        conversation.lastMessage = message.substring(0, 100);
        conversation.lastMessageTime = new Date();
      }
      const currentUnread = conversation.unreadCount.get(otherUserId.toString()) || 0;
      conversation.unreadCount.set(otherUserId.toString(), currentUnread + 1);
      await conversation.save();
    } catch (error) {
      console.error('Send DM error:', error);
    }
  });

  socket.on('edit message', async ({ messageId, newMessage, roomId, isDM }) => {
    try {
      const Model = isDM ? DirectMessage : Message;
      const msg = await Model.findById(messageId);
      if (msg && msg.sender.toString() === session.userId) {
        msg.message = newMessage;
        msg.edited = true;
        msg.editedAt = new Date();
        await msg.save();
        const target = isDM ? msg.participants.sort().join('-') : roomId;
        const event = isDM ? 'dm edited' : 'message edited';
        io.to(target).emit(event, { messageId, newMessage, edited: true, editedAt: msg.editedAt });
      }
    } catch (error) {
      console.error('Edit message error:', error);
    }
  });

  socket.on('delete message', async ({ messageId, roomId, isDM }) => {
    try {
      const Model = isDM ? DirectMessage : Message;
      const msg = await Model.findById(messageId);
      if (msg && msg.sender.toString() === session.userId) {
        msg.deleted = true;
        msg.message = 'This message was deleted';
        await msg.save();
        const target = isDM ? msg.participants.sort().join('-') : roomId;
        const event = isDM ? 'dm deleted' : 'message deleted';
        io.to(target).emit(event, { messageId });
      }
    } catch (error) {
      console.error('Delete message error:', error);
    }
  });

  socket.on('add reaction', async ({ messageId, emoji, roomId, isDM }) => {
    try {
      const Model = isDM ? DirectMessage : Message;
      const msg = await Model.findById(messageId);
      if (msg) {
        const existingReaction = msg.reactions.find(r => r.userId && r.userId.toString() === session.userId && r.emoji === emoji);
        if (!existingReaction) {
          msg.reactions.push({ emoji, userId: session.userId, username: session.username });
          await msg.save();
          const target = isDM ? msg.participants.sort().join('-') : roomId;
          const event = isDM ? 'dm reaction' : 'reaction added';
          io.to(target).emit(event, { messageId, reactions: msg.reactions });
        }
      }
    } catch (error) {
      console.error('Add reaction error:', error);
    }
  });

  socket.on('typing', ({ roomId, isDM, otherUserId }) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      if (isDM) {
        const dmRoom = [session.userId, otherUserId].sort().join('-');
        socket.to(dmRoom).emit('typing', { username: user.username });
      } else {
        socket.to(roomId).emit('typing', { username: user.username });
      }
    }
  });

  socket.on('stop typing', ({ roomId, isDM, otherUserId }) => {
    if (isDM) {
      const dmRoom = [session.userId, otherUserId].sort().join('-');
      socket.to(dmRoom).emit('stop typing');
    } else {
      socket.to(roomId).emit('stop typing');
    }
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      if (user.type === 'room') {
        socket.to(user.roomId).emit('user left', { username: user.username });
        const onlineUsers = Array.from(activeUsers.values()).filter(u => u.roomId === user.roomId && u.userId !== user.userId && u.type === 'room');
        io.to(user.roomId).emit('update online count', onlineUsers.length);
      }
      activeUsers.delete(socket.id);
      console.log(`👋 User disconnected: ${user.username}`);
    }
  });
});

// Redirect 404
app.use("*", (req, res) => {
    res.status(404).render("404")
})
