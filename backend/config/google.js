const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Data = require('../models/model');
const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadProfilePicture = async (url, userId) => {
    return new Promise((resolve, reject) => {
        const fileName = `google_${userId}.jpg`;
        const filePath = path.join(__dirname, '../../profilePic', fileName);
        
        console.log(`🖼️  Downloading Google profile picture for user ${userId} from: ${url}`);
        
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const file = fs.createWriteStream(filePath);
        
        const timeout = setTimeout(() => {
            file.close();
            fs.unlink(filePath, () => {});
            reject(new Error('Download timeout'));
        }, 10000); 
        
        https.get(url, (response) => {
            console.log(`📥 Download response status: ${response.statusCode}`);
            
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    clearTimeout(timeout);
                    file.close();
                    console.log(`✅ Google profile picture downloaded: ${fileName}`);
                    resolve(fileName);
                });
            } else {
                clearTimeout(timeout);
                file.close();
                fs.unlink(filePath, () => {});
                console.log(`❌ Failed to download Google profile picture: ${response.statusCode}`);
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        }).on('error', (err) => {
            clearTimeout(timeout);
            file.close();
            fs.unlink(filePath, () => {});
            console.log(`❌ Download error: ${err.message}`);
            reject(err);
        });
    });
};

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
            const existingUser = await Data.findOne({ Email: profile.emails[0].value });
            
            if (existingUser) {
                console.log(`🔄 Found existing user: ${existingUser.Name}`);
                
                // Update account status if needed
                if (existingUser.AcStats === "Pending") {
                    await Data.findByIdAndUpdate(existingUser._id, { AcStats: "Active" });
                    console.log(`✅ Activated pending account for: ${existingUser.Name}`);
                }
                
                // Try to update profile picture for existing users too
                if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                    try {
                        const profilePictureName = await downloadProfilePicture(profile.photos[0].value, profile.id);
                        await Data.findByIdAndUpdate(existingUser._id, { 
                            googleId: profile.id // Ensure googleId is set
                        });
                        //gonna remove the downloaded picture ! hehe
                        console.log(`✅ Updated existing user ${existingUser.Name} with new Google profile picture: ${profilePictureName}`);
                    } catch (error) {
                        console.log(`⚠️  Failed to update profile picture for existing user: ${error.message}`);
                    }
                }
                
                return done(null, existingUser);
            }
            
            // Create new user with Google profile picture
            console.log(`🆕 Creating new user: ${profile.displayName}`);
            
            let profilePictureName = 'default.jpg';
            if (profile.photos && profile.photos[0] && profile.photos[0].value) {
                try {
                    profilePictureName = await downloadProfilePicture(profile.photos[0].value, profile.id);
                    console.log(`✅ Using downloaded Google profile picture: ${profilePictureName}`);
                } catch (error) {
                    console.log(`⚠️  Failed to download Google profile picture, using default: ${error.message}`);
                    profilePictureName = 'default.jpg';
                }
            } else {
                console.log(`ℹ️  No Google profile picture available, using default`);
            }
            
            const newUser = await Data.create({
                Name: profile.displayName,
                Email: profile.emails[0].value,
                AcStats: "Active",
                userType: "Member",
                googleId: profile.id,
                Image: profilePictureName
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
