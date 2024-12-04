const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const formidable = require("formidable");
const bcrypt = require("bcrypt");
const models = () => require('../models/index');

// LOGINS
/**
 * Generates a random hexadecimal string of the given length.
 * @param {number} length - The length of the desired random string.
 * @returns {string} A random string in hexadecimal format.
 * @throws {Error} If the input length is not a positive number.
 */
function generateRandomString(length) {
  if (typeof length !== "number" || length <= 0) {
    throw new Error("Length must be a positive number.");
  }
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

/**
 * Hashes a given string using bcrypt.
 * @param {string} inputString - The string to hash.
 * @param {number} [saltRounds=10] - The cost factor for hashing.
 * @returns {Promise<string>} The hashed string.
 * @throws {Error} If hashing fails.
 */
async function hashString(inputString, saltRounds = 10) {
  try {
    return await bcrypt.hash(inputString, saltRounds);
  } catch (error) {
    throw error;
  }
}

// TEXT FORMATTING
/**
 * Adds paragraph tags to a given text, splitting at double line breaks.
 * @param {string} text - The input text.
 * @returns {string} The formatted text wrapped in <p> tags.
 * @throws {Error} If the input is not a string.
 */
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
/**
 * Verifies if the provided callback is a function.
 * @param {function} callback - The callback to verify.
 * @throws {Error} If the input is not a function.
 */
function verifyCallback(callback) {
  if (typeof callback !== "function") {
    throw new Error("Invalid Function");
  }
}

// FORM MANAGEMENT
/**
 * Creates a new formidable form instance.
 * @param {Object} [library=formidable.IncomingForm] - The formidable library.
 * @param {string} [dir="views/images"] - The directory for uploads.
 * @returns {Object} The configured form instance.
 * @throws {Error} If the directory is not a string.
 */
function newForm(library = formidable.IncomingForm, dir = "views/images") {
  if (typeof dir !== "string") throw new Error("dir must be a string");
  const form = new library();
  form.uploadDir = path.join(path.resolve(__dirname, ".."), dir);
  form.keepExtensions = true;
  form.maxFileSize = 2 * 1024 * 1024 * 1024;

  return form;
}

/**
 * Validates an argument against the expected data type.
 * @param {*} arg - The argument to validate.
 * @param {string} dataType - The expected data type ("string", "object", or "array").
 * @throws {Error} If the argument is not valid for the expected type.
 */
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

// FILE MANAGEMENT
/**
 * Uploads temporary files to a specified directory with a given tag.
 * @param {Array} tempFiles - The files to upload.
 * @param {string} uploadDir - The destination directory.
 * @param {string} tag - The prefix tag for file names.
 * @returns {Promise<Object>} A summary of successfully uploaded files.
 * @throws {Error} If any file operation fails unexpectedly.
 */
async function uploadFiles(tempFiles, uploadDir, tag) {
  validateArg(tempFiles, "array");
  validateArg(uploadDir, "string");
  validateArg(tag, "string");

  const existingFiles = new Set(await fs.readdir(uploadDir));
  const results = { successes: [], failures: [] };

  await Promise.all(
    tempFiles.map(async (file) => {
      try {
        const fileToUpload = `${tag.replace(/\s+/g, '')}-${file.originalFilename.replace(/\s+/g, '')}`;
        const oldPath = file.filepath;
        const newPath = path.join(uploadDir, fileToUpload);

        if (!existingFiles.has(fileToUpload)) {
          await fs.rename(oldPath, newPath);
          await models.uploadImg(newPath)
          results.successes.push(fileToUpload);
        } else {
          await fs.unlink(oldPath);
        }
      } catch (error) {
        results.failures.push({
          file: file.originalFilename,
          error: error.message,
        });
      }
    })
  );

  return results;
}

/**
 * Removes files matching a tag or not in the tempFiles array.
 * @param {string} uploadDir - The directory to search for files.
 * @param {string} tag - The tag prefix for file names.
 * @param {Array} [tempFiles=[]] - The list of files to preserve.
 * @returns {Promise<void>}
 * @throws {Error} If file operations fail.
 */
async function removeFiles(uploadDir, tag, tempFiles = []) {
  validateArg(uploadDir, "string");
  validateArg(tag, "string");
  validateArg(tempFiles, "array");

  if (tempFiles.every((file) => file)) {
    tempFiles = tempFiles.map((file) => `${tag}-${file.originalFilename.replace(/\s+/g, '')}`);
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
      console.error(`Error deleting file ${file}: ${error.message}`);
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
