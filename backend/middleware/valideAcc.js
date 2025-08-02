const jwt = require("jsonwebtoken");
const AuthAcc = (req,res,next)=>{
    const Token = req.cookies.anipub;
    if(Token){
        jwt.verify(Token,"I Am Naruto",(err,data)=>{
            if(err) {
                console.log(err);
            }
         
            next();
        })
    }
    else {
        res.redirect("/Login")
    }
}

module.exports = {AuthAcc}