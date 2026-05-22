 const jwt = require("jsonwebtoken");
 
 const getID = async (req,JSONAUTH) =>{
     const Token = req.cookies.anipub;
     if(!Token) {
    console.log("token err")
        return "itsmyidahahhahah" 
     }
     try {
         const data = await jwt.verify(Token, JSONAUTH)
           return data.id
        }
        catch (err) {
            console.log("token err");
            return "itsmyidahahhahah" 
        }
 }


module.exports = getID ;