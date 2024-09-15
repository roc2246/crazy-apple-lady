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
  addPTags,
};
