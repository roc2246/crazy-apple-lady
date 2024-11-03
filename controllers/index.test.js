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
  const result = controllers.manageNewPost(req, res, "BLA")
  await expect(result).rejects.toThrow("Invalid Function");

  expect(res.status).toHaveBeenCalledWith(401);
  });
});
