const jwt = require("jsonwebtoken");
require('dotenv').config();
const JSONAUTH = process.env.jsonauth;

const AuthAcc = (req, res, next) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH, (err, data) => {
            if (err) {
                console.log(err);
            }

            next();
        })
    } else {
        res.redirect("*")
    }
}

module.exports = {
    AuthAcc
}