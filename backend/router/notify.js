const express = require("express");
const Notify = express.Router();
const getID = require("../middleware/getcookieID");
const JSONAUTH = process.env.jsonauth;
const User = require('../models/model');

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
module.exports = Notify;