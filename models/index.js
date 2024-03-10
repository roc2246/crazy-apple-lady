const path = require("path");

const { MongoClient } = require("mongodb");

require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});

// Create a function to connect to the MongoDB database
let client;

async function connectToDB() {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
    }

    const db = client.db("crazy-apply-lady");

    return { db: db, client: client };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Login user
async function findUser(username) {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("users");

    const query = { username: username };

    const user = await collection.findOne(query);

    if (user) {
      console.log(`User found`);
      return user; // Return the user object
    } else {
      console.log(`User not found`);
      return null; // Return null if user not found
    }
  } catch (error) {
    console.error("Error while finding user:", error);
    throw error;
  }
}

// Add blogpost
async function newPost(post) {
  try {
    // Connect to db
    // store collection

    // Store post in object

    // Add post


  } catch (error) {
    console.error("Error while adding post:", error);
    throw error;
  }
}

// Updates blogpost
async function updatePost(postID, update) {
    try {
      // Connect to db
      // store collection
  
      // query for post id
  
      // update post content
  
  
    } catch (error) {
      console.error("Error while updating post:", error);
      throw error;
    }
  }

  // Updates blogpost
async function deletePost(postID) {
    try {
      // Connect to db
      // store collection
  
      // query for post id
  
      // delete post 
  
  
    } catch (error) {
      console.error("Error while deleting post:", error);
      throw error;
    }
  }

  module.exports = {
    findUser,
    newPost,
    updatePost,
    deletePost
  }