const path = require("path");
const models = require("../models/index");
const utilities = require("../utilities/index");

const bcrypt = require("bcrypt");

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

// const inputString = 'donna2246';
// hashString(inputString)
//   .then(hashedString => {
//     console.log('Hashed string:', hashedString);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// ___________________________________________________

// Set the session timeout duration in milliseconds (e.g., 30 minutes)
const sessionTimeout = 30 * 60 * 1000;

function logout(req, res) {
  // Destroy the session or clear specific session properties
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.status(302).send("Succesfully logged out");
      console.log("Logged out");
    }
  });
}

async function login(req, res) {
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

async function manageNewPost(req, res) {
  try {
    const post = req.body;
    await models.newPost(post);
    res.status(201).json({ message: "Post added" });
  } catch (error) {
    console.error("Error while adding post:", error);
    throw error;
  }
}

async function manageUpdatePost(req, res, id, update) {
  try {
    await models.updatePost(id, update);
    res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost: update });
  } catch (error) {
    console.error("Error while updating post:", error);
    throw error;
  }
}

async function manageDeletePost(req, res, id) {
  try {
    await models.deletePost(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error while deleting post:", error);
    throw error;
  }
}

async function manageGetPostNames(req, res) {
  try {
    const posts = await models.getPostNames();
    res.status(200).json(!posts ? { message: "no posts available" } : posts);
  } catch (error) {
    console.error("Error while retrieving post names:", error);
    throw error;
  }
}

async function manageGetPost(req, res) {
  try {
    const id = req.body.id;
    await models.getPost(id);
  } catch (error) {
    console.error("Error while retrieving post names:", error);
    throw error;
  }
}

module.exports = {
  logout,
  login,
  manageNewPost,
  manageUpdatePost,
  manageDeletePost,
  manageGetPostNames,
  manageGetPost,
};
