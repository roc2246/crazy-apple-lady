const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");
const templates = require("../templates/index");
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

router.get("/post", (req, res) => {
  const postId = parseInt(req.query.id);
  controllers.manageGetPost(req, res, postId);
});

// TEMPLATES
router.get("/planty-life", (req, res) => {
  const viewsDir = path.join(__dirname, "../views");

  fs.readFile(path.join(viewsDir, "planty-life.html"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let modifiedHTML = data.replace("{{top}}", templates.top("Planty-Life"));
    modifiedHTML = modifiedHTML.replace("{{hero}}", templates.hero());
    modifiedHTML = modifiedHTML.replace(
      "{{bottom}}",
      templates.bottom("planty-life.js")
    );

    res.send(modifiedHTML);
  });
});

module.exports = router;
