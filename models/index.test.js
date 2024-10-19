import { vi, describe, it, expect } from "vitest";
import {
  connectToDB,
  deletePost,
  findUser,
  newPost,
  postRetrieval,
  updatePost,
} from ".";
import { addPTags } from "../utilities";
import  *  as mongo from "../mocks/mongodb.js"


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
    const newLength = mongo.db.length
    expect(newLength).toBeGreaterThan(priorLength);
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
    await updatePost(updatedPost, mongo.mockConnectToDB);
    const newPost = mongo.db[0];
    expect(newPost).toEqual(updatedPost);
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
});

describe("Get full post", () => {
  it("should retrieve a post", async () => {
    const match = { id: 0 };
    const project = { _id: 0 };

    const results = await postRetrieval(match, project, mongo.mockConnectToDB);
    const expectedResults = [{
      id: 0,
      type: 'plantyLife',
      title: 'Plant Blog Post',
      image: [ 'plant.jpg' ],
      content: 'This is a post about plants.'
    }]
    expect(results).toStrictEqual(expectedResults)
  });
});

// describe("generatePostID", () => {
//   // Wait untill new post is created
// });
