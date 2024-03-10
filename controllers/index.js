const path = require("path");
const models = require("../models/index");

require("dotenv").config({
    path: path.join(__dirname, "../config/.env"),
  });
  
  // FOR GENERATING PASSWORD__________________________________
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
  
  // const inputString = 'donna2246';
  // hashString(inputString)
  //   .then(hashedString => {
  //     console.log('Hashed string:', hashedString);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // ___________________________________________________
  
  // Set the session timeout duration in milliseconds (e.g., 30 minutes)
  const sessionTimeout = 30 * 60 * 1000;

  function logout(req, res) {
    // Destroy the session or clear specific session properties
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      } else {
        // Redirect to the login page after successful logout
        res.redirect("/login"); // Adjust the path to your login route
      }
    });
  }