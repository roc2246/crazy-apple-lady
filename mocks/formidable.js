import { vi } from "vitest";
const fs = require("fs");
const fsPromise = require("fs").promises
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
      const fields = {tag:["tstBlog"]};
      const files = { image: [] };

      const imgsToUpload = fs.readdirSync(mockPath.temp);

      imgsToUpload.forEach((img) => {
        const obj = {
          filepath: path.join(mockPath.temp, img),
          originalFilename: img,
        };
        files.image.push(obj);
      });

      cb(err, fields, files);
    },
  };
});

export const formFail = {
  parse: vi.fn((req, callback) => {
    const err = new Error("Form parsing error");
    callback(err, {}, {}); // Trigger error callback
  }),
};

export async function newDirectory(directory) {
  await fsPromise.mkdir(directory, { recursive: true });
}

export async function deleteDirectory(directory) {
  await fsPromise.rm(directory, { recursive: true, force: true });
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
    originalFilename: img,
  }));
}
