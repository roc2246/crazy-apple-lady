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
        const fields = { name:[] }; 
        const files = { images: [] };

        const mockImagesPath = path.join(path.dirname(__dirname), "controllers/mockImgs");
        const imgsToUpload = fs.readdirSync(mockImagesPath)
        
        for (let x = 0; x < imgsToUpload.length; x++) {
          const obj = {
            filepath: path.join(
              mockImagesPath,
              imgsToUpload[x]
            ),
            originalFilename: imgsToUpload[x],
          };
          files.images.push(obj);
          fields.name.push(obj.originalFilename)
        }

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

export function createFiles(files, directory){
  files.forEach(file => {
    const filePath = path.join(directory, file);
    fs.writeFileSync(filePath, "");
  });
}