const crypto = require("crypto");

function generateRandomString(length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex") // Convert to hexadecimal representation
      .slice(0, length); // Trim to desired length
  }

  module.exports = {
    generateRandomString
  }