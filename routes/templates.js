const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");
const components = require("../components/index");
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  const viewsDir = path.join(__dirname, "../views");

  fs.readFile(path.join(viewsDir, "home.html"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let modifiedHTML = data.replace("{{top}}", components.top("home"));
    modifiedHTML = modifiedHTML.replace("{{hero}}", components.hero());
    modifiedHTML = modifiedHTML.replace(
      "{{bottom}}",
      components.bottom("home.js")
    );

    res.send(modifiedHTML);
  });
});

router.get("/planty-life", (req, res) => {
  const viewsDir = path.join(__dirname, "../views");

  fs.readFile(path.join(viewsDir, "planty-life.html"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    let modifiedHTML = data.replace("{{top}}", components.top("Planty-Life"));
    modifiedHTML = modifiedHTML.replace("{{hero}}", components.hero());
    modifiedHTML = modifiedHTML.replace(
      "{{bottom}}",
      components.bottom("planty-life.js")
    );

    res.send(modifiedHTML);
  });
});

module.exports = router;
