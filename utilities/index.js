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

function validateArg(arg, dataType) {
  const isInvalid = {
    string: dataType === "string" && (typeof arg !== "string" || arg.trim().length === 0),
    object: dataType === "object" && (!arg || (Array.isArray(arg) && arg.length === 0))
  };

  if (isInvalid[dataType] || typeof arg !== dataType) {
    throw new Error(`Please make sure ${arg} is a valid ${dataType}`);
  }
}



async function uploadFiles(tempFiles, uploadDir, tag) {
  validateArg(tempFiles, "object")
  validateArg(uploadDir, "string")
  validateArg(tag, "string")
  
  const uploadFiles = fs.readdirSync(uploadDir)
  const uploadFilesSet = new Set(uploadFiles)

  tempFiles.forEach((file) => {
    try {
      const fileToUpload = `${tag}-${file.originalFileName}`;
      const oldPath = file.filepath;
      const newPath = path.join(uploadDir, fileToUpload);
      if (!uploadFilesSet.has(fileToUpload)) {
        fs.renameSync(oldPath, newPath);
      }
    } catch (error) {
      throw new Error(`Error saving one or more files 
      \n File: ${file.originalFilename} 
      \n Error: ${error}`);
    }
  });
}

async function removeFiles(uploads, serverPath, tag, localImgs = []) {
  const regex = new RegExp(`^${tag}-`);
  const blogImgs = uploads.filter((file) => regex.test(file));
  const tempFiles = localImgs.map((img) => `${tag}-${img}`);
  const tempFilesSet = new Set(tempFiles)

  blogImgs.forEach((file) => {
    const bool = localImgs.length > 0 ? !tempFilesSet.has(file) : file;
    try {
      if (bool) {
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

module.exports = {
  generateRandomString,
  addPTags,
  verifyCallback,
  newForm,
  uploadFiles,
  removeFiles,
};
