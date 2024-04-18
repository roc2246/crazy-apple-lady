function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.redirect("/login");
  }
  next();
}

function checkSession(req, res, next) {
  if (req.session.username) {
    return res.redirect("/dashboard");
  }
  next();
}

module.exports = {
  requireLogin,
  checkSession,
};
