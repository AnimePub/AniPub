const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/model');
const jwt = require("jsonwebtoken");
const JSONAUTH = process.env.jsonauth;


function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  crypto.createHash('sha256').update(verifier).digest('base64url')
  return verifier;
}


// GET /authmal/login  →  Redirect to MAL OAuth
router.get('/login', (req, res) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  // Store PKCE verifier + state in session
  req.session.codeVerifier = codeVerifier;
  req.session.oauthState = state;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.MAL_CLIENT_ID,
    redirect_uri: process.env.MAL_REDIRECT_URI,
    scope: 'openid',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'plain'
  });

  res.redirect(`https://myanimelist.net/v1/oauth2/authorize?${params}`);
});

// GET /authmal/callback 
router.get('/callback', async (req, res) => {

    const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH, async (err, data) => {
            if (err) {
                console.log(err);
            }
            if(data.id) {
              const malExist = await User.findById(data.id)
              
              if(malExist.malId) {
                res.redirect("/Home");
              }
              else {
                const { code, state, error } = req.query;

  if (error) {
    return res.redirect('/?error=access_denied');
  }
  console.log(Token);

  // Validate state to prevent CSRF
  if (!state || state !== req.session.oauthState) {
    return res.redirect('/?error=invalid_state');
  }

  const codeVerifier = req.session.codeVerifier;
  if (!codeVerifier) {
    return res.redirect('/?error=missing_verifier');
  }

  // Clean up session PKCE data
  delete req.session.codeVerifier;
  delete req.session.oauthState;

  try {
    //  Exchange code for access token 
    const tokenRes = await axios.post(
      'https://myanimelist.net/v1/oauth2/token',
      new URLSearchParams({
        client_id: process.env.MAL_CLIENT_ID,
        client_secret: process.env.MAL_CLIENT_SECRET,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: process.env.MAL_REDIRECT_URI
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    //   Fetch MAL user profile 
    const profileRes = await axios.get('https://api.myanimelist.net/v2/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
      params: {
        fields: 'id,name,picture,gender,location,joined_at,anime_statistics,manga_statistics'
      }
    });

    const profile = profileRes.data;
 console.log(profile);
    // -Upsert user in MongoDB ---
    const user = await User.findOneAndUpdate(
      { "_id":data.id },
      {
        malId: profile.id,
        malusername: profile.name,
        malpicture : profile.picture || null,
        Address:profile.location, 
        Gender: profile.gender,
        malProfile: {
          animeCount: profile.anime_statistics?.num_items_completed || 0,
          mangaCount: profile.manga_statistics?.num_items_completed || 0
        },
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000)
      }
    );
console.log(user)
    // Save user ID to session ---
    req.session.malId = user.malId.toString();
    req.session.malUsername = user.malusername;
console.log( req.session.malId,  req.session.malUsername,user._id)
    res.redirect('/Home');

  } catch (err) {
    console.log(err)
    res.redirect('/?error=auth_failed');
  }
              }
            }





        })
    }


  
  
})

;

// Token Re Gen
router.post('/refresh', async (req, res) => {
      const Token = req.cookies.anipub;
    if (Token) {
        jwt.verify(Token, JSONAUTH, async (err, data) => {
            if (err) {
                console.log(err);
            }
             if(data._id) {
              const malExist = await User.findById(data._id)
              if(malExist.malId) {
                 if (!req.session.malId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
    try {
    const user = await User.findById(data._id);
    const tokenRes = await axios.post(
      'https://myanimelist.net/v1/oauth2/token',
      new URLSearchParams({
        client_id: process.env.MAL_CLIENT_ID,
        client_secret: process.env.MAL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: user.refreshToken
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    user.accessToken = access_token;
    user.refreshToken = refresh_token;
    user.tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
    await user.save();

    res.json({ success: true, message: 'Token refreshed' });
  } catch (err) {
    console.error('Token refresh error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
              }
              else {
                res.json("I love you ===> Server")
              }
        

            }
        })
    }
 


});

module.exports = router;
