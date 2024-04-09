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

  module.exports = {
    generateRandomString,
    pipelineToPromise,
    uploadImage
  }