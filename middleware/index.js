const multer = require("multer");
const path = require("path");

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

function upload() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images/");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname);
    },
  });
  return multer({ storage: storage });
}

module.exports = {
  requireLogin,
  checkSession,
  upload,
};
