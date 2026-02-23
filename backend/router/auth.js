const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/model')

const JSONAUTH = process.env.jsonauth;

const TokenGen = (id) => {
    return jwt.sign({ id }, JSONAUTH, { expiresIn: 60 * 24 * 60 * 3 * 60 });
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/Login' }),
      async  (req, res) => {
            const user = req.user;
                 req.session.userId = req.user._id;
                           req.session.username = req.user.Name;

                           req.session.avatar = req.user.Image;
                             if(req.user.malId) {
                                    req.session.malId = req.user.malId
                               req.session.malUsername = req.user.malusername;
                               }
            const myCookie = TokenGen(user._id);
            res.cookie("anipub", myCookie, {
                httpOnly: true,
                maxAge: 3 * 60 * 60 * 24 * 60
            });
            
            res.redirect('/Home');
        }
    );
} else {
    router.get('/google', (req, res) => {
        res.status(503).json({ 
            error: 'Google OAuth not configured',
            message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file'
        });
    });
}


module.exports = router;
