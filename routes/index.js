const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");

router.post("/login", (req, res) => {
    controllers.login(req, res)
})

router.post("/logout", (req, res) => {
    controllers.logout(req, res);
  });

module.exports = router;
