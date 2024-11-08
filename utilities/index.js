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
  // CREATE NEW FORM OBJECT
  const form = library();

  // SET PARAMETERS FOR FILES TO UPLOAD
  form.uploadDir = path.join(path.resolve(__dirname, ".."), `${dir}`);
  form.keepExtensions = true;

  return form;
}

async function moveFiles(files, uploads) {
  files.forEach((file) => {
    try {
      const oldPath = file.filepath;
      const newPath = path.join(uploads, file.originalFilename);
      if (!file.originalFilename.includes(file)) {
        fs.renameSync(oldPath, newPath);
      }
    } catch (error) {
      throw new Error(`Error saving one or more files 
      \n File: ${file.originalFilename} 
      \n Error: ${error}`);
    }
  });
}

async function removeFiles(files, imageFiles) {
  files.forEach((file) => {
    try {
      const fileToDelete = path.join(form.uploadDir, file);

      if (!imageFiles.includes(file)) {
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
  moveFiles,
  removeFiles
};
