function requireLogin (req, res, next)  {
    if (!req.session.user) {
      return res.redirect('/login'); // Replace with login page
    }
    next(); 
  };

  module.exports = {
    requireLogin
  }