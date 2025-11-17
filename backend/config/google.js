const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Data = require('../models/model');
const fs = require('fs');
const path = require('path');
const https = require('https');


const configureGoogleAuth = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.log('⚠️  Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file to enable Google login.');
        return;
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL ,// "http://localhost:3000/auth/google/callback"
    }, 
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await Data.findOne({ Email: profile.emails[0].value },{"AcStats":-1,"Name":-1});
            console.log(existingUser);
            if (existingUser) {
                console.log(`🔄 Found existing user: ${existingUser.Name}`);
                
                // Update account status if needed
                if (existingUser.AcStats === "Pending") {
                    await Data.findByIdAndUpdate(existingUser._id, { AcStats: "Active" });
                    console.log(`✅ Activated pending account for: ${existingUser.Name}`);
                }
                
                if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                    try {
                        await Data.findByIdAndUpdate(existingUser._id, { 
                            googleId: profile.id ,
                            Image: profile.photos[0].value
                        });
                       
                       } catch (error) {
                        console.log(`⚠️  Failed to update profile picture for existing user: ${error.message}`);
                    }
                }
                
                return done(null, existingUser);
            }
            
            // Create new user with Google profile picture
            console.log(`🆕 Creating new user: ${profile.displayName}`);
            
            let profilePictureName = 'default.jpg';
           
            const newUser = await Data.create({
                Name: profile.displayName,
                Email: profile.emails[0].value,
                AcStats: "Active",
                userType: "Member",
                googleId: profile.id,
                Image: profile.photos[0].value
            });
            
            console.log(`✅ Created new Google OAuth user: ${newUser.Name} with profile picture: ${profilePictureName}`);
            return done(null, newUser);
        } catch (error) {
            console.error('❌ Error in Google OAuth strategy:', error);
            return done(error, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await Data.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    console.log('✅ Google OAuth configured successfully');
};

module.exports = { configureGoogleAuth };
