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
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    const posts = await collection.find().toArray();
    const id = posts.length > 0 ? posts.length + 1 : 1;

    const newPost = {
      id: id,
      type: post.type,
      title: post.title,
      image: post.image,
      content: post.content,
    };

    await collection.insertOne(newPost);
  } catch (error) {
    console.error("Error while adding post:", error);
    throw error;
  }
}

// Updates blogpost
async function updatePost(postID, update) {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    await collection.findOneAndUpdate(
      { id: postID },
      { $set: { content: update } }
    );
  } catch (error) {
    console.error("Error while updating post:", error);
    throw error;
  }
}

// Deletes blogpost
async function deletePost(postID) {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    await collection.findOneAndDelete({ id: postID });
  } catch (error) {
    console.error("Error while deleting post:", error);
    throw error;
  }
}

// Retrieve Post Names
async function getPostNames(type) {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    const namesAndIDs = await collection
      .aggregate([
        { $match: { type: type } },
        { $project: { _id: 0, id: 1, title: 1 } },
      ])
      .toArray();

    return namesAndIDs.length > 0 ? namesAndIDs : null; // Return null when no posts are available
  } catch (error) {
    console.error("Error while retrieving post names:", error);
    throw error;
  }
}

// Gets post
async function getPost(postID) {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    const post = await collection.find({ id: postID }).toArray();

    return post;
  } catch (error) {
    console.error("Error while retrieving post names:", error);
    throw error;
  }
}

// Model For finding posts

module.exports = {
  findUser,
  newPost,
  updatePost,
  deletePost,
  getPostNames,
  getPost,
};
