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

async function uploadFiles(files, uploadDir, blogName) {
  files.forEach((file) => {
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

async function removeFilesNotInUploads(uploadDir, blogName) {
  const regex = new RegExp(`^${blogName}-`);
  const filesWPrefix = fs
    .readdirSync(uploadDir)
    .map((file) => regex.test(file));

  filesWPrefix.forEach((file) => {
    try {
      if (!uploadDir.includes(file)) {
        fs.unlinkSync(path.join(uploadDir, file));
      }
    } catch (error) {
      throw new Error(`Error saving one or more files 
        \n File: ${file.originalFilename} 
        \n Error: ${error}`);
    }
  });
}

async function removeFiles(files) {
  files.forEach((file) => {
    try {
      const fileToDelete = path.join(form.uploadDir, file);

      fs.unlinkSync(fileToDelete);
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
