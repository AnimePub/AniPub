const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const Data = require('../models/model');

const configureGitHubAuth = () => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        console.log('⚠️  GitHub OAuth not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file to enable GitHub login.');
        return;
    }

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // GitHub may return multiple emails; prefer the primary verified one
            const primaryEmail = profile.emails && profile.emails.find(e => e.primary && e.verified)?.value
                || profile.emails?.[0]?.value
                || null;

            // Try to find existing user by githubId first
            let existingUser = await Data.findOne({ githubId: profile.id });

            if (existingUser) {
                console.log(`🔄 Found existing GitHub user: ${existingUser.Name}`);
                if (existingUser.AcStats === 'Pending') {
                    await Data.findByIdAndUpdate(existingUser._id, { AcStats: 'Active' });
                }
                return done(null, existingUser);
            }

            // Try to match by email if user signed up manually or via Google
            if (primaryEmail) {
                existingUser = await Data.findOne({ Email: primaryEmail });
                if (existingUser) {
                    console.log(`🔗 Linking GitHub to existing account: ${existingUser.Name}`);
                    await Data.findByIdAndUpdate(existingUser._id, {
                        githubId: profile.id,
                        AcStats: existingUser.AcStats === 'Pending' ? 'Active' : existingUser.AcStats
                    });
                    return done(null, existingUser);
                }
            }

            // Create new user
            const avatarUrl = profile.photos?.[0]?.value || null;
            const newUser = await Data.create({
                Name: profile.displayName || profile.username,
                Email: primaryEmail || `github_${profile.id}@placeholder.anipub`,
                AcStats: 'Active',
                userType: 'Member',
                githubId: profile.id,
                Image: avatarUrl
            });

            console.log(`✅ Created new GitHub OAuth user: ${newUser.Name}`);
            return done(null, newUser);
        } catch (error) {
            console.error('❌ Error in GitHub OAuth strategy:', error);
            return done(error, null);
        }
    }));

    console.log('✅ GitHub OAuth configured successfully');
};

module.exports = { configureGitHubAuth };
