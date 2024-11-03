import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import * as controllers from ".";
import * as models from "../models";
import { addPTags } from "../utilities";
import * as mongo from "../mocks/mongodb.js";

let req;
let res;

beforeAll(() => {
  // Reset req and res before each test
  req = {
    body: {
      id: 0,
      type: "plantyLife",
      title: "TEST",
      image: ["test.jpg"],
      content: "TEST",
    },
  };
  res = {
    status: vi.fn().mockReturnThis(), // Enables chaining, e.g., res.status(201).json(...)
    json: vi.fn(),
  };
});

describe("manageNewPost", () => {
  it("should return a 201", async () => {
    await controllers.manageNewPost(req, res, mongo.mockInsertOne);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Post added" });
  });

  it("should return a 401", async () => {
    const result = controllers.manageNewPost(req, res, "BLA");
    await expect(result).rejects.toThrow("Invalid Function");

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("manageUpdatePost", () => {
  const update = {
    id: 0,
    type: "plantyLife",
    title: "TEST2",
    image: ["test.jpg"],
    content: "TEST",
  };
  it("should return a 200", async () => {
    await controllers.manageUpdatePost(
      req,
      res,
      update,
      mongo.mockFindOneAndUpdate({ id: update.id }, { $set: update })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Post updated successfully", updatedPost: update });
  });

  it("should return a 401", async () => {
    const result = controllers.manageUpdatePost(req, res, update, "BLA");
    await expect(result).rejects.toThrow("Invalid Function");

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("manageDeletePost", ()=>{
  it("should return a 200", async() =>{
    await controllers.manageDeletePost(req, res, 0, mongo.mockFindOneAndDelete)
    expect(res.status).toHaveBeenCalledWith(200);
  })
  it("should return a 500", async () => {
    const result = controllers.manageDeletePost(req, res, 0, "BLA");
    await expect(result).rejects.toThrow("Invalid Function");

    expect(res.status).toHaveBeenCalledWith(500);
  });
})