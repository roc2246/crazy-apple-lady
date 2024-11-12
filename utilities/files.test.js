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
const fs = require("fs").promises;
const path = require("path");

const tag = "tstBlog";

beforeAll(() => {
  formidable.newDirectory("mockDir");
  formidable.newDirectory(formidable.mockPath.temp);
  formidable.newDirectory(formidable.mockPath.server);
});
afterAll(() => {
  formidable.deleteDirectory("mockDir");
});

describe("File Mangement", () => {
  it("should create initial files to upload", async () => {
    formidable.createFiles(
      formidable.mockImgs.newPost,
      formidable.mockPath.temp
    );

    const mockTempFiles = await fs.readdir(formidable.mockPath.temp);
    const createdImgNames = formidable.mockImgs.newPost;

    expect(mockTempFiles.length).toBe(createdImgNames.length);
    createdImgNames.forEach((name) => expect(mockTempFiles).toContain(name));
  });
  it("should upload files", async () => {
    const files2Upload = formidable.setImgsToUpload(formidable.mockPath.temp);
    await utilities.uploadFiles(files2Upload, formidable.mockPath.server, tag);

    const mockTempFiles = await fs.readdir(formidable.mockPath.temp);
    const mockUploads = await fs.readdir(formidable.mockPath.server);
    const createdImgNames = formidable.mockImgs.newPost;

    expect(mockUploads.length).toBe(createdImgNames.length);
    expect(mockTempFiles.length).toBe(0);
    files2Upload.forEach(({ originalFileName }) =>
      expect(mockUploads).toContain(`${tag}-${originalFileName}`)
    );
  });

  it("should throw an error uploading files", async () => {
    const initImgs = "TERST";
    const results = utilities.uploadFiles(
      initImgs,
      formidable.mockPath.server,
      tag
    );

    await expect(results).rejects.toThrowError();
  });

  // UPDATING IMGS
  it("should create images for the following tests", async () => {
    formidable.createFiles(
      formidable.mockImgs.updatePost,
      formidable.mockPath.temp
    );
    const mockTempFiles = await fs.readdir(formidable.mockPath.temp);
    const createdImgNames = formidable.mockImgs.updatePost;

    expect(mockTempFiles.length).toBe(createdImgNames.length);
    createdImgNames.forEach((name) => expect(mockTempFiles).toContain(name));
  });

  it("should remove files not in temp files", async () => {
    const tempFiles = await fs.readdir(formidable.mockPath.temp);
    const uploadedFiles = await fs.readdir(formidable.mockPath.server);

    await utilities.removeFiles(formidable.mockPath.server, tag, tempFiles);
    expect(uploadedFiles).not.toContain("file2.txt");
  });
  it("should upload files not in uploads directory", async () => {
    const files2Upload = formidable.setImgsToUpload(formidable.mockPath.temp);
    await utilities.uploadFiles(files2Upload, formidable.mockPath.server, tag);

    const mockTempFiles = await fs.readdir(formidable.mockPath.temp);
    const mockUploads = await fs.readdir(formidable.mockPath.server);

    expect(mockTempFiles).toContain("file1.txt");
  });

  // TEST FOR DELETING ALL IMAGES WITH TAG NAME
  it("should create files in uploads without tags", async () => {
    formidable.createFiles(
      formidable.mockImgs.deletePost,
      formidable.mockPath.server
    );
    const uploadPath = formidable.mockPath.server;
    const uploads = await fs.readdir(uploadPath);

    formidable.mockImgs.deletePost.forEach((img) =>
      expect(uploads).toContain(`${img}`)
    );
  });
  it("should remove files with tag", async () => {
    const regex = new RegExp(`^${tag}-`);

    await utilities.removeFiles(formidable.mockPath.server, tag);
    formidable.mockImgs.updatePost.forEach((img) =>
      expect(regex.test(img)).toBe(false)
    );
  });
});
