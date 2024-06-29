const path = require("path");
const { Transform } = require("stream");
const { MongoClient } = require("mongodb");
const utilities = require("../utilities/index");
const { pipeline } = require("stream");

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

    const db = client.db("crazy-apple-lady");

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

    return user ? user : null;
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
    posts.sort((a, b) => a.id - b.id);

    const newPost = {
      id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
      type: post.type,
      title: post.title,
      image: post.image.map((img) => `./images/${img}`),
      content: post.content,
    };

    await collection.insertOne(newPost);
  } catch (error) {
    console.error("Error while adding post:", error);
    throw error;
  }
}

// Updates blogpost
async function updatePost(updatedPost) {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    const updates = {
      type: updatedPost.type,
      title: updatedPost.title,
      image: updatedPost.image,
      content: utilities.addPTags(updatedPost.content),
    };

    await collection.findOneAndUpdate(
      { id: updatedPost.id },
      { $set: updates }
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

    const cursor = collection.aggregate([
      { $match: { type: type } },
      { $project: { _id: 0, id: 1, title: 1 } },
    ]);

    const stream = cursor.stream();

    const pipeline = stream.pipe(
      new Transform({
        objectMode: true,
        transform: function (data, encoding, callback) {
          callback(null, data);
        },
      })
    );

    const namesAndIDs = await utilities.pipelineToPromise(pipeline);

    return namesAndIDs.length > 0 ? namesAndIDs : null;
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

// Gets posts
async function getPosts() {
  try {
    const { db } = await connectToDB();
    const collection = db.collection("posts");

    const cursor = collection.find();

    const stream = cursor.stream();

    const pipeline = stream.pipe(
      new Transform({
        objectMode: true,
        transform: function (data, encoding, callback) {
          callback(null, data);
        },
      })
    );

    const posts = await utilities.pipelineToPromise(pipeline);

    return posts.length > 0 ? posts : null;
  } catch (error) {
    console.error("Error while retrieving posts:", error);
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
  getPosts,
};
