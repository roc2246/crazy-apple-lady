import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as utilities from "./index.js";
import * as formidable from "../mocks/formidable.js";
const fs = require("fs").promises;

const tag = "tstBlog";

beforeAll(async () => {
  await formidable.newDirectory("mockDir");
  await formidable.newDirectory(formidable.mockPath.temp);
  await formidable.newDirectory(formidable.mockPath.server);
});
afterAll(async () => {
  await formidable.deleteDirectory(formidable.mockPath.temp);
  await formidable.deleteDirectory(formidable.mockPath.server);
  await formidable.deleteDirectory("mockDir");
});

describe("Upload images", () => {
  it("should create initial files to upload", async () => {
    const newPostImgs = formidable.mockImgs.newPost;
    const tempPath = formidable.mockPath.temp;

    formidable.createFiles(newPostImgs, tempPath);

    const mockTempFiles = await fs.readdir(tempPath);

    expect(mockTempFiles.length).toBe(newPostImgs.length);
    newPostImgs.forEach((name) => expect(mockTempFiles).toContain(name));
  });
  it("should upload files", async () => {
    const tempPath = formidable.mockPath.temp;
    const serverPath = formidable.mockPath.server;
    const files2Upload = formidable.setImgsToUpload(tempPath);

    await utilities.uploadFiles(files2Upload, serverPath, tag);

    const mockTempFiles = await fs.readdir(tempPath);
    const mockUploads = await fs.readdir(serverPath);
    const createdImgNames = formidable.mockImgs.newPost;

    expect(mockUploads.length).toBe(createdImgNames.length);
    expect(mockTempFiles.length).toBe(0);
    files2Upload.forEach(({ originalFilename }) =>
      expect(mockUploads).toContain(`${tag}-${originalFilename}`)
    );
  });

  it("should throw an error uploading files", async () => {
    const serverPath = formidable.mockPath.server;
    const results = utilities.uploadFiles("FAIL", serverPath, tag);

    await expect(results).rejects.toThrowError();
  });
});

describe("Update images", () => {
  it("should create images for the following tests", async () => {
    const updatedImgs = formidable.mockImgs.updatePost;
    const tempPath = formidable.mockPath.temp;

    formidable.createFiles(updatedImgs, tempPath);

    const mockTempFiles = await fs.readdir(tempPath);
    const createdImgNames = updatedImgs;

    expect(mockTempFiles.length).toBe(createdImgNames.length);
    createdImgNames.forEach((name) => expect(mockTempFiles).toContain(name));
  });

  it("should remove files not in temp files", async () => {
    const tempFiles = await fs.readdir(formidable.mockPath.temp);
    const uploadedFiles = await fs.readdir(formidable.mockPath.server);

    await utilities.removeFiles(formidable.mockPath.server, tag, tempFiles);
    expect(uploadedFiles).not.toContain("file2.txt");
  });
  it("should throw error removing files not in temp files", async () => {
    const tempFiles = await fs.readdir(formidable.mockPath.temp);
    const results = utilities.removeFiles("FAIL", tag, tempFiles);
    await expect(results).rejects.toThrowError();
  });
  it("should upload files not in uploads directory", async () => {
    const tempPath = formidable.mockPath.temp;
    const serverPath = formidable.mockPath.server;

    const files2Upload = formidable.setImgsToUpload(tempPath);
    await utilities.uploadFiles(files2Upload, serverPath, tag);

    const mockTempFiles = await fs.readdir(tempPath);
    const mockUploads = await fs.readdir(serverPath);

    expect(mockTempFiles).toContain("file1.txt");
    expect(mockUploads).toContain(`${tag}-file8.txt`);
  });
  it("should throw error uploading files not in uploads directory", async () => {
    const serverPath = formidable.mockPath.server;
    const results = utilities.uploadFiles("FAIL", serverPath, tag);

    await expect(results).rejects.toThrowError();
  });
});

describe("Remove images", () => {
  it("should create files in uploads without tags", async () => {
    const deleteImgs = formidable.mockImgs.deletePost;
    const serverPath = formidable.mockPath.server;

    formidable.createFiles(deleteImgs, serverPath);

    const uploads = await fs.readdir(serverPath);

    deleteImgs.forEach((img) => expect(uploads).toContain(`${img}`));
  });
  it("should remove files with tag", async () => {
    const updatedImgs = formidable.mockImgs.updatePost;
    const serverPath = formidable.mockPath.server;
    const regex = new RegExp(`^${tag}-`);

    await utilities.removeFiles(serverPath, tag);
    updatedImgs.forEach((img) => expect(regex.test(img)).toBe(false));
  });
  it("should throw error removing files with tag", async () => {
    const results = utilities.removeFiles("FAIL", tag);
    await expect(results).rejects.toThrowError();
  });
});
