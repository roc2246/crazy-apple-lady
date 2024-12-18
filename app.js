const express = require("express");
const app = express();
const path = require("path");
const api = require("./routes/api");
const templates = require("./routes/templates");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Imports config files
require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});


// Configure body parser limits
app.use(express.json({ limit: "2gb" })); // Increase JSON body limit if needed
app.use(express.urlencoded({ limit: "2gb", extended: true }));

// Configures express session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Replace with your MongoDB connection string
  })
);

// Set up middleware for static files (CSS, JS, images, etc.)
app.use(express.static("views"));

// Sets up routes
app.use("/api", api);
app.use("/", templates)


// Start the server
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Dashboard running on http://localhost:${port}/dashboard`);
});
