const crypto = require("crypto");

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

  module.exports = {
    generateRandomString,
    pipelineToPromise
  }