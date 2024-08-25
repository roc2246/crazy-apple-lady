import { vi, describe, it, expect } from "vitest";
import { connectToDB, findUser, newPost, updatePost } from ".";
import { addPTags } from "../utilities";

let db = [];

// Create a mock for the connectToDB function
const mockConnectToDB = vi.fn();

// Create a mock for the MongoDB collection
const mockFindOne = vi.fn();
const mockInsertOne = vi.fn((post) => (db = [...db, post]));
const mockFindOneAndUpdate = vi.fn(({id}, update) => {
  
  update['$set'].id = id
  update = update['$set']

  db[id].id = id;
  db[id].type = update.type || db[id].type;
  db[id].title = update.title || db[id].title;
  db[id].image = update.image || db[id].image;
  db[id].content = update.content || db[id].content;
});
const mockCollection = {
  findOne: mockFindOne,
  insertOne: mockInsertOne,
  findOneAndUpdate: mockFindOneAndUpdate,
};

// Create a mock for the database instance
const mockDb = { collection: vi.fn(() => mockCollection) };

// Create a mock return value for connectToDB
mockConnectToDB.mockResolvedValue({ db: mockDb });


describe("newPost", () => {
  const post = {
    id: 0,
    type: "plantyLife",
    title: "TEST",
    image: ["test.jpg"],
    content: "TEST",
  };
  it("should add new post", async () => {
    const priorLength = db.length;
    await newPost(post, mockConnectToDB);
    expect(db.length).toBeGreaterThan(priorLength);
  });
});

describe("updatePost", () => {
  it("should update post", async () => {
    const updatedPost = {
      id: 0,
      type: "mushroomBlog",
      title: "test2",
      image: ["test.jpg"],
      content: addPTags("TEST1212"),
    };
    await updatePost(updatedPost, mockConnectToDB);
    const newPost = db[0];
    expect(newPost).toEqual(updatedPost);
  });
});

// describe("generatePostID", () => {
//   // Wait untill new post is created
// });
