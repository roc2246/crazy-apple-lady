const crypto = require("crypto");
const fs = require('fs').promises;

function generateRandomString(length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex") // Convert to hexadecimal representation
      .slice(0, length); // Trim to desired length
  }

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

  async function uploadImage(imageData) {
    try {
      // For local storage
      const imagePath = `uploads/${Date.now()}_image.jpg`; // Assuming it's a JPG image
      // Write the image buffer to the specified path asynchronously
      await fs.writeFile(imagePath, imageData);
  
      return imagePath;
    } catch (error) {
      console.error("Error while uploading image:", error);
      throw error;
    }
  }

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
    uploadImage,
    addPTags
  }