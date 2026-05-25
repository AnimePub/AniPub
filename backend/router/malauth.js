const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/model');
const jwt = require("jsonwebtoken");
const JSONAUTH = process.env.jsonauth;
const getID = require("../middleware/getcookieID");

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

    // Save user ID to session ---
    req.session.malId = user.malId.toString();
    req.session.malUsername = user.malusername;

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

//get token 
router.get('/refresh', async (req, res) => {
  try {
    const Token = req.cookies.anipub;
    
    if (!Token) {
      return res.status(401).json({ error: 'No token found in cookies' });
    }

  
    const data = await new Promise((resolve, reject) => {
      jwt.verify(Token, JSONAUTH, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    if (!data.id) {
      return res.status(401).json({ error: 'Invalid token data' });
    }

    const user = await User.findById(data.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.malId) {
      return res.status(400).json({ error: 'MAL account not linked' });
    }

    if (!user.refreshToken) {
      return res.status(401).json({ error: 'No refresh token available' });
    }
    const targetTime = new Date(user.tokenExpiresAt);
  const now = new Date();

  if (now < targetTime) {
    return res.status(403).json({error:'Token already refreshed'})
} else {
 
    // Refresh the token
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

  
    return res.json({
      success: true,
      message: 'Token refreshed successfully',
      expiresIn: expires_in,
      expiresAt: user.tokenExpiresAt
    });
  
 } } catch (err) {
    console.error('Token refresh error:', err.message);
    
    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'Refresh token expired or invalid' });
    }
    
    return res.status(500).json({ error: 'Failed to refresh token' });
  }

});

//let's use it in the future ..
router.get("/expire",async (req,res)=>{
   const id = await getID(req,JSONAUTH)
    const user = await User.findById(id)
      .select('-accessToken -refreshToken -Password -googleId -List -Email -Address')
    res.json(user);  
})

module.exports = router;
