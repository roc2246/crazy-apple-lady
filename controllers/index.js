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

// hashString(inputString)
//   .then(hashedString => {
//     console.log('Hashed string:', hashedString);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// ___________________________________________________

// LOGOUT
/**
 * Logs out the user by destroying their session.
 * Clears the session data for the current user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.status(200).send("Successfully logged out");
    }
  });
}

// LOGIN
/**
 * Authenticates a user by comparing the provided password with the stored hash.
 * On successful authentication, a session is created for the user.
 * 
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object.
 */
async function login(req, res) {
  try {
    const sessionTimeout = 30 * 60 * 1000;

    const userExists = await models.findUser(req.body.username);
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!passwordMatch) throw new Error("Wrong password");

    const sessionId = utilities.generateRandomString(2);
    const currentTime = Date.now();

    req.session.username = req.body.username;
    req.session.lastAccessed = currentTime;
    req.session.sessionId = sessionId;
    req.session.expiresAt = currentTime + sessionTimeout;

    res.status(200).json({ message: "Login succeeded" });
  } catch (error) {
    res.status(401).json({ message: error.toString() });
  }
}

// CREATE USER
/**
 * Creates a new user after validating and hashing the user's password.
 * 
 * @param {Object} req - The request object containing the user's data.
 * @param {Object} res - The response object.
 * @param {Function} model - The model function used to create the user (defaults to `models.createUser`).
 */
async function manageNewUser(req, res, model = models.createUser) {
  try {
    utilities.verifyCallback(model);
    const userData = req.body;
    await model(userData);
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(409).json({ message: error.toString() });
  }
}

// CREATE, UPDATE, DELETE POST
/**
 * Adds a new post to the database.
 * 
 * @param {Object} req - The request object containing the post data.
 * @param {Object} res - The response object.
 * @param {Function} model - The model function used to create the post (defaults to `models.newPost`).
 */
async function manageNewPost(req, res, model = models.newPost) {
  try {
    utilities.verifyCallback(model);
    const post = req.body;
    await model(post);
    res.status(201).json({ message: "Post added" });
  } catch (error) {
    res.status(401).json({ message: error.toString() });
  }
}

/**
 * Updates an existing post in the database.
 * 
 * @param {Object} req - The request object containing the updated post data.
 * @param {Object} res - The response object.
 * @param {Object} updatedPost - The updated post data.
 * @param {Function} model - The model function used to update the post (defaults to `models.updatePost`).
 */
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
    res.status(500).json({ message: error.toString() });
    throw error;
  }
}

/**
 * Deletes a post from the database by its ID.
 * 
 * @param {Object} req - The request object containing the post ID.
 * @param {Object} res - The response object.
 * @param {string} id - The ID of the post to be deleted.
 * @param {Function} model - The model function used to delete the post (defaults to `models.deletePost`).
 */
async function manageDeletePost(req, res, id, model = models.deletePost) {
  try {
    utilities.verifyCallback(model);
    await model(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error while deleting post:", error);
    res.status(500).json({ message: error.toString() });
    throw error;
  }
}

// DATA RETRIEVAL
/**
 * Retrieves a list of post names of a specific type.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} type - The type of posts to retrieve.
 * @param {Function} model - The model function used to retrieve posts (defaults to `models.postRetrieval`).
 */
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

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      throw Error("No Posts available");
    }
  } catch (error) {
    res.status(404).json({ message: error.toString() });
    console.log(error);
  }
}

/**
 * Retrieves a specific post by its ID.
 * 
 * @param {Object} req - The request object containing the post ID.
 * @param {Object} res - The response object.
 * @param {string} id - The ID of the post to retrieve.
 * @param {Function} model - The model function used to retrieve the post (defaults to `models.postRetrieval`).
 */
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

/**
 * Retrieves all posts.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} model - The model function used to retrieve posts (defaults to `models.postRetrieval`).
 */
async function manageGetPosts(req, res, model = models.postRetrieval) {
  try {
    utilities.verifyCallback(model);
    const posts = await model({});
    res.status(200).json(!posts ? new Error("No posts available") : posts);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
    throw error;
  }
}

// IMAGE MANAGEMENT
/**
 * Handles image upload via a form.
 * Moves uploaded files to the designated directory.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} form - The form instance used for file parsing (defaults to `utilities.newForm()`).
 */
async function manageImageUpload(req, res, form = utilities.newForm()) {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).end(`Error parsing form data: ${err}`);
      return;
    }

    // const tempFiles = Array.isArray(files.image) ? files.image : [files.image];

    try {
      // await utilities.uploadFiles(tempFiles, form.uploadDir, fields.tag[0]);
      res.status(200).json({ message: "All files uploaded" });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  });
}

/**
 * Modifies uploaded images: adds new ones and removes old ones.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} form - The form instance used for file parsing (defaults to `utilities.newForm()`).
 */
async function modifyImages(req, res, form = utilities.newForm()) {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).end(`Error parsing form data: ${err}`);
      return;
    }

    const tempFiles = Array.isArray(files.image) ? files.image : [files.image];

    try {
      await utilities.uploadFiles(tempFiles, form.uploadDir, fields.tag[0]);
      res.status(200).json({ message: "All files updated" });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }

    try {
      await utilities.removeFiles(form.uploadDir, fields.tag[0], tempFiles);
    } catch (error) {
      res.status(500).end("Error deleting files");
    }
  });
}

/**
 * Deletes images from the upload directory.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Object} form - The form instance used for file parsing (defaults to `utilities.newForm()`).
 */
async function manageDeleteImages(req, res, form = utilities.newForm()) {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).end(`Error parsing form data: ${err}`);
      return;
    }

    const tempFiles = Array.isArray(files.image) ? files.image : [files.image];

    try {
      await utilities.removeFiles(form.uploadDir, fields.tag[0], tempFiles);
      res.status(200).json({ message: "All files deleted" });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  });
}

// TEMPLATE MANAGEMENT
/**
 * Fills a template with dynamic content for a specific page.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} pageName - The name of the page to load.
 * @param {string} metaTitle - The title of the page's meta information.
 */
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
  manageNewUser,
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
