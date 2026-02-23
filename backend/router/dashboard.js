const express = require('express');
const aluR = express.Router();
const axios = require('axios');
const path = require('path');
const User = require('../models/model');
const { requireAuth } = require('../middleware/auth');


aluR.get('/api/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('-accessToken -refreshToken -Password -googleId')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

aluR.get('/api/anime', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { status = 'watching', limit = 10 } = req.query;

    const animeRes = await axios.get('https://api.myanimelist.net/v2/users/@me/animelist', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
      params: {
        status,
        limit,
        fields: 'list_status,num_episodes,mean,start_season,synopsis,main_picture'
      }
    });

    res.json(animeRes.data);
  } catch (err) {
    console.error('Anime list error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch anime list' });
  }
});


module.exports = aluR;