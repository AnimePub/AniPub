function requireAuth(req, res, next) {
  if (req.session && req.session.malId) {
    return next();
  }
  res.redirect('/Login');
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.malusername) {
    return res.redirect('/Home');
  }
  next();
}

module.exports = { requireAuth, redirectIfAuth };