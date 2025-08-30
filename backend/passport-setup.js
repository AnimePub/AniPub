const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Data = require('./models/model'); // your User model
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let existingUser = await Data.findOne({ Email: profile.emails[0].value });
        if (existingUser) {
            return done(null, existingUser);
        }
        // If not, create new user
        const newUser = await Data.create({
            Name: profile.displayName,
            Email: profile.emails[0].value,
            AcStats: 'Active',
            userType: 'Member',
            // You can store profile.photos[0].value if you want
        });
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Data.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
