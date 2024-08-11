// import { describe, it, expect, vi } from "vitest";
// import {
//   manageGetPostNames,
//   manageGetPost,
//   manageNewPost,
//   manageDeletePost,
// } from ".";
// import { assert } from "console";

// function createMockResponse() {
//   const res = {};
//   res.status = vi.fn().mockReturnThis();
//   res.json = vi.fn();
//   res.send = vi.fn();
//   return res;
// }

// describe("CRUD operations for posts", () => {
//   it("should create a new post", async () => {
//     // Arrange
//     const images = ["test-img1.jpg", "test-img2.jpg"];
//     const req = {
//       body: {
//         id: -1,
//         type: "plantyLife",
//         title: "Test",
//         image: images.map((img) => `./images/${img}`),
//         content: "Test Content",
//       },
//     };
//     const res = createMockResponse();

//     // Act
//     await manageNewPost(req, res);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(201);
//   });

//   it("should delete a post", async () => {
//     // Arrange
//     const id = -1;
//     const req = {};
//     const res = createMockResponse();

//     // act
//     await manageDeletePost(req, res, id);

//     // assert
//     expect(res.status).toHaveBeenCalledWith(200);
//   });
// });

// describe("Retrieving Post Names", () => {
//   it("should return post names when available", async () => {
//     // Arrange
//     const req = {};
//     const res = createMockResponse();
//     const type = "plantyLife";

//     // Act
//     await manageGetPostNames(req, res, type);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(200);
//   });

//   it("should give 404 error", async () => {
//     // Arrange
//     const req = {};
//     const res = createMockResponse();
//     const type = "error";

//     // Act
//     await manageGetPostNames(req, res, type);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(404);
//   });
// });

// describe("Image Uploads", ()=>{
//   it("should upload images", async ()=>{
//       // Arrange
//       const images = ["test-img1.jpg", "test-img2.jpg"];
//       const req = {
//         body: {
//           images: images,
//         },
//       };
//       const res = createMockResponse();
  
//       // Act
//       await manageImageUpload(req, res);
  
//       // Assert
//       expect(res.status).toHaveBeenCalledWith(201);
//   })
// })

// describe("Retrieving Post", () => {
//   it("should return post", async () => {
//     // Arrange
//     const req = {};
//     const res = createMockResponse();
//     const id = 1;

//     // Act
//     await manageGetPost(req, res, id);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(200);
//   });

//   it("should give 404 error", async () => {
//     // Arrange
//     const req = {};
//     const res = createMockResponse();
//     const id = "error";

//     // Act
//     await manageGetPost(req, res, id);

//     // Assert
//     expect(res.status).toHaveBeenCalledWith(404);
//   });
// });
