const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const formidable = require("formidable");
const bcrypt = require("bcrypt");

// LOGINS
function generateRandomString(input) {
  if (typeof input !== "string") {
    throw Error("Input must be string.");
  }
  input = input.length;
  return crypto
    .randomBytes(Math.ceil(input / 2))
    .toString("hex") // Convert to hexadecimal representation
    .slice(0, input); // Trim to desired length
}

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
function newForm(library = formidable.IncomingForm, dir = "views/images") {
  const form = new library();
  form.uploadDir = path.join(path.resolve(__dirname, ".."), `${dir}`);
  form.keepExtensions = true;
  form.maxFileSize = 2 * 1024 * 1024 * 1024;

  return form;
}

function validateArg(arg, dataType) {
  const isInvalid = {
    string:
      dataType === "string" &&
      (typeof arg !== "string" || arg.trim().length === 0),
    object:
      dataType === "object" &&
      (!arg || (Array.isArray(arg) && arg.length === 0)),
    array: dataType === "array" && !Array.isArray(arg),
  };

  if (isInvalid[dataType]) {
    throw new Error(`Expected a valid ${dataType}, but received ${arg}`);
  }
}

async function uploadFiles(tempFiles, uploadDir, tag) {
  validateArg(tempFiles, "array");
  validateArg(uploadDir, "string");
  validateArg(tag, "string");

  const uploadFiles = await fs.readdir(uploadDir);
  const uploadFilesSet = new Set(uploadFiles);

  for (const file of tempFiles) {
    try {
      const fileToUpload = `${tag}-${file.originalFilename}`;
      const oldPath = file.filepath;
      const newPath = path.join(uploadDir, fileToUpload);

      if (!uploadFilesSet.has(fileToUpload)) {
        await fs.rename(oldPath, newPath);
      } else {
        await fs.unlink(oldPath);
      }
    } catch (error) {
      throw new Error(
        `Error saving file ${file.originalFilename} from ${file.filepath} to ${newPath}. 
        \nError: ${error.message}`
      );
    }
  }
}

async function removeFiles(uploadDir, tag, tempFiles = []) {
  validateArg(uploadDir, "string");
  validateArg(tag, "string");
  validateArg(tempFiles, "array");
  if(!tempFiles.includes(undefined)){
    tempFiles = tempFiles.map((file) => `${tag}-${file.originalFilename}`)
  }

  const uploadFiles = await fs.readdir(uploadDir);
  
  const tempFileSet = new Set(tempFiles);
  const regex = new RegExp(`^${tag}-`);

  const filesToDelete = uploadFiles.filter((file) =>
    tempFiles.length > 0 ? !tempFileSet.has(file) : regex.test(file)
  );

  for (const file of filesToDelete) {
    try {
      const pathToDelete = path.join(uploadDir, file);
      await fs.unlink(pathToDelete);
    } catch (error) {
      throw new Error(`Error deleting file: ${file} \n Error: ${error}`);
    }
  }
}

module.exports = {
  generateRandomString,
  hashString,
  addPTags,
  verifyCallback,
  newForm,
  uploadFiles,
  removeFiles,
};
