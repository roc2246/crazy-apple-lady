import { describe, it, expect, vi } from "vitest";
import { manageGetPostNames, manageGetPost } from ".";

function createMockResponse() {
  const res = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn();
  res.send = vi.fn();
  return res;
}

describe("Retrieving Post Names", () => {
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
    const post = manageGetPostNames(req, res, type);

    // Assert
    await expect(post).rejects.toThrowError();
  });
});

describe("Retrieving Post", () => {
  it("should return post", async () => {
    // Arrange
    const req = {};
    const res = createMockResponse();
    const id = 1;

    // Act
    await manageGetPost(req, res, id);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should throw error if no post names are found", async () => {
    // Arrange
    const req = {};
    const res = createMockResponse();
    const id = "error";

    // Act
    const post = manageGetPost(req, res, id);

    // Assert
    await expect(post).rejects.toThrowError();
  });
});
