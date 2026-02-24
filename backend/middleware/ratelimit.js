const express = require('express');
const rateLimit = require('express-rate-limit');

function isGoodBot(req) {
  const ua = req.get('user-agent') || '';
  return /Googlebot|Google-InspectionTool|Slurp|yandex|yahoo|DuckDuckBot/i.test(ua);
}

// Helper to get real client IP
function getClientIP(req) {
  return req.ip; 
}

// Global limiter
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,       
  max: 80,                   
  message: { error: 'Too many requests, try again in a minute' },
  skip: (req) => isGoodBot(req),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIP(req), // Use real IP
});

// Streaming limiter
const streamLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,                 
  message: { error: 'Streaming rate limit exceeded. Wait 60s.' },
  skipFailedRequests: true,
  keyGenerator: (req) => getClientIP(req),
});

// Info limiter
const infoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  message: { error: 'Too many info requests.' },
  keyGenerator: (req) => getClientIP(req),
});

module.exports = { globalLimiter, streamLimiter, infoLimiter };