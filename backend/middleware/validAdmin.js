const jwt = require("jsonwebtoken");
const Data = require("../models/model");
const validAdmin =  (req,res,next) =>{
    const Token = req.cookies.anipub;
        if(Token){
            jwt.verify(Token,"I Am Naruto",async(err,data)=>{
                if(err) {
                    console.log(err);
                }
               const user = await Data.findById(data.id)
                const status = user.userType;
                if(status === "Admin" || status === "Moderator") {
                    next();
                }
                else {
                      res.redirect("/Login")
                }
               
            })
        }
        else {
            res.redirect("/Login")
        } 
}

module.exports = validAdmin;