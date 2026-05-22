 const jwt = require("jsonwebtoken");
 
 const getID = (req,JSONAUTH) =>{
     const Token = req.cookies.anipub;
     if (Token) {
            jwt.verify(Token, JSONAUTH, (err, data) => {
                if (err) {
                    console.log(err);
                    return "itsmyidahahhahah";
                }
    
                return data.id
            }

     )
}
else {
    return "itsmyidahahhahah"
}
 }


module.exports = getID ;