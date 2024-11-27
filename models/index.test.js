import { vi, describe, it, expect, afterAll } from "vitest";
import {
  connectToDB,
  deletePost,
  createUser,
  findUser,
  newPost,
  postRetrieval,
  updatePost,
} from ".";
import { addPTags } from "../utilities";
import * as mongo from "../mocks/mongodb.js";

describe("Adding new user data", () => {
  afterAll(() => (mongo.db.length = 0));
  it("should add new user", async () => {
    await createUser(mongo.mockUser, mongo.mockConnectToDB);
    expect(mongo.db.length).toBe(1);
  });
  it("should throw error if username already exists", async () => {
    const result = createUser(mongo.mockUser, mongo.mockConnectToDB);
    await expect(result).rejects.toThrowError();
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
    const priorLength = mongo.db.length;
    await newPost(post, mongo.mockConnectToDB);
    const newLength = mongo.db.length;
    await expect(newLength).toBeGreaterThan(priorLength);
  });

  it("should throw errors", async () => {
    await expect(newPost({}, "failedConnection")).rejects.toThrow();
    await expect(newPost({}, mongo.mockConnectToDB)).rejects.toThrow();
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
    const expectedResult = {
      id: 0,
      type: "mushroomBlog",
      title: "test2",
      image: ["./images/test.jpg"],
      content: addPTags("TEST1212"),
    };

    await updatePost(updatedPost, mongo.mockConnectToDB);

    expect(mongo.db[0]).toEqual(expectedResult);
  });
  it("should throw error", async () => {
    await expect(updatePost({}, mongo.mockConnectToDB)).rejects.toThrow();
  });
});

describe("deletePost", () => {
  it("should delete post", async () => {
    await deletePost(0, mongo.mockConnectToDB);
    expect(mongo.db.length).toBe(0);
  });
  it("should throw error", async () => {
    const result = await deletePost(100, mongo.mockConnectToDB);
    expect(result).toThrowError;
  });
});

describe("retrieving post names", () => {
  it("should retrieve planty life posts", async () => {
    const match = { type: "plantyLife" };
    const project = { _id: 0, id: 1, title: 1 };

    const results = await postRetrieval(match, project, mongo.mockConnectToDB);
    // Adjust the expected result to match the actual structure you expect
    const expectedResults = [
      {
        id: 0,
        title: "Plant Blog Post",
      },
    ];

    expect(results).toEqual(expectedResults); // Use toEqual to match the expected structure
  });
  it("should retrieve mushroom blog posts", async () => {
    const match = { type: "mushroomBlog" };
    const project = { _id: 0, id: 1, title: 1 };

    const results = await postRetrieval(match, project, mongo.mockConnectToDB);
    // Adjust the expected result to match the actual structure you expect
    const expectedResults = [
      {
        id: 1,
        title: "Mushroom Blog Post",
      },
    ];

    expect(results).toEqual(expectedResults); // Use toEqual to match the expected structure
  });

  it("should throw error", async () => {
    const match = { type: "fail" };
    const project = { _id: 0, id: 1, title: 1 };

    const results = postRetrieval(match, project, mongo.mockConnectToDB);
    await expect(results).rejects.toThrow();
  });
});

describe("Get full post", () => {
  it("should retrieve a post", async () => {
    const match = { id: 0 };
    const project = { _id: 0 };

    const results = await postRetrieval(match, project, mongo.mockConnectToDB);
    const expectedResults = [
      {
        id: 0,
        type: "plantyLife",
        title: "Plant Blog Post",
        image: ["plant.jpg"],
        content: "This is a post about plants.",
      },
    ];
    expect(results).toStrictEqual(expectedResults);
  });
  it("should throw error", async () => {
    const match = { id: 1000000 };
    const project = { _id: 0 };

    const results = postRetrieval(match, project, mongo.mockConnectToDB);

    await expect(results).rejects.toThrow();
  });
});
