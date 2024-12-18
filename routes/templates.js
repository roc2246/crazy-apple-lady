const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");
const middleware = require("../middleware/index");

router.get("/", (req, res) => {
  controllers.fillTemplate(req, res, "home", "Home");
});

router.get("/planty-life", (req, res) => {
  controllers.fillTemplate(req, res, "planty-life", "Planty Life");
});

router.get("/mushroom-blogs", (req, res) => {
  controllers.fillTemplate(req, res, "mushroom-blogs", "Mushroom Blogs");
});

router.get("/login", middleware.checkSession, (req, res) => {
  controllers.fillTemplate(req, res, "login", "Login");
});

router.get("/create-user", middleware.requireLogin, (req, res) => {
  controllers.fillTemplate(req, res, "create-user", "Create User");
});


router.get("/dashboard", middleware.requireLogin, (req, res) => {
  controllers.fillTemplate(req, res, "dashboard", "Dashboard");
});

router.get("/create-post", middleware.requireLogin, (req, res) => {
  controllers.fillTemplate(req, res, "create-post", "Create Post");
});

router.get("/manage-post", middleware.requireLogin, (req, res) => {
  controllers.fillTemplate(req, res, "manage-post", "Manage Post");
});

router.get("/post", (req, res) => {
  const postId = parseInt(req.query.id);
  controllers.manageGetPost(req, res, postId);
});

module.exports = router;
