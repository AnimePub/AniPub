 const jwt = require("jsonwebtoken");
 
 const getID = async (req,JSONAUTH) =>{
     const Token = req.cookies.anipub;
     if (Token) {
            jwt.verify(Token, JSONAUTH, (err, data) => {
                if (err) {
                    console.log(err);
                    return "itsmyidahahhahah";
                }
                console.log(data.id)
                return data.id
            }

     )
}
else {
    console.log("token err")
    return "itsmyidahahhahah" 
}
 }


module.exports = getID ;