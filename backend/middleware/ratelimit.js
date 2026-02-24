const express = require('express');
const rateLimit = require('express-rate-limit');

function isGoodBot(req) {
  const ua = req.get('user-agent') || '';
  return /Googlebot|Google-InspectionTool|Slurp|yandex|yahoo|DuckDuckBot/i.test(ua);
}
//global
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,       
  max: 80,                   
  message: { error: 'Too many requests, try again in a minute' },
  skip: (req) => isGoodBot(req),
  standardHeaders: true,
  legacyHeaders: false,
});


// streaming link generation / episode fetch
const streamLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,                 
  message: { error: 'Streaming rate limit exceeded. Wait 60s.' },
  skipFailedRequests: true,  
});


// anime info, search
const infoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  message: { error: 'Too many info requests.' },
});

module.exports = {globalLimiter,streamLimiter,infoLimiter}