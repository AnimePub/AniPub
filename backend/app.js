const express = require("express");
const app = express();
const morgan = require("morgan");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const Data = require("./models/model");
const {newList} = require("./models/list");
const {myPlaylist} = require("./models/list")
const validAdmin = require("./middleware/validAdmin.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {AuthAcc} = require("./middleware/valideAcc.js");
const bcrypt = require("bcrypt");
require('dotenv').config();
const mailChanger = require("./models/VERIFY.js")
const nodemailer = require("nodemailer");
const Vcode = require("./models/auth.js")
const mailBody = require("./templates/verification.js") ;

const OP = require("./Data/data");

//Anime DB init ..
const AnimeDB = require("./models/AniDB.js");

//using router makes it more easy to manage the code
const HomeRouter = require("./router/home.js");
const Settings = require("./router/pvchng.js");
const Notify = require("./router/notify.js");



const AUTHSMTP = process.env.auth ; 

const PASSWORD = process.env.pass  ;
const transporter = nodemailer.createTransport({
    host:'smtp.zoho.com',
    port:465,
    secure:true,
    auth:{
        user:AUTHSMTP,
        pass:PASSWORD,
    }
})

let accountId = "";

const MONGO_String = 'mongodb+srv://NodeDB:asdf1234@cluster0.cbnst.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';// your string here
const DataBaseId = process.env.mongoDB || process.env.mongoToken || MONGO_String;

// the token above is only for production !! 
// please if you are using your own token before push make 
// sure your env file is in gitignore - AdnanDLuffy


const port = process.env.PORT ||3000;

mongoose.connect(DataBaseId)
.then(()=>{
    console.log(`Data Base Connected Successfully`);
    app.listen(port,"0.0.0.0",(error)=>{
        if (error) {
            console.log(error);
        }
        console.log(`Server Listening on Localhost:${port}`);
    });
})
.catch(error=>{
    console.log(error);
})



app.use(express.static(path.join(__dirname,"../style")));

app.use(express.static(path.join(__dirname,"../profilePic")));
app.use(express.static(path.join(__dirname,"../ratings")));
app.use(express.static(path.join(__dirname,"../Video")));
app.use(express.static(path.join(__dirname,"../Cover")));
app.use(express.static(path.join(__dirname,"../icon")));
app.use(express.static(path.join(__dirname,"../image")));
app.use(express.static(path.join(__dirname,"../JS")));
app.use(express.static(path.join(__dirname,"../Logo")));
app.use(express.static(path.join(__dirname,"../Poster Pic")));
app.use(express.static(path.join(__dirname,"../Styles")));
app.use(express.static(path.join(__dirname,"../google")));
app.use(express.urlencoded({extended:true}));


app.use(morgan("common")); 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"../views-ejs"));

app.use(express.json());
app.use(cookieParser())

//Home router
app.use(HomeRouter);


app.get("/Sign-Up",(req,res)=>{
    res.render("Sign-Up")
})

// cookie

const TokenGen = (id) =>{
   return jwt.sign({id},"I Am Naruto",{expiresIn:60*24*60*3*60});
}


app.post("/Sign-Up",async (req,res)=>{
      const mailChecker = (req.body.email).split("www.");
      let finalMail = "";
      if(mailChecker.length > 1) {
        finalMail = mailChecker[1];
      }
      else {
        finalMail = mailChecker[0];
      }
    try {
        const newacc = await Data.create({
        Name:req.body.name,
        Email : finalMail,
        Password : req.body.pass,
        AcStats:"Pending",
        userType:"Member"
    })
    const id = newacc._id;
    const aluV = await Vcode.create({
        _id:id,    
        vCode: id,
        })
    const code = await aluV.id;
     const mailOptions = {
            from:`mail@adnandluffy.site`,
            to :`${newacc.Email}`,
            subject:`Verify Your AniPub Account`,
            html:mailBody(newacc.Name,aluV.vCode),
        }
    transporter.sendMail(mailOptions,(err,DATAINFO)=>{
        res.json(['/Home'])
    })   
    
    } catch (err) {
    console.log(err);
     const errorObj = [{error:err.message}];   
     res.json(errorObj);
     
    }
})


//Verify Router 
app.get("/verify/:code",(req,res)=>{
    const verificationCode = req.params.code;
    Vcode.findById(verificationCode)
    .then(info=>{
        if(info) {
            const id = info._id;
            Data.findById(id).then(alu=>{
                if(alu.AcStats === "Pending") {
                            Data.findByIdAndUpdate(id,{AcStats:"Active"})
                    .then(alu=>{
                    const Msge = [`Hey ${alu.Name}!`
                        ,"Your Account Have been verified , You are now Good to Go! And Login "]
                    res.render("Notify",{Msge})  })
                }
                else {
                    res.redirect("/Notify/?active=true")
                }
            })

            
         
        
            
        }
        else {
            const Msge = ["This Link Won't Work ? the link only stays for 30min"]
                    res.render("Notify",{Msge})
        }
    })
    .catch(err=>{
        console.log(err);
    })

})


app.post("/Login",async(req,res)=>{
    const Email = req.body.email;
    const Pass = req.body.pass;
    Data.findOne({"Email":Email})
    .then(
        info =>{
            if(info && info.AcStats === "Active") {
                bcrypt.compare(Pass,info.Password,(err,value)=>{
                    if(err) {
                        console.log(err)
                    }
                    if(value) {
                        const myCookie = TokenGen(info._id);
                        res.cookie("anipub",myCookie,{httpOnly:true,maxAge:3*60*60*24*60});
                        res.json(["/Home"]);
                       }
                       else {
                        res.json(["Email or Pass is wrong"])
                 
                       }
                   })
                  
            }
            else if (info.AcStats === "Pending") {
                res.json(`<p>This account is on Pending Stat Please Verify The Account first
                    The Link Only Stays for 30 min ! 
                    </p>`)
            }
            else {
                res.json(["Could't find any account with this account"])
            }
        }
    )
})
app.get("/Login",(req,res)=>{
    const Token = req.cookies.anipub;
    if(Token) {
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err) {
                console.log(err) 
            }
            
            if(data.id) {
                 res.render("Login",{Auth:true,Data:data.id});
            }
        })
    }
    else {
           res.render("Login",{Auth:false,Data:""});
    }
 
})
//Logout 
app.get("/logout",(req,res)=>{
    res.cookie("anipub","",{maxAge:1,})
    res.json(1);

})
app.get("/Profile",(req,res)=>{
     const Token = req.cookies.anipub;
      if(Token){
       jwt.verify(Token,"I Am Naruto",(err,data)=>{
           if(err) {
               console.log(err);
           }; 
           res.redirect(`/Profile/${data.id}`)
        })
}
    else {
        res.redirect("/Login")
    }
})
app.get("/Profile/:id",(req,res)=>{
   const profileID = req.params.id;
   const Token = req.cookies.anipub;
   if(Token){
       jwt.verify(Token,"I Am Naruto",(err,data)=>{
           if(err) {
               console.log(err);
           };
            Data.findById(profileID)
            .then(info=>{
                 const userInfo = {
                     ID : info._id,
                     Name : info.Name,
                     Email :info.Email,
                     Bio : info.Bio,
                     BloodGroup: info.BloodGroup,
                     image : info.Image,
                     Gender: info.Gender,
                     Genre: info.GenreList,
                     Address : info.Address,
                     Relation : info.RelationshipStatus,
                 }
                 res.render("Profile",{SectionName:"Profile",Auth:true,userInfo,alu:"p"})
            })
            .catch(err=>{
                res.json("This user doesn't Exist, Why seeing this ? mail me :- abdullahal467bp@gmail.com")
            })     
          
       })
   }else {
     Data.findById(profileID)
            .then(info=>{
                 const userInfo = {
                     ID : info._id,
                     Name : info.Name,
                     Email :info.Email,
                     Bio : info.Bio,
                     BloodGroup: info.BloodGroup,
                     image : info.Image,
                     Gender: info.Gender,
                     Genre: info.GenreList,
                     Address : info.Address,
                     Relation : info.RelationshipStatus,
                 }
                 res.render("Profile",{SectionName:"Profile",Auth:false,userInfo,alu:"p"})
            })
   }

 
})


app.get(`/AniPlayer/:AniId/:AniEP`,async(req,res)=>{
    const Token = req.cookies.anipub;
     const Array = req.url;
     const animeDb = await AnimeDB.find().sort({createdAt:-1}).limit(20)
   const video = await AnimeDB.findById(Number(req.params.AniId))

     const newArray = Array.split("/")
    const AniId = Number(newArray[2]) -1 ;
    const AniEP = Number(newArray[3]);
  let linkI  = `/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;
if(Number(req.params.AniId)===NaN || Number(req.params.AniEP)===NaN) {
    res.send("Hello")
}else {


    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err){
                console.log(err)
            }

            Data.findById(`${data.id}`)
            .then(info=>{
                let link = info.Image;
                const Gender = info.Gender;
                if (Gender === "Male") {
                    const finalLink = `boys/`+ link;
                res.render("AniPlayer",{AniDB :animeDb,video,AniId,AniEP,auth:true,ID:data.id, Link:finalLink});
                }
                else {
                       res.render("AniPlayer",{AniDB : animeDb,video,AniId,AniEP,auth:true,ID:data.id,Link:link})
                }
            })
           
        })
    }
    else {
        
        res.render("AniPlayer",{AniDB : animeDb,video,AniId,AniEP,auth:false,ID:"guest",Link:linkI})
    }  
   }
});
app.get("/PlayList",AuthAcc,(req,res)=>{
     const Token = req.cookies.anipub;
    const PlayListID = req.params.id;
    if(Token) {
        jwt.verify(Token,"I Am Naruto", async (err,data)=>{
            if(err) {
                console.log(err)
            }
            res.redirect(`/PlayList/${data.id}`)
        })
    }
})

app.get("/PlayList/:id",(req,res)=>{
    const Token = req.cookies.anipub;
    const PlayListID = req.params.id;
    if(Token) {
        jwt.verify(Token,"I Am Naruto", async (err,data)=>{
            if(err) {
                console.log(err)
            }
            
            const accountID = data.id;

            if(accountID === PlayListID) {
            Data.findById(accountID)
            .then( async (info)=>{
                const PlayList = info.List;
                let PlayListArray = [];
                PlayList.forEach(value=>{
                    PlayListArray.push(value.id);
                })
               const PlayListDB = await newList.find({_id:{$in:PlayListArray}})
              const DBarray = [];
              PlayListDB.forEach(value=>{
                DBarray.push(value.AniID)
              })
              const DBAnime = await AnimeDB.find({_id:{$in:DBarray}})
              console.log(DBAnime)
               res.render("PlayList",{SectionName:"PlayList Section",List: PlayListDB ,AniDB:DBAnime,Auth:false,ID:accountID});
            })
        }
        else {
            res.redirect(`/PlayList/${Token}`)
        }
            
         })


    }
    else {
        res.redirect("/Login")
    }

    // .then(info=> {
    //     res.render("PlayList",{SectionName:"PlayList Section",List: info,AniDB:OP,Auth:false});
    // })
    
})

app.post('/PlayList/Update',async (req,res)=>{
    const Token = req.cookies.anipub;

    if(Token) {
         jwt.verify(Token,"I Am Naruto", async (err,data)=>{
             if(err){
                 console.log(err)
             }    
                     const ListID  = await newList.create({
                     AniID : req.body.AniID,
                     AniEP : req.body.EpID,
                     Date: Date(),
                     Owner:data.id,
                     })
                      Data.findByIdAndUpdate(data.id,{$push:{List:{"id":ListID._id}}})
                     .then(info=>{
                         res.json(["PlayList Updated"])
                     })
         })
        
    
   
 }
 else {
             res.json(["/Login"])
         }

})




app.delete('/PlayList/Delete/:DeleteID',(req,res)=>{ 
   const Token = req.cookies.anipub;
   const postId = req.params.DeleteID;
   if (Token) {
    jwt.verify(Token,"I Am Naruto",(err,data)=>{
        if(err) {
            console.log(err)
        }
        newList.findById(postId)
        .then(info =>{
            const POSTID = info._id;
            if(info.Owner === data.id) {
                newList.findByIdAndDelete(req.params.DeleteID)
                    .then (info=> {
                        if(info) {
                            Data.findByIdAndUpdate(data.id,{$pull:{List:{id:POSTID}}}); // pulling info
                            res.json(["Delete Done"])
                        }
                        else {
                            res.json(["Can't find the list"])
                        }
                    })
                    .catch(error=>{
                        console.log(error)
                    })
            }
            else {
                res.json(["You are not Owner of this post !"])
            }
        })
    })
   }
     
})


//Settings 

app.get("/Settings",(req,res)=>{
    const Token = req.cookies.anipub;
    if(Token) {
        jwt.verify(Token,"I Am Naruto",async(err,data)=>{
            if(err) {
                res.redirect("/Login");
            }
            const userInfo = {ID:data.id}
            const userData = await Data.findById(data.id)
             res.render("Settings",{Auth:true,userInfo,alu:"s",userData});
        })
    }
    else {
        res.redirect("/Login")
    }
})

//Router
app.use(Settings);

app.post("/Settings/ad-st",async (req,res)=>{
     const Token = req.cookies.anipub;
     if(Token) {
         jwt.verify(Token,"I Am Naruto",async(err,data)=>{
             if(err) {
                 res.status(501).send("You are not Authorized"); // will be focused on letter
             }
            const rlst = req.body.finalAdSt[0].Relation;
            const addr = req.body.finalAdSt[1].address;
            const bld = req.body.finalAdSt[2].bloodGroup;
            const genre = req.body.finalAdSt[3].Genre;
            console.log(genre)
            await Data.findByIdAndUpdate(data.id,{RelationshipStatus:rlst});
            await Data.findByIdAndUpdate(data.id,{Address:addr});
            await Data.findByIdAndUpdate(data.id,{BloodGroup:bld});
            await Data.findByIdAndUpdate(data.id,{GenreList:genre});

            res.json(["/Info Saved"]);
         })
     }
     else {
        res.json(["/Login"])
     }
    

    
})
// { image: [], Gender: false, bio: ' Bio  ' }

app.post("/settings/account-info", (req,res)=>{
    const Token = req.cookies.anipub;
    if(Token){
        jwt.verify(Token,"I Am Naruto",async(err,data)=>{
            if(err){
                res.json(["You are not Authorized"]);
            }
            let image = req.body.image[0];
            if(image === undefined ) {
                image = "/Shinbou.jpg"
            }
            let gender = req.body.Gender;
         
            if(gender){
                gender = "Female"
            }
            else {
                gender = "Male"
            }
            const bio = req.body.bio;
        
            await Data.findByIdAndUpdate(data.id,{Bio:bio});
            await Data.findByIdAndUpdate(data.id,{Gender:gender});
            await Data.findByIdAndUpdate(data.id,{Image:image});
            res.json(["/Info Saved"]);
        })
    }
    else {
        res.json(['/Login']);
        
    }
   

})
// Notify
app.use(Notify)

//Update --- false auth to cheking
app.get("/About-Us",(req,res)=>{
    res.render("About-Us");

})

app.get("/Privacy-Policy",(req,res)=>{
    const Token = req.cookies.anipub;
    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err){
                console.log(err)
            }
            const userInfo = {ID:data.id};
             res.render("Privacy-Policy",{SectionName:"Privacy Policy Section", Auth:true,userInfo});
        })
    }else{
    res.render("Privacy-Policy",{SectionName:"Privacy Policy Section",Auth:false});
}
   
});
app.get("/Uploader",validAdmin,(req,res)=>{
    res.render("Uploader",{SectionName:"Uploader Section"});
});

//Upload
app.post("/Upload",validAdmin,async(req,res)=>{
    try {
    const Update = await AnimeDB.create({
         name: req.body.epName,
  _id:  Number(req.body.id),
  Name:  req.body.Name,
  ImagePath:  req.body.ip,                                                                                                                                                                                                                                                                                                                                                     
  Cover:  req.body.cover, 
  Synonyms:  req.body.syn,                                                                                                                                                                      
  link:  req.body.link,
  title:  req.body.title,
  poster:  req.body.ip,
  Aired:  req.body.aired,
  Premiered:  req.body.premiered,
  Duration:  req.body.duration,
  Status:  req.body.staus,
  MALScore:  req.body.malscore,
  RatingsNum: Number(req.body.ratings),
  Genres:  req.body.genre,
  Studios:  req.body.studios,
  Producers:  req.body.producers,
  DescripTion:  req.body.des,
  type:  req.body.type,
    })
    if(Update) {
        res.json(1)
    }
}
catch(err){
    res.json(2)
    console.log(err);
}
})

app.post("/update/info",validAdmin,(req,res)=>{
    AnimeDB.findById(Number(req.body.id))
    .then(info=>{
        if(info){
            AnimeDB.findByIdAndUpdate(Number(req.body.id),{$push:{ep:{
                name:req.body.epName,
                link:req.body.link,
                title:req.body.title,
            }}})
            .then(Info=>{
                if(Info){
                    console.log("DB updated");
                    res.json(1);
                }
                else {
                    console.log("There was a error while updating DB")
                    res.json(2);
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }
        else {
            console.log("Couldn't Find The Account")
            res.json(2);
        }
    })
})

app.post("/update/ext",validAdmin,async (req,res)=>{
    // { ID: '3', EP: '1', TYPE: 'link', Value: 'alu.com' }
    const Type = req.body.TYPE ;
    const EP = Number(req.body.EP);
    const ID = Number(req.body.ID);
    const Value = req.body.Value;
    if(Type === "link") {
        if(EP ===0) {
       AnimeDB.findByIdAndUpdate(ID,{$set:{link:Value}})
       .then(info=>{
        if(info) {
            res.json(1);
        }
        else {
            res.json(2)
        }
       })
        }
        else {
            const epNum = EP -1;
            const update = {
                [`ep.${epNum}.link`]:Value 
            }
            //dynamic update 
            AnimeDB.findByIdAndUpdate(ID,{$set:update})
            .then(info=>{
        if(info) {
            res.json(1);
        }
        else {
            res.json(2)
        }
       })
        }
    }
    else if (Type === "name") {
        if(EP === 0) {
             AnimeDB.findByIdAndUpdate(ID,{name:Value})
              .then(info=>{
                if(info) {
                    res.json(1);
                }
                else {
                    res.json(2)
                }
            })
        }
        else {
            const epNum = EP-1;
            const update = {
                [`ep.${epNum}.name`]:Value
            }
              AnimeDB.findByIdAndUpdate(ID,{$set:update})
            .then(info=>{
        if(info) {
            res.json(1);
        }
        else {
            res.json(2)
        }
       })
        
        }
    }

    else if (Type === "image") {
           AnimeDB.findByIdAndUpdate(ID,{ImagePath:Value})
              .then(info=>{
                if(info) {
                    res.json(1);
                }
                else {
                    res.json(2)
                }
            })
    }
    else if (Type === "cover") {
           AnimeDB.findByIdAndUpdate(ID,{Cover:Value})
              .then(info=>{
                if(info) {
                    res.json(1);
                }
                else {
                    res.json(2)
                }
            })
    }
    else {
        res.json(2);
    }

})

app.post("/Bulk/Add",validAdmin,async(req,res)=>{
    const ID = req.body.ID;
    const ARY = req.body.ARY;
const Yo = await   AnimeDB.bulkWrite([
        {updateOne:{
            filter:{"_id":Number(ID)},
            update:{
                $push:{
                    ep:{
                        $each:ARY
                    }
                }
            }
        }}
    ])
if(Yo) {
    res.json(1)
}
else {
    res.json(2)
}

})


// give myself Admin Permission 

app.get("/AdminMake",(req,res)=>{
    Data.find({"Email":"abdullahal467bp@gmail.com"})
    .then(info=>{

            Data.findOneAndUpdate({"Email":"abdullahal467bp@gmail.com"},{"AcStats":"Active"})
                .then(info=>{
                    res.redirect("/Home");
                })

    })
  
})
app.get("/verify-email-change/:id/:code",(req,res)=>{
    const ID = req.params.id;
    const code = req.params.code;
    mailChanger.findById(ID)
    .then(info=>{
        if(info && info.CODEV === code) {
               Data.findByIdAndUpdate(ID,{"AcStats":"Active"})
                .then(ishq=>{
                    if(ishq) {
                        Data.findByIdAndUpdate(ID,{"Email":info.newmail})
                        .then(hein=>{
                            console.log("Email Changed")
                            res.json("Bruh Account Got Verified now go to login page ! hehe")
                        })
                    }
                })
        }
        else {
            res.json("Are You Sure ? ")
        }
    })
})
