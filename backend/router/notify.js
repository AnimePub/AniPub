const express = require("express");
const Notify = express.Router();
const getID = require("../middleware/getcookieID");
const JSONAUTH = process.env.jsonauth;
const User = require('../models/model');
const {
    newList
} = require("../models/list");
const wpid = process.env.wpid;
const wpkey = process.env.wpkey ;
const msgekey = process.env.nkey ;
Notify.get("/Notify/", (req, res) => {
    const query = req.query.active;
    if (query === "false" || query === "pending") {
        const Msge = ["A Link Have been sent to your email account", "Please Verify it within 30min"]
        res.render("Notify", {
            Msge
        })
    } else if (query === "true") {
        const Msge = ["The Account is Already Active!"]
        res.render("Notify", {
            Msge
        })
    } else {
        res.redirect("/Home")
    }
})

Notify.get("/Notifications",async(req,res)=>{
   
     const id = await getID(req,JSONAUTH);
    const userData = await User.findById(id)
      .select('-accessToken -refreshToken -Password -googleId -List -Email -Address -tokenExpiresAt')
      .lean();
    res.render("notifications",{alu:"notify",userData,Number:userData.Number});
})
Notify.post("/user/number",async(req,res)=>{
      const id = await getID(req,JSONAUTH);
      if(id){
      let number = req.body.number;
       if(number !== null && number !== undefined && number.toString().length > 6 ) {
        if(isFinite){
             number = number;
        }
        else {
             number = number.toString().replace(/\+/,'');
        }
      
        number = Number(number)
        User.findByIdAndUpdate({
        _id:id
      },{
        Number:Number(number),
        nStat:true,
      })
      .then(info=> info)
      .then(tes=>{
        res.json([0]);
      })
    }else {
        res.json([1])
    }
      }
      else {
        res.json("Bro Do you have id ?");
      }
})
Notify.get("/user/n/t1",async(req,res)=>{
      const id = await getID(req,JSONAUTH);
    if(id) {
        User.findByIdAndUpdate({
        _id:id
      },{
        nStat:true,
      })
      .then(info=> info) 
      .then(tes=>{
         res.json([0]);
      })
    }
    else {
        res.json("bro get a id first ");
    }
})
Notify.get("/user/n/t2",async(req,res)=>{
      const id = await getID(req,JSONAUTH);
    if(id) {
        User.findByIdAndUpdate({
        _id:id
      },{
        nStat:false,
      })
      .then(info=> info) 
      .then(tes=>{
         res.json([0]);
      })
    }
    else {
        res.json("bro get a id first ");
    }
})
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
Notify.get("/sentMsge",(req,res)=>{
  const key = req.query.key;
  if(msgekey === key) {
  const ids = req.query.id ;
  let id = ids.split(",");
  let respi = "Sent";
  let count = 0;
  id = id.map(value=> Number(value))
  User.find({"nStat":true}).select('-accessToken -GenreList -AcStats -Hide -userType -Bio -Image -Premium -profilePicture -malId -malProfile -malpicture -lastLogin -RelationshipStatus -BloodGroup -Cover -count -Gender -malusername -refreshToken -Password -googleId -List -Email -Address -tokenExpiresAt')
      .lean()
  .then(info=>{
      let userArray = info ;
      userArray.forEach( async value=>{
        newList.find({"Owner":value._id,"AniID":{$in:id}})
        .then( async anfu =>{
          anfu.forEach(async alu=>{
            count++;
              await sleep(count * 10000)
                 fetch(`https://app.wpsent.xyz/send?clientid=${wpid}&key=${wpkey}&to=${value.Number}`,{
 method:"POST",
          headers: {
                        "Content-Type": "application/json"
                    },
        body:JSON.stringify({"message":`Hi ${value.Name}! The Anime you have saved in AniPub PlayList got a new Episode .. Check it out here ...Your last Watched Ep:${alu.Progress} now start from new Ep https://anipub.org/AniPlayer/${alu.AniID}/${alu.Progress}
          This message is sent to you automatically .
          
          --Don't know why you get this message ? Please contact Admin
          - abdullahaladnan95@gmail.com

          `})
        })
        .then( resp => resp.json())
        .then ( respi =>{
          respi = respi
        })
          })
         
      })
  })
 

})
 .then(aluu=> res.json(respi))
}else {
  res.json("Wrong Key Bro");
}});

module.exports = Notify;