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
      cb(null, "uploads/"); // save uploaded files to uploads directory
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      ); // append timestamp to filename
    },
  });
  return multer({ storage: storage });
}

module.exports = {
  requireLogin,
  checkSession,
  upload,
};
