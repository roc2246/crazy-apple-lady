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

let initImgs;
// LET FOR IMAGES NOT IN IMAGES READY FOR UPLOAD

const mockImagesPath = path.join(__dirname, "mockImgs");
const mockUploadsPath = path.join(__dirname, "mockUploads");

const uploadsToCreate = ["file1.txt", "file2.txt", "file3.txt"];
const modsToCreate = ["file1.txt", "file8.txt"];

const blogName = "tstBlog";

beforeAll(() => {
  // Create a folder asynchronously
  formidable.newDirectory(mockImagesPath);
  formidable.newDirectory(mockUploadsPath);

  // Iterate through the array and create each file
  formidable.createFiles(uploadsToCreate, mockImagesPath);
  initImgs = fs.readdirSync(mockImagesPath);
  initImgs = initImgs.map((img) => {
    return {
      originalFileName: img,
      filepath: path.join(mockImagesPath, img),
    };
  });
});
afterAll(() => {
  formidable.deleteDirectory(mockImagesPath);
  formidable.deleteDirectory(mockUploadsPath);
});

describe("File Mangement", () => {
  it("should upload files", async () => {
    await utilities.uploadFiles(initImgs, mockUploadsPath, blogName);
    const mockUploads = fs.readdirSync(mockUploadsPath);

    expect(mockUploads.length).toBe(uploadsToCreate.length);
    initImgs.forEach(({ originalFileName }) =>
      expect(mockUploads).toContain(`${blogName}-${originalFileName}`)
    );
  });

  //   IT SHOULD ALTER IMAGES OF MOCK BLOG
  //     CREATE NEW FILES,
  //       SOME THAT ARE IN UPLOADS
  //       AND SOME THAT ARENT
  //     SET INITIAL IMAGES FOR FILES JUST CREATED
  //     CONST FOR UPLOADED FILES
  //     SET VALUE FOR UPLOADS NOT IN INITIAL IMAGES
  //     EXPECT DIRECOTRY CONTAINING FILES JUST CREATED TO CONTAIN FILES NOT IN UPLOADS
  //     CONST FOR DELETING FILES NOT IN UPLOADS
  //     EXPECT UPLOADS DIRECTORY TO NOT INCLUDE FILES ORIGINALLY CREATED BUT NO LONGER IN UPLOADS

  //   IT SHOULD REMOVE FILES
  //     CONST FOR DELETING ALL IMAGES
  //     EXPECT LENGTH OF UPLOADS DIRECTORY TO BE ZERO
});
