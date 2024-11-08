import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import * as controllers from ".";
import * as utilities from "../utilities/index.js";
import * as mongo from "../mocks/mongodb.js";
import * as formidable from "../mocks/formidable.js";
const fs = require("fs");
const path = require("path");

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
    send: vi.fn(),
    end: vi.fn(),
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
    expect(res.json).toHaveBeenCalledWith({
      message: "Post updated successfully",
      updatedPost: update,
    });
  });

  it("should return a 401", async () => {
    const result = controllers.manageUpdatePost(req, res, update, "BLA");
    await expect(result).rejects.toThrow("Invalid Function");

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("manageDeletePost", () => {
  it("should return a 200", async () => {
    await controllers.manageDeletePost(req, res, 0, mongo.mockFindOneAndDelete);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return a 500", async () => {
    const result = controllers.manageDeletePost(req, res, 0, "BLA");
    await expect(result).rejects.toThrow("Invalid Function");

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("manageGetPostNames", () => {
  it("should return a 200", async () => {
    await controllers.manageGetPostNames(
      req,
      res,
      "plantyLife",
      mongo.mockAggregate
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return a 404", async () => {
    await controllers.manageGetPostNames(req, res, "FAIL", mongo.mockAggregate);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("manageGetPost", () => {
  it("should return a 200", async () => {
    await controllers.manageGetPost(req, res, 0, mongo.mockAggregate);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return a 404", async () => {
    await controllers.manageGetPost(req, res, "FAIL", mongo.mockAggregate);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("manageGetPosts", () => {
  it("should return a 200", async () => {
    await controllers.manageGetPosts(req, res, mongo.mockAggregate);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  it("should return a 500", async () => {
    const results = controllers.manageGetPosts(req, res, "FAIL");
    await expect(results).rejects.toThrow();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("Image management", () => {
  const mockImagesPath = path.join(__dirname, "mockImgs");
  const mockUploadsPath = path.join(__dirname, "mockUploads");
  const uploadsToCreate = ["file1.txt", "file2.txt", "file3.txt"];
  const formObj = utilities.newForm(
    formidable.mockForm,
    "controllers/mockUploads"
  );
  const modsToCreate = ["file1.txt", "file8.txt"];

  beforeAll(() => {
    // Create a folder asynchronously
    formidable.newDirectory(mockImagesPath);
    formidable.newDirectory(mockUploadsPath);

    // Iterate through the array and create each file
    formidable.createFiles(uploadsToCreate, mockImagesPath);
  });

  it("should move all files to new directory", async () => {
    await controllers.manageImageUpload(req, res, formObj);
    fs.readdirSync(mockUploadsPath, (err, files) => {
      expect(files.length).toBe(3);
      expect(files).toContain("file1.txt");
      expect(files).toContain("file2.txt");
      expect(files).toContain("file3.txt");
    });
  });

  // it("should modify specific images", async () => {
  //   formidable.createFiles(modsToCreate, mockImagesPath);
  //   await controllers.modifyImages(req, res, formObj);
  //   fs.readdirSync(mockUploadsPath, (err, files) => {
  //     expect(files).not.toContain("file2.txt");
  //     expect(files).toContain("file8.txt");
  //   });
  // });

  // it("should delete images", async () => {
  //   await controllers.manageDeleteImages(req, res,
  //     ["file1.txt", "file8.txt"],
  //     "controllers/mockUploads"
  //   );
  //   fs.readdir(mockUploadsPath, (err, files) => {
  //     expect(files.length).toBe(0);
  //   });
  // });

  afterAll(() => {
    formidable.deleteDirectory(mockImagesPath);
    formidable.deleteDirectory(mockUploadsPath);
  });
});
