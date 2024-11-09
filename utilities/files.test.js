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
  formidable.newDirectory(mockPath.local);
  formidable.newDirectory(mockPath.server);
});
afterAll(() => {
  formidable.deleteDirectory(mockPath.local);
  formidable.deleteDirectory(mockPath.server);
});

describe("File Mangement", () => {
  it("should upload files", async () => {
    formidable.createFiles(mockImgs.newPost, mockPath.local);
    const initImgs = formidable.setImgsToUpload(mockPath.local);
    await utilities.uploadFiles(initImgs, mockPath.server, blogName);

    const mockUploads = fs.readdirSync(mockPath.server);

    expect(mockUploads.length).toBe(mockImgs.newPost.length);
    initImgs.forEach(({ originalFileName }) =>
      expect(mockUploads).toContain(`${blogName}-${originalFileName}`)
    );
  });

  it("should throw an error uploading files", async () => {
    const initImgs = "TERST";
    const results = utilities.uploadFiles(initImgs, mockPath.server, blogName);

    await expect(results).rejects.toThrowError();
  });

  it(`should update images of ${blogName}`, async () => {
    formidable.createFiles(mockImgs.updatePost, mockPath.local);
    const initImgs = formidable.setImgsToUpload(mockPath.local);
    const localImgs = fs.readdirSync(mockPath.local);

    await utilities.uploadFiles(initImgs, mockPath.server, blogName);

    const uploadedImgs = fs.readdirSync(mockPath.server);
    await utilities.removeFilesNotInUploads(
      uploadedImgs,
      mockPath.server,
      localImgs,
      blogName
    );
    expect(uploadedImgs).toContain(`${blogName}-file1.txt`);
    expect(uploadedImgs).toContain(`${blogName}-file8.txt`);

    const uploadedImgs2 = fs.readdirSync(mockPath.server);
    expect(uploadedImgs2).not.toContain(`${blogName}-file2.txt`);
    expect(uploadedImgs2).not.toContain(`${blogName}-file3.txt`);
  });

  it("should throw an error removing files not in uploads", async () => {
    const initImgs = "TERST";
    const results = utilities.removeFilesNotInUploads(initImgs, mockPath.server,"", blogName);

    await expect(results).rejects.toThrowError();
  });


  it(`should remove all ${blogName} files`, async () => {
    const uploadedImgsBefore = fs.readdirSync(mockPath.server);
    await utilities.removeFiles(uploadedImgsBefore, mockPath.server, blogName);
    const uploadedImgsAfter = fs.readdirSync(mockPath.server);
    expect(uploadedImgsAfter.length).toBe(0);
  });

  it("should throw an error removing files", async () => {
    const initImgs = "TERST";
    const results = utilities.removeFiles(initImgs, mockPath.server, blogName);

    await expect(results).rejects.toThrowError();
  });

});
