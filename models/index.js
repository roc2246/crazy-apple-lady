const path = require("path");
const { Transform } = require("stream");
const { MongoClient } = require("mongodb");
const utilities = require("../utilities/index");

// Load environment variables
require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});

// CONNECT
/**
 * Establishes a connection to the MongoDB database.
 * @param {MongoClient} MongoClientInstance - MongoClient instance to use (defaults to MongoClient).
 * @param {string} uri - MongoDB URI (defaults to process.env.MONGODB_URI).
 * @returns {Promise<{db: Db, client: MongoClient}>} Resolves with the database and client objects.
 * @throws {Error} If the connection fails.
 */
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
/**
 * Finds a user by their username.
 * @param {string} username - The username to search for.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<Object>} Resolves with the user object if found.
 * @throws {Error} If the user is not found or an error occurs during the search.
 */
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
/**
 * Creates a new user in the database.
 * @param {Object} data - The user data, including username and password.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<void>} Resolves when the user is successfully created.
 * @throws {Error} If the username is already taken or an error occurs.
 */
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
/**
 * Generates a unique post ID based on the highest existing ID.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<number>} Resolves with the next available post ID.
 */
async function generatePostID(connection = connectToDB) {
  const { db } = await connection();
  const collection = db.collection("posts");

  const posts = await collection.find().toArray();
  posts.sort((a, b) => a.id - b.id);
  const ID = posts.length > 0 ? posts[posts.length - 1].id + 1 : 1;
  return ID;
}

// CRUD
/**
 * Creates a new post in the database.
 * @param {Object} post - The post data to insert.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<void>} Resolves when the post is successfully inserted.
 * @throws {Error} If the post title already exists.
 */
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

/**
 * Updates an existing post in the database.
 * @param {Object} updatedPost - The updated post data.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<void>} Resolves when the post is successfully updated.
 * @throws {Error} If an error occurs during the update.
 */
async function updatePost(updatedPost, connection = connectToDB) {
  try {
    const { db } = await connection();
    const collection = db.collection("posts");
    const updates = {
      type: updatedPost.type,
      title: updatedPost.title,
      content: utilities.addPTags(updatedPost.content),
    };
    if (updatedPost.image) updates.image = updatedPost.image.map((img) => `./images/${img}`);

    await collection.findOneAndUpdate(
      { id: updatedPost.id },
      { $set: updates }
    );
  } catch (error) {
    console.error("Error while updating post:", error);
    throw error;
  }
}

/**
 * Deletes a post from the database by its ID.
 * @param {number} postID - The ID of the post to delete.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<void>} Resolves when the post is successfully deleted.
 * @throws {Error} If an error occurs during deletion.
 */
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

/**
 * Deletes all posts from the database.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<void>} Resolves when all posts are successfully deleted.
 * @throws {Error} If an error occurs during deletion.
 */
async function deleteAllPosts(postID, connection = connectToDB) {
  try {
    const { db } = await connection();
    const collection = db.collection("posts");

    await collection.deleteMany({});
  } catch (error) {
    console.error("Error while deleting posts:", error);
    throw error;
  }
}

/**
 * Retrieves posts from the database based on a match query and projection.
 * @param {Object} match - The match query to filter posts.
 * @param {Object} [project={ _id: 0 }] - The projection for fields to include/exclude.
 * @param {Function} connection - A function to connect to the database (defaults to connectToDB).
 * @returns {Promise<Object[]>} Resolves with an array of posts matching the query.
 * @throws {Error} If an error occurs while retrieving posts.
 */
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
