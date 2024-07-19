const crypto = require("crypto");
const fs = require('fs').promises;
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

  function manageImageUploads(file, form, processedCount, totalFiles){
    const oldPath = file.filepath;
    const newPath = path.join(form.uploadDir, file.originalFilename);

    fs.rename(oldPath, newPath, err => {
      if (err) {
        console.error(`Error saving file ${file.originalFilename}:`, err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error saving one or more files');
        return;
      }

      processedCount++;
      if (processedCount === totalFiles) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', files: imageFiles.map(file => file.originalFilename) }));
      }
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
    manageImageUploads,
    addPTags
  }