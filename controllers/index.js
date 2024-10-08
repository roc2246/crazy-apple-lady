const path = require("path");
const formidable = require("formidable");
const models = require("../models/index");
const utilities = require("../utilities/index");
const components = require("../components/index");
const fs = require("fs");

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
async function manageNewPost(req, res) {
  try {
    const post = req.body;
    await models.newPost(post);
    res.status(201).json({ message: "Post added" });
  } catch (error) {
    res.status(401).json({ message: error });
    throw error;
  }
}

async function manageUpdatePost(req, res, updatedPost) {
  try {
    await models.updatePost(updatedPost);
    res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost: updatedPost });
  } catch (error) {
    res.status(500).json({ message: error });
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

// DATA RETRIEVAL
async function manageGetPostNames(req, res, type) {
  try {
    const match = { type: type };
    const project = { _id: 0, id: 1, title: 1 };
    const posts = await models.postRetrieval(match, project);
    if (posts.length > 0) res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error });
    console.log(error);
  }
}

async function manageGetPost(req, res, id) {
  try {
    const postData = await models.postRetrieval({ id: id });
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

async function manageGetPosts(req, res) {
  try {
    const posts = await models.postRetrieval({});
    res.status(200).json(!posts ? { message: "no posts available" } : posts);
  } catch (error) {
    res.status(500).json({ message: error });
    throw error;
  }
}

function manageImageUpload(req, res) {
  const form = new formidable.IncomingForm();

  form.uploadDir = path.join(path.resolve(__dirname, ".."), "views/images");
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      res.status(400).end("Error parsing form data");
      return;
    }

    const imageFiles = Array.isArray(files.images)
      ? files.images
      : [files.images];

    let processedCount = 0;
    const totalFiles = imageFiles.length;

    imageFiles.forEach((file) => {
      const oldPath = file.filepath;
      const newPath = path.join(form.uploadDir, file.originalFilename);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`Error saving file ${file.originalFilename}:`, err);
          res.status(500).end("Error saving one or more files");
          return;
        }

        processedCount++;
        if (processedCount === totalFiles) {
          res.status(200).json({
            status: "success",
            files: imageFiles.map((file) => file.originalFilename),
          });
        }
      });
    });
  });
}

function modifyImages(req, res) {
  const form = new formidable.IncomingForm();
  // const for holding modified image list
  const modifiedImgs = form.parse(req, (err, fields, files) => {
    return [fields.name];
  });
  // const for holding images
  const uploadedImgsPath = path.join(path.resolve(__dirname, ".."), "views/images");
  const uploadedImgs = fs.readdirSync(uploadedImgsPath);

  // loop through  images
  for(let x = 0; x < uploadedImgs.length; x++){
    if(!modifiedImgs.includes(uploadedImgs[x])){
      fs.unlink(uploadedImgs[x], (err) => {
        if (err) {
          console.error('Error removing file:', err);
        } else {
          console.log('File removed successfully');
        }
      });
    }
  }

  // loop thgrough modifiedimages
  for(let x = 0; x < modifiedImgs.length; x++){
    if(!uploadedImgs.includes(modifiedImgs[x])){
      fs.rename(oldPath, newPath, (err) => { /* Fix this */
        if (err) {
          console.error(`Error saving file ${file.originalFilename}:`, err);
          res.status(500).end("Error saving one or more files");
          return;
        }
      });
    }
  }
}

// CREATE FUNCTION FOR REMOVING IMAGES HERE

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
  fillTemplate,
};
