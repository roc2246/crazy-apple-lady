const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

// LOGINS
function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal representation
    .slice(0, length); // Trim to desired length
}

// TEXT FORMATTING
function addPTags(text) {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  text = text.replace(/\n\n+/g, '</p><p class="post__paragraph">');
  if (!text.startsWith('<p class="post__paragraph">')) {
    text = '<p class="post__paragraph">' + text;
  }
  if (!text.endsWith("</p>")) {
    text += "</p>";
  }
  return text;
}

// ERROR HANDLING
function verifyCallback(callback) {
  if (typeof callback !== "function") {
    throw new Error("Invalid Function");
  }
}

// FORM MANAGEMENT
function newForm(
  library = new formidable.IncomingForm(),
  dir = "views/images"
) {
  const form = library();
  form.uploadDir = path.join(path.resolve(__dirname, ".."), `${dir}`);
  form.keepExtensions = true;

  return form;
}

async function uploadFiles(localFiles, uploadDir, blogName) {
  localFiles.forEach((file) => {
    try {
      const fileToUpload = `${blogName}-${file.originalFileName}`;
      const oldPath = file.filepath;
      const newPath = path.join(uploadDir, fileToUpload);
      if (!uploadDir.includes(fileToUpload)) {
        fs.renameSync(oldPath, newPath);
      }
    } catch (error) {
      throw new Error(`Error saving one or more files 
      \n File: ${file.originalFilename} 
      \n Error: ${error}`);
    }
  });
}

async function removeFilesNotInUploads(
  uploads,
  serverPath,
  localImgs,
  blogName
) {
  const regex = new RegExp(`^${blogName}-`);
  const blogImgs = uploads.filter((file) => regex.test(file));
  const localFiles = localImgs.map((img) => `${blogName}-${img}`);

  blogImgs.forEach((file) => {
    try {
      if (!localFiles.includes(file)) {
        const pathToDelete = path.join(serverPath, file);
        fs.unlinkSync(pathToDelete);
      }
    } catch (error) {
      throw new Error(`Error saving one or more files 
        \n File: ${file.originalFilename} 
        \n Error: ${error}`);
    }
  });
}

async function removeFiles(serverImgs, serverPath, blogName) {
  serverImgs.forEach((file) => {
    try {
      const fileToDelete = path.join(serverPath, file);
      const regex = new RegExp(`^${blogName}-`);
      if (regex.test(file)) {
        fs.unlinkSync(fileToDelete);
      }
    } catch (error) {
      throw new Error(`Error deleting files
        \n File: ${file.originalFilename} 
        \n Error: ${error}`);
    }
  });
}

module.exports = {
  generateRandomString,
  addPTags,
  verifyCallback,
  newForm,
  uploadFiles,
  removeFilesNotInUploads,
  removeFiles,
};
