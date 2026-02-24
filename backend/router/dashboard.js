const express = require('express');
const aluR = express.Router();
const axios = require('axios');
const path = require('path');
const User = require('../models/model');
const { requireAuth } = require('../middleware/auth');


aluR.get('/api/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('-accessToken -refreshToken -Password -googleId -List')
      .lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

aluR.get('/api/anime/watching', requireAuth, async (req, res) => {
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

aluR.get('/api/anime/:id', requireAuth ,async (req, res) => {
  const user = await Data.findById(req.session.userId);
  
  const response = await axios.get('https://api.myanimelist.net/v2/users/@me/animelist', {
    headers: { Authorization: `Bearer ${user.accessToken}` },
    params: {
      status: req.query.status || 'completed', // watching, completed, on_hold, dropped, plan_to_watch
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
      fields: 'list_status,num_episodes,mean,synopsis,main_picture,start_season,genres,status'
    }
  });

  res.json(response.data);
});
aluR.get('/api/anime/search',requireAuth, async (req, res) => {
  const user = await User.findById(req.session.userId);

  const response = await axios.get('https://api.myanimelist.net/v2/anime', {
    headers: { Authorization: `Bearer ${user.accessToken}` },
    params: {
      q: req.query.q,     
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
      fields: 'id,title,main_picture,synopsis,mean,rank,popularity,genres,status,num_episodes,start_season'
    }
  });

  res.json(response.data);
});
aluR.get('/api/anime/:id',requireAuth, async (req, res) => {
  const user = await User.findById(req.session.userId);

  const response = await axios.get(`https://api.myanimelist.net/v2/anime/${req.params.id}`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
    params: {
      fields: [
        'id',
        'title',
        'main_picture',
        'alternative_titles',
        'start_date',
        'end_date',
        'synopsis',
        'mean',
        'rank',
        'popularity',
        'num_list_users',
        'num_scoring_users',
        'nsfw',
        'genres',
        'status',
        'num_episodes',
        'start_season',
        'broadcast',
        'source',
        'average_episode_duration',
        'rating',
        'studios',
        'statistics'
      ].join(',')
    }
  });

  res.json(response.data);
});
aluR.post('/api/animelist/:animeId',requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const params = new URLSearchParams({
      status: req.body.status,                    // watching, completed, on_hold, dropped, plan_to_watch
      num_watched_episodes: req.body.episodes, 
    });

    const response = await fetch(
      `https://api.myanimelist.net/v2/anime/${req.params.animeId}/my_list_status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to update' });
    }

    const data = await response.json();
    res.json({ success: true, data });

  } catch (err) {
    console.error(' Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = aluR;