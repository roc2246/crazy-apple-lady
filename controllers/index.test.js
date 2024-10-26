import { vi, describe, it, expect, beforeEach } from "vitest";
import * as controllers from ".";
import * as models from "../models";
import { addPTags } from "../utilities";
import * as mongo from "../mocks/mongodb.js";

describe("manageNewPost", () => {
  let req;
  let res;

  beforeEach(() => {
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

  it("should return a 201", async () => {
    const model = await models.newPost(req.body, mongo.mockConnectToDB);
    await controllers.manageNewPost(req, res, model);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Post added" });
  });
});
