const path = require("path");
const formidable = require("formidable");
const models = require("../models/index");
const utilities = require("../utilities/index");
const components = require("../components/index");
const fs = require("fs");

const bcrypt = require("bcrypt");
const { verify } = require("crypto");

require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});

// FOR GENERATING PASSWORD__________________________________
async function hashString(inputString) {
  try {
    const saltRounds = 10;
    const hashedString = await bcrypt.hash(inputString, saltRounds);
    return hashedString;
  } catch (error) {
    console.error("Error hashing string:", error);
    throw error;
  }
}

// hashString(inputString)
//   .then(hashedString => {
//     console.log('Hashed string:', hashedString);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// ___________________________________________________

// LOGIN
function logout(req, res) {
  // Destroy the session or clear specific session properties
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.status(200).send("Succesfully logged out");
    }
  });
}

async function login(req, res) {
  const sessionTimeout = 30 * 60 * 1000;
  const userExists = await models.findUser(req.body.username);

  if (userExists) {
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );

    if (passwordMatch) {
      // Authentication successful
      const sessionId = utilities.generateRandomString(20);
      const currentTime = Date.now();

      // Set session properties
      req.session.username = req.body.username;
      req.session.lastAccessed = currentTime;
      req.session.sessionId = sessionId;
      req.session.expiresAt = currentTime + sessionTimeout; // Calculate session expiration time

      res.status(200).send("Login succeeded");
    } else {
      // Password doesn't match
      res.status(401).send("Invalid credentials");
    }
  } else {
    // User not found
    res.status(401).send("Invalid credentials");
  }
}

// CREATE, UPDATE, DELETE
async function manageNewPost(req, res, model = models.newPost) {
  try {
    utilities.verifyCallback(model);
    const post = req.body;
    await model(post);
    res.status(201).json({ message: "Post added" });
  } catch (error) {
    res.status(401).json({ message: error });
    throw error;
  }
}

async function manageUpdatePost(
  req,
  res,
  updatedPost,
  model = models.updatePost
) {
  try {
    utilities.verifyCallback(model);
    await model(updatedPost);
    res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost: updatedPost });
  } catch (error) {
    res.status(500).json({ message: error });
    throw error;
  }
}

async function manageDeletePost(req, res, id, model = models.deletePost) {
  try {
    utilities.verifyCallback(model);
    await model(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error while deleting post:", error);
    res.status(500).json({ message: error });
    throw error;
  }
}

// DATA RETRIEVAL
async function manageGetPostNames(
  req,
  res,
  type,
  model = models.postRetrieval
) {
  try {
    utilities.verifyCallback(model);
    const match = { type: type };
    const project = { _id: 0, id: 1, title: 1 };
    const posts = await model(match, project);
    if (posts.length > 0) res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error });
    console.log(error);
  }
}

async function manageGetPost(req, res, id, model = models.postRetrieval) {
  try {
    utilities.verifyCallback(model);
    const postData = await model({ id: id });
    const postTemplate = components.blogPost(
      postData[0].title,
      postData[0].content,
      postData[0].image
    );
    res.status(200).send(postTemplate);
  } catch (error) {
    const postTemplate = components.blogPost(
      "404: Post Not Found",
      "Try looking at other posts",
      [""]
    );
    res.status(404).send(postTemplate);
    console.log(error);
  }
}

async function manageGetPosts(req, res, model = models.postRetrieval) {
  try {
    utilities.verifyCallback(model);
    const posts = await model({});
    res.status(200).json(!posts ? new Error("No posts available") : posts);
  } catch (error) {
    res.status(500).json({ message: error });
    throw error;
  }
}

// IMAGE MANAGEMENT
async function manageImageUpload(req, res, form = utilities.newForm()) {
  form.parse(req, async (err, fields, files) => {
    // THROW ERROR
    if (err) {
      res.status(400).end(`Error parsing form data: ${err}`);
      return;
    }

    // CHECK IF FILES ARE IN AN ARRAY
    const imageFiles = Array.isArray(files.images)
      ? files.images
      : [files.images];

    // MOVE FILES TO UPLOAD DIR
    try {
      await utilities.uploadFiles(imageFiles, form.uploadDir, req.body.blogName);
      res.status(200).end("All files uploaded");
    } catch (error) {
      res.status(500).end(error);
    }
  });
}

async function modifyImages(req, res, form = utilities.newForm()) {
  form.parse(req, async (err, fields, files) => {
    // THROW ERROR
    if (err) {
      res.status(400).end(`Error parsing form data: ${err}`);
      return;
    }

    // CHECK IF FILES ARE IN AN ARRAY
    const imageFiles = Array.isArray(files.images)
      ? files.images
      : [files.images];

    // Adds images not in uploadedImgs
    try {
      await utilities.uploadFiles(imageFiles, form.uploadDir, req.body.blogName);
      res.status(200).end("All files uploaded");
    } catch (error) {
      res.status(500).end(error);
    }

    // removes images not in modifiedImages
    try {
      await utilities.removeFiles(fields.name, imageFiles, req.body.blogName, form.uploadDir);
      res.status(200).end("All files deleted");
    } catch (error) {
      res.status(500).end("Error deleting fileds");
    }
  });
}

async function manageDeleteImages(req, res, imgs, dir = "views/images") {
  const imgsToDelete = imgs;
  const uploadsPath = path.join(path.resolve(__dirname, ".."), `${dir}`);

  imgsToDelete.forEach((file) => {
    const fileToDelete = path.join(uploadsPath, file);
    fs.unlink(fileToDelete, (err) => {
      if (err) {
        res.status(500).end("Error deleting fileds");
      }
    });
  });
  res.status(200).end("All files uploaded");
}

// TEMPLATE MANAGEMENT
function fillTemplate(req, res, pageName, metaTitle) {
  const viewsDir = path.join(__dirname, "../views");
  const filePath = path.join(viewsDir, `${pageName}.html`);

  const stream = fs.createReadStream(filePath, "utf8");

  stream.on("error", (err) => {
    res.status(500).send("Error reading file");
  });

  stream.on("open", () => {
    let modifiedHTML = "";
    stream.on("data", (chunk) => {
      modifiedHTML += chunk
        .replace("{{top}}", components.top(metaTitle))
        .replace("{{hero}}", components.hero())
        .replace("{{bottom}}", components.bottom(`${pageName}.js`));
    });

    stream.on("end", () => {
      res.send(modifiedHTML);
    });
  });
}

module.exports = {
  logout,
  login,
  manageNewPost,
  manageUpdatePost,
  manageDeletePost,
  manageGetPostNames,
  manageGetPost,
  manageGetPosts,
  manageImageUpload,
  modifyImages,
  manageDeleteImages,
  fillTemplate,
};
