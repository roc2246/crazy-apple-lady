import { vi, describe, it, expect } from "vitest";
import { connectToDB, findUser, newPost, updatePost } from ".";

let db = [];

// Create a mock for the connectToDB function
const mockConnectToDB = vi.fn();

// Create a mock for the MongoDB collection
const mockFindOne = vi.fn();
const mockInsertOne = vi.fn((post) => (db = [...db, post]));
const mockFindOneAndUpdate = vi.fn((id, update) => {
  
  update['$set'].id = id.id
  update = update['$set']
  console.log(update)

  db[id.id].id = id.id;
  db[id.id].type = update.type || db[id.id].type;
  db[id.id].title = update.title || db[id.id].title;
  db[id.id].image = update.image || db[id.id].image;
  db[id.id].content = update.content || db[id.id].content;
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

describe("connectToDB", () => {
  it("should return db and client", async () => {
    // Mock the MongoClient and its methods
    const mockConnect = vi.fn().mockResolvedValue({});
    const mockDb = vi.fn().mockReturnThis();
    const mockClient = {
      connect: mockConnect,
      db: mockDb,
    };

    // Mock the MongoClient constructor to return our mocked client
    const MongoClientInstance = vi.fn().mockReturnValue(mockClient);

    // Call the function
    const result = await connectToDB(MongoClientInstance, "mock-uri");

    // Assertions
    expect(MongoClientInstance).toHaveBeenCalledWith("mock-uri");
    expect(mockConnect).toHaveBeenCalled();
    expect(result).toEqual({ db: mockClient, client: mockClient });
  });

  it("should throw an error if connection fails", async () => {
    // Mock the MongoClient and force it to throw an error
    const mockConnect = vi
      .fn()
      .mockRejectedValue(new Error("Connection failed"));
    const mockClient = {
      connect: mockConnect,
    };
    const MongoClientInstance = vi.fn().mockReturnValue(mockClient);

    // Expect the function to throw
    await expect(connectToDB(MongoClientInstance, "mock-uri")).rejects.toThrow(
      "Connection failed"
    );
  });
});

describe("findUser", () => {
  it("should return a user if found", async () => {
    const username = "testuser";
    const mockUser = { username: "testuser", email: "test@example.com" };
    mockFindOne.mockResolvedValue(mockUser);

    const user = await findUser(username, mockConnectToDB);
    expect(user).toEqual(mockUser);
    expect(mockFindOne).toHaveBeenCalledWith({ username });
  });

  it("should return null if no user is found", async () => {
    const username = "testuser";
    mockFindOne.mockResolvedValue(null);

    const user = await findUser(username, mockConnectToDB);
    expect(user).toBeNull();
    expect(mockFindOne).toHaveBeenCalledWith({ username });
  });

  it("should handle errors gracefully", async () => {
    const username = "testuser";
    const error = new Error("Test error");
    mockFindOne.mockRejectedValue(error);

    await expect(findUser(username, mockConnectToDB)).rejects.toThrow(error);
  });
});

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
      content: "<p class=\"post__paragraph\">TEST2</p>",
    };
    await updatePost(updatedPost, mockConnectToDB);
    const newPost = db[0];
    expect(newPost).toEqual(updatedPost);
  });
});

// describe("generatePostID", () => {
//   // Wait untill new post is created
// });
