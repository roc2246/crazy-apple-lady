const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");

// LOGINS
function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // Convert to hexadecimal representation
    .slice(0, length); // Trim to desired length
}

// DATA UPLOADING
function pipelineToPromise(pipeline) {
  return new Promise((resolve, reject) => {
    const data = [];
    pipeline.on("data", (chunk) => data.push(chunk));
    pipeline.on("end", () => resolve(data));
    pipeline.on("error", reject);
  });
}

function generateParams(match, project) {
  let params;
  if (!project) {
    params = [{ $match: match }];
  } else {
    params = [{ $match: match }, { $project: project }];
  }
  return params;
}

function checkDataLength(data) {
  if (data.length > 0) {
    return data;
  } else {
    throw new Error("Post not found");
  }
}

function processImageUploads(res, files, uploadDir) {
  const imageFiles = [files.images];
  let processedCount = 0;

  imageFiles.forEach((file) => {
    const oldPath = file.filepath;
    const newPath = path.join(uploadDir, file.originalFilename);

    fs.rename(oldPath, newPath, (err) => {
      try {
        processedCount++;
        processedCount === imageFiles.length ? res.status(200).end() : null;
      } catch (error) {
        res.status(500).json({ message: err });
        return;
      }
    });
  });
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
module.exports = {
  generateRandomString,
  pipelineToPromise,
  generateParams,
  checkDataLength,
  processImageUploads,
  addPTags,
};
