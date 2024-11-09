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

const mockPath = {
  local: path.join(__dirname, "mockImgs"),
  server: path.join(__dirname, "mockUploads"),
};

const mockImgs = {
  newPost: ["file1.txt", "file2.txt", "file3.txt"],
  updatePost: ["file1.txt", "file8.txt"],
};

const blogName = "tstBlog";

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
  formidable.newDirectory(mockPath.local);
  formidable.newDirectory(mockPath.server);
});
afterAll(() => {
  formidable.deleteDirectory(mockPath.local);
  formidable.deleteDirectory(mockPath.server);
});

describe("Image management", () => {
  it("should manage http requests for uploading files", async () => {
    
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
});
