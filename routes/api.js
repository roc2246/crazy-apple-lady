const express = require("express");
const api = express.Router();
const controllers = require("../controllers/index");
const components = require("../components/index");
const fs = require("fs");
const path = require("path");

// LOGIN
api.post("/login", (req, res) => {
  controllers.login(req, res);
});

api.post("/logout", (req, res) => {
  controllers.logout(req, res);
});

// CRUD
api.post("/new-post", (req, res) => {
  controllers.manageNewPost(req, res);
});

api.put("/update-post", (req, res) => {
  const postId = req.body.id;
  const updatedPost = req.body.content;
  controllers.manageUpdatePost(req, res, postId, updatedPost);
});

api.delete("/delete-post", (req, res) => {
  const postId = parseInt(req.query.id);
  controllers.manageDeletePost(req, res, postId);
});

api.get("/get-post-titles", (req, res) => {
  const blogType = req.query.type;
  controllers.manageGetPostNames(req, res, blogType);
});

api.get("/post", (req, res) => {
  const postId = parseInt(req.query.id);
  controllers.manageGetPost(req, res, postId);
});

module.exports = api