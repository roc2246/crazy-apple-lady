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

router.get("/get-posts", (req, res) => {
  controllers.manageGetPosts(req, res);
});

// UPLOADS
(() => {
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination:  (req, file, cb)=> {
      cb(null, './views/images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const upload = multer({storage: storage });
  router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No files were uploaded.");
    }
    res.send("File uploaded successfully.");
  });
})();

module.exports = router;
