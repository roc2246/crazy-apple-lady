function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login"); // Replace with login page
  }
  next();
}

function checkSession(req, res, next) {
  if (req.session.user) {
    return res.redirect("/dashboard"); // Replace with login page
  }
  next();
}

module.exports = {
  requireLogin,
  checkSession,
};
