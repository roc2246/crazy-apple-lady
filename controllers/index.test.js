import { describe, it, expect, vi } from "vitest";
import { manageGetPostNames } from ".";

// Helper function to create a mock response object
function createMockResponse (){
  const res = {};
  res.status = vi.fn().mockReturnThis(); // `mockReturnThis` allows chaining
  res.json = vi.fn();
  return res;
};

describe("Post Retrieval", () => {
  it("should return post names when available", async () => {
    // Arrange
    const req = {};
    const res = createMockResponse(); 
    const type = "plantyLife";

    // Act
    await manageGetPostNames(req, res, type);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should throw error if no post names are found", async () => {
    // Arrange
    const req = {};
    const res = createMockResponse(); 
    const type = "error";

    // Act
    const post =  manageGetPostNames(req, res, type);
    console.log(res.status)

    // Assert
    await expect(post).rejects.toThrowError();
  });
});
