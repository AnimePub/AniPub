const jwt = require("jsonwebtoken");
const Data = require("../models/model");
const JSONAUTH = process.env.jsonauth;
const validAdmin = (req, res, next) => {
    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH , async (err, data) => {
            if (err) {
                console.log(err);
            }
            const user = await Data.findById(data.id)
            const status = user.userType;
            if (status === "Admin" || status === "Moderator") {
                next();
            } else {
                res.redirect("*")
            }

        })
    } else {
        res.redirect("*")
    }
}

module.exports = validAdmin;