const express = require("express");
const getmail = express.Router();
let mainkey = process.env.getmail;
getmail.post("/get/mail",(req,res)=>{
    const key = req.query.key;
    if (key === mainkey) {
        console.log(
            req.body
        )
    }
    else {
        res.json("Not matching Key <>");
    }
})

module.exports = getmail;