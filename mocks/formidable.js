import { vi } from "vitest";
const fs = require("fs");
const path = require("path");

export const mockPath = {
  temp: path.join(path.dirname(__dirname), "mockDir/temp"),
  server: path.join(path.dirname(__dirname), "mockDir/server"),
};

export const mockImgs = {
  newPost: ["file1.txt", "file2.txt", "file3.txt"],
  updatePost: ["file1.txt", "file8.txt"],
  deletePost: [
    "file1.txt",
    "file2.txt",
    "file3.txt",
    "file4.txt",
    "file5.txt",
    "file6.txt",
  ],
};

export const mockForm = vi.fn(() => {
  return {
    parse: (req, cb) => {
      const err = null;
      const fields = {};
      const files = { images: [] };

      const imgsToUpload = fs.readdirSync(mockPath.temp);

      imgsToUpload.forEach((img) => {
        const obj = {
          filepath: path.join(mockImgs.temp, img),
          originalFilename: img,
        };
        files.images.push(obj);
      });

      cb(err, fields, files);
    },
  };
});

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
  return fs.readdirSync(localDir).map((img) => ({
    filepath: path.join(mockPath.temp, img),
    originalFileName: img,
  }));
}
