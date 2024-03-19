const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");

router.post("/login", (req, res) => {
    controllers.login(req, res)
})

router.post("/logout", (req, res) => {
    controllers.logout(req, res);
  });

router.post("/new-post", (req, res) => {
    controllers.manageNewPost(req, res)
})

router.put("/update-post", (req, res)=>{
    const postId = req.body.id;
    const updatedPost = req.body.content; 
    controllers.manageUpdatePost(req, res, postId, updatedPost)
})

module.exports = router;
