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


const tag = "tstBlog";
const form = utilities.newForm(formidable.mockForm, "mockDir/server")

beforeAll(async() => {
  // Reset req and res before each test
  req = {
    body: {
      id: 0,
      type: "plantyLife",
      tag: tag,
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
  await formidable.newDirectory("mockDir")
  await formidable.newDirectory(formidable.mockPath.temp);
  await formidable.newDirectory(formidable.mockPath.server);
});
afterAll(async () => {
  await formidable.deleteDirectory("mockDir")
});

describe("Image management", () => {
  it("should manage http requests for uploading files", async () => {
    formidable.createFiles(formidable.mockImgs.newPost, formidable.mockPath.temp)
    await controllers.manageImageUpload(req, res, form)
    // expect(res.status).toHaveBeenCalledWith(200);
  });

  // it("should modify specific images", async () => {
  //   formidable.createFiles(formidable.mockImgs.updatePost, formidable.mockPath.temp);
  //   await controllers.modifyImages(req, res, form);
  //   expect(res.status).toHaveBeenCalledWith(200);

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
