import { vi, describe, it, expect } from "vitest";
import { connectToDB, deletePost, findUser, newPost, postRetrieval, updatePost } from ".";
import { addPTags } from "../utilities";
import { Readable } from "stream"; // Import Readable for creating a stream


let db = [];

const mockPosts = [
  {
    id: 0,
    type: "plantyLife",
    title: "Plant Blog Post",
    image: ["plant.jpg"],
    content: "This is a post about plants.",
  },
  {
    id: 1,
    type: "mushroomBlog",
    title: "Mushroom Blog Post",
    image: ["mushroom.jpg"],
    content: "This is a post about mushrooms.",
  },
];


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
const mockFindOneAndDelete = vi.fn((id) => db.splice(id))

const mockAggregate = vi.fn((pipeline) => {
  // If pipeline contains $match
  // Loop through mockdb
  // return data with matches


  // If pipeline contains $project
  // loop through filtered mock db
  // filter data so only properties of 1 appear and properties of zero dissapear
});

const mockCollection = {
  findOne: mockFindOne,
  insertOne: mockInsertOne,
  findOneAndUpdate: mockFindOneAndUpdate,
  findOneAndDelete: mockFindOneAndDelete,
  aggregate: mockAggregate
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

describe("deletePost", ()=>{
  it("should delete post", async()=>{
    await deletePost(0, mockConnectToDB)
    expect(db.length).toBe(0)
  })
  it("should throw error", async()=>{
    const result = await deletePost(100, mockConnectToDB)
    expect(result).toThrowError
  })
})

describe("retrieving post names", ()=>{
  it("should retrieve planty life posts", async ()=>{
    const match = {type: 'plantyLife'}
    const project = {_id: 0, id: 1, title: 1}

    const results = await postRetrieval(match, project , mockConnectToDB)
     // Adjust the expected result to match the actual structure you expect
     const expectedResults = [
      {
        id: 0,
        title: "Plant Blog Post"
      },
    ];

    expect(results).toEqual(expectedResults); // Use toEqual to match the expected structure
  })
  it("should retrieve mushroom blog posts", async ()=>{
    const match = {type: 'mushroomBlog'}
    const project = {_id: 0, id: 1, title: 1}

    const results = await postRetrieval(match, project , mockConnectToDB)
     // Adjust the expected result to match the actual structure you expect
     const expectedResults = [
      {
        id: 1,
        title: "Mushroom Blog Post"
      },
    ];

    expect(results).toEqual(expectedResults); // Use toEqual to match the expected structure
  })
})

// describe("generatePostID", () => {
//   // Wait untill new post is created
// });
