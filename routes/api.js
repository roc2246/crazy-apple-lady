const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");
const middleware = require("../middleware/index");

// LOGIN
router.post("/login", (req, res) => {
  controllers.login(req, res);
});

router.post("/logout", (req, res) => {
  controllers.logout(req, res);
});

// CRUD
router.post("/new-post", (req, res) => {
  controllers.manageNewPost(req, res);
});

router.put("/update-post", (req, res) => {
  const updatedPost = req.body;
  controllers.manageUpdatePost(req, res, updatedPost);
});

router.delete("/delete-post", (req, res) => {
  const postId = parseInt(req.query.id);
  controllers.manageDeletePost(req, res, postId);
});

router.get("/get-post-titles", (req, res) => {
  const blogType = req.query.type;
  controllers.manageGetPostNames(req, res, blogType);
});

router.get("/get-posts", (req, res) => {
  controllers.manageGetPosts(req, res);
});

router.post("/upload", (req, res) => {
  controllers.manageImageUpload(req, res);
});

module.exports = router;
