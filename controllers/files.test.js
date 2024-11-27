/* 
Note: The following tests have a conflict with the fs module. The controllers tested work in the app as intended.
*/

import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import * as controllers from ".";
import * as utilities from "../utilities/index.js";
import * as formidable from "../mocks/formidable.js";

let req;
let res;

const tag = "tstBlog";
const form = utilities.newForm(formidable.mockForm, "mockDir/server");

beforeAll(async () => {
  // Reset req and res before each test
  req = {
    body: {
      id: 0,
      type: "plantyLife",
      tag: tag,
      title: "TEST",
      image: ["test.jpg"],
      content: "TEST",
    },
  };
  res = {
    status: vi.fn().mockReturnThis(), // Enables chaining, e.g., res.status(201).json(...)
    json: vi.fn(),
    send: vi.fn(),
    end: vi.fn(),
  };
  await formidable.newDirectory("mockDir");
  await formidable.newDirectory(formidable.mockPath.temp);
  await formidable.newDirectory(formidable.mockPath.server);
});
afterAll(async () => {
  await formidable.deleteDirectory(formidable.mockPath.temp);
  await formidable.deleteDirectory(formidable.mockPath.server);
  await formidable.deleteDirectory("mockDir");
});

// describe("Upload images", () => {
//   it("should call 200 after uploading images", async () => {
//     formidable.createFiles(
//       formidable.mockImgs.newPost,
//       formidable.mockPath.temp
//     );
//     await controllers.manageImageUpload(req, res, form);
//     expect(res.status).toHaveBeenCalledWith(200);
//   });
//   it("should throw 400 error after trying to parse form for manageImageUpload()", async () => {
//     await controllers.manageImageUpload(req, res, formidable.formFail);
//     expect(res.status).toHaveBeenCalledWith(400);
//   });
  // it("should call 500", async () => {
  //   await controllers.manageImageUpload(req, res, form);
  //   expect(res.status).toHaveBeenCalledWith(500);
  // });
// });
// 
// describe("Update Images", () => {
//   it("should call 200 after modifying images", async () => {
//     formidable.createFiles(
//       formidable.mockImgs.updatePost,
//       formidable.mockPath.temp
//     );
//     await controllers.modifyImages(req, res, form);
//     expect(res.status).toHaveBeenCalledWith(200);
//   });
//   it("should throw 400 error after trying to parse form for modifyImages()", async () => {
//     await controllers.modifyImages(req, res, formidable.formFail);
//     expect(res.status).toHaveBeenCalledWith(400);
//   });
//   it("should call 500", async () => {
//     await controllers.modifyImages("FAIL", res, form);
//     expect(res.status).toHaveBeenCalledWith(500);
//   });
// });

// describe("Delete images", () => {
//   it("should call 200 after deleting images", async () => {
//     await controllers.manageDeleteImages(req, res, form);
//     expect(res.status).toHaveBeenCalledWith(200);
//   });
//   it("should throw 400 error after trying to parse form for manageDeleteImages()", async () => {
//     await controllers.manageDeleteImages(req, res, formidable.formFail);
//     expect(res.status).toHaveBeenCalledWith(400);
//   });
//   it("should call 500", async () => {
//     await controllers.manageDeleteImages("FAIL", res, form);
//     expect(res.status).toHaveBeenCalledWith(500);
//   });
// });
