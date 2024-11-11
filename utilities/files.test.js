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


const blogName = "tstBlog";

beforeAll(() => {
  formidable.newDirectory("mockDir")
  formidable.newDirectory(formidable.mockPath.local);
  formidable.newDirectory(formidable.mockPath.server);
});
afterAll(() => {
  formidable.deleteDirectory("mockDir")
});

describe("File Mangement", () => {
  it("should upload files", async () => {
    formidable.createFiles(formidable.mockImgs.newPost, formidable.mockPath.local);
    const initImgs = formidable.setImgsToUpload(formidable.mockPath.local);
    await utilities.uploadFiles(initImgs, formidable.mockPath.server, blogName);

    const mockUploads = fs.readdirSync(formidable.mockPath.server);

    expect(mockUploads.length).toBe(formidable.mockImgs.newPost.length);
    initImgs.forEach(({ originalFileName }) =>
      expect(mockUploads).toContain(`${blogName}-${originalFileName}`)
    );
  });

  it("should throw an error uploading files", async () => {
    const initImgs = "TERST";
    const results = utilities.uploadFiles(initImgs, formidable.mockPath.server, blogName);

    await expect(results).rejects.toThrowError();
  });

  it(`should update images of ${blogName}`, async () => {
    formidable.createFiles(formidable.mockImgs.updatePost, formidable.mockPath.local);
    const initImgs = formidable.setImgsToUpload(formidable.mockPath.local);
    const localImgs = fs.readdirSync(formidable.mockPath.local);

    await utilities.uploadFiles(initImgs, formidable.mockPath.server, blogName);

    const uploadedImgs = fs.readdirSync(formidable.mockPath.server);
    await utilities.removeFiles(
      uploadedImgs,
      formidable.mockPath.server,
      blogName,
      localImgs,
    );
    expect(uploadedImgs).toContain(`${blogName}-file1.txt`);
    expect(uploadedImgs).toContain(`${blogName}-file8.txt`);

    const uploadedImgs2 = fs.readdirSync(formidable.mockPath.server);
    expect(uploadedImgs2).not.toContain(`${blogName}-file2.txt`);
    expect(uploadedImgs2).not.toContain(`${blogName}-file3.txt`);
  });

  it("should throw an error removing files not in uploads", async () => {
    const initImgs = "TERST";
    const results = utilities.removeFiles(initImgs, formidable.mockPath.server,"", blogName);

    await expect(results).rejects.toThrowError();
  });


  it(`should remove all ${blogName} files`, async () => {
    const uploadedImgsBefore = fs.readdirSync(formidable.mockPath.server);
    await utilities.removeFiles(uploadedImgsBefore, formidable.mockPath.server, blogName);
    const uploadedImgsAfter = fs.readdirSync(formidable.mockPath.server);
    expect(uploadedImgsAfter.length).toBe(0);
  });

  it("should throw an error removing files", async () => {
    const initImgs = "TERST";
    const results = utilities.removeFiles(initImgs, formidable.mockPath.server, blogName);

    await expect(results).rejects.toThrowError();
  });

});
