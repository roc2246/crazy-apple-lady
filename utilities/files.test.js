import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import * as utilities from "./index.js";
import * as formidable from "../mocks/formidable.js";
const fs = require("fs");
const path = require("path");

let initImgs
const mockPath = {
  local: path.join(__dirname, "mockImgs"),
  server: path.join(__dirname, "mockUploads")
}

const mockImgs = {
  newPost: ["file1.txt", "file2.txt", "file3.txt"],
  updatePost: ["file1.txt", "file8.txt"]
}

const blogName = "tstBlog";

beforeAll(() => {
  // Create a folder asynchronously
  formidable.newDirectory(mockPath.local);
  formidable.newDirectory(mockPath.server);

  // Iterate through the array and create each file
  formidable.createFiles(mockImgs.newPost, mockPath.local);
  initImgs = formidable.setImgsToUpload(mockPath.local)
});
afterAll(() => {
  formidable.deleteDirectory(mockPath.local);
  formidable.deleteDirectory(mockPath.server);
});

describe("File Mangement", () => {
  it("should upload files", async () => {
    await utilities.uploadFiles(initImgs, mockPath.server, blogName);
    const mockUploads = fs.readdirSync(mockPath.server);

    expect(mockUploads.length).toBe(mockImgs.newPost.length);
    initImgs.forEach(({ originalFileName }) =>
      expect(mockUploads).toContain(`${blogName}-${originalFileName}`)
    );
  });

  it(`should update images of ${blogName}`, async () => {
    formidable.createFiles(mockImgs.updatePost, mockPath.local);
    initImgs = formidable.setImgsToUpload(mockPath.local)
    const localImgs = fs.readdirSync(mockPath.local)

    await utilities.uploadFiles(initImgs, mockPath.server, blogName);

    const uploadedImgs = fs.readdirSync(mockPath.server)
    await utilities.removeFilesNotInUploads(uploadedImgs, mockPath.server,localImgs, blogName);
    expect(uploadedImgs).toContain(`${blogName}-file1.txt`);
    expect(uploadedImgs).toContain(`${blogName}-file8.txt`);

    const uploadedImgs2 = fs.readdirSync(mockPath.server)
    expect(uploadedImgs2).not.toContain(`${blogName}-file2.txt`);
    expect(uploadedImgs2).not.toContain(`${blogName}-file3.txt`);
  });

  //   IT SHOULD REMOVE FILES
  //     CONST FOR DELETING ALL IMAGES
  //     EXPECT LENGTH OF UPLOADS DIRECTORY TO BE ZERO
});
