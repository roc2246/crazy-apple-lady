const path = require("path");
const { Transform } = require("stream");
const { MongoClient } = require("mongodb");
const utilities = require("../utilities/index");

require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});

// CONNECT
async function connectToDB(
  MongoClientInstance = MongoClient,
  uri = process.env.MONGODB_URI
) {
  let client;

  try {
    client = new MongoClientInstance(uri);
    await client.connect();

    return { db: client.db("crazy-apple-lady"), client };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// LOGIN
async function findUser(username, connection = connectToDB) {
  try {
    const { db } = await connection();
    const collection = db.collection("users");
    const query = { username };
    const user = await collection.findOne(query);
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw error;
  }
}

// NEW USER
async function createUser(data, connection = connectToDB) {
  try {
    const { db } = await connection();
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ username: data.username });
    const newUser = {
      username: data.username,
      password: await utilities.hashString(data.password),
    };
    if (!existingUser) {
      await collection.insertOne(newUser);
    } else {
      throw new Error("Username already taken");
    }
  } catch (error) {
    throw error;
  }
}

// UTIL
async function generatePostID(connection = connectToDB) {
  const { db } = await connection();
  const collection = db.collection("posts");

  const posts = await collection.find().toArray();
  posts.sort((a, b) => a.id - b.id);
  const ID = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
  return ID;
}

// CRUD
async function newPost(post, connection = connectToDB) {
  try {
    const { db } = await connection();
    const collection = db.collection("posts");

    const newPost = {
      id: post.id ? post.id : await generatePostID(),
      type: post.type,
      title: post.title,
      image: post.image.map((img) => `./images/${img}`),
      content: post.content,
    };
    const titleExists = await collection.findOne({ title: post.title });
    if (!titleExists) {
      await collection.insertOne(newPost);
    } else {
      throw new Error("Post name already exists");
    }
  } catch (error) {
    throw error;
  }
}

// Updates blogpost
async function updatePost(updatedPost, connection = connectToDB) {
  try {
    const { db } = await connection();
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
async function deletePost(postID, connection = connectToDB) {
  try {
    const { db } = await connection();
    const collection = db.collection("posts");

    await collection.findOneAndDelete({ id: postID });
  } catch (error) {
    console.error("Error while deleting post:", error);
    throw error;
  }
}

// Retrieve Posts
async function postRetrieval(
  match,
  project = { _id: 0 },
  connection = connectToDB
) {
  try {
    const { db } = await connection();
    const collection = db.collection("posts");

    const params = [{ $match: match }, { $project: project }];
    const cursor = collection.aggregate(params);

    const stream = cursor.stream();
    const transformParam = {
      objectMode: true,
      transform: (data, encoding, cb) => {
        cb(null, data);
      },
    };

    const transformStream = new Transform(transformParam);
    const pipeline = stream.pipe(transformStream);
    const data = await new Promise((resolve, reject) => {
      const data = [];
      pipeline.on("data", (chunk) => data.push(chunk));
      pipeline.on("end", () => resolve(data));
      pipeline.on("error", reject);
    });

    return data;
  } catch (error) {
    console.error("Error while retrieving post names:", error);
    throw error;
  }
}

module.exports = {
  connectToDB,
  createUser,
  findUser,
  generatePostID,
  newPost,
  updatePost,
  deletePost,
  postRetrieval,
};
