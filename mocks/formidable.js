import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
const fs = require("fs");
const path = require("path");

export const mockForm = vi.fn(() => {
  return {
    parse: (req, cb) => {
      const err = null;
      const fields = { };
      const files = { images: [] };

      const mockImagesPath = path.join(
        path.dirname(__dirname),
        "mockDir/mockImgs"
      );
      const imgsToUpload = fs.readdirSync(mockImagesPath);

      for (let x = 0; x < imgsToUpload.length; x++) {
        const obj = {
          filepath: "TEMP",
          originalFilename: imgsToUpload[x],
        };
        files.images.push(obj);
      }

      cb(err, fields, files);
    },
  };
});

export const mockPath = {
  local: path.join(path.dirname(__dirname), "mockDir/mockImgs"),
  server: path.join(path.dirname(__dirname), "mockDir/mockUploads"),
};

export const mockImgs = {
  newPost: ["file1.txt", "file2.txt", "file3.txt"],
  updatePost: ["file1.txt", "file8.txt"],
};


export function newDirectory(directory) {
  fs.mkdir(directory, { recursive: true }, (err) => {});
}

export function deleteDirectory(directory) {
  fs.rm(directory, { recursive: true, force: true }, (err) => {});
}

export function createFiles(files, directory) {
  files.forEach((file) => {
    const filePath = path.join(directory, file);
    fs.writeFileSync(filePath, "");
  });
}

export function setImgsToUpload(localDir) {
  let initImgs;
  initImgs = fs.readdirSync(localDir);
  initImgs = initImgs.map((img) => {
    return {
      originalFileName: img,
      filepath: path.join(localDir, img),
    };
  });
  return initImgs;
}
