const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");
const components = require("../components/index");
const fs = require("fs");
const path = require("path");

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
  const postId = req.body.id;
  const updatedPost = req.body.content;
  controllers.manageUpdatePost(req, res, postId, updatedPost);
});

router.delete("/delete-post", (req, res) => {
  const postId = parseInt(req.query.id);
  controllers.manageDeletePost(req, res, postId);
});

router.get("/get-post-titles", (req, res) => {
  const blogType = req.query.type;
  controllers.manageGetPostNames(req, res, blogType);
});



module.exports = router