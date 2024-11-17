import { it, vi } from "vitest";
import { createPost } from "../libraries/CRUD-posts";
import { describe } from "node:test";

// Mocking `fetch` globally
global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});

fetch.mockImplementation(async (url, options) => {
  return {
    ok: true,
    status: vi.fn(),
    json: async () => ({ message: "Post added successfully" }),
    text: async () => "Mocked fetch response",
  };
});

describe("createPost", () => {
  it("should create a new post", async () => {
    const post = {
      id: 0,
      type: "plantyLife",
      title: "TEST",
      image: ["1.jpg", "2.jpg"],
      content: "TESTING",
    };
    const result = await createPost(post);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/new-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    expect(result).toEqual({ message: "Post added successfully" });
  });
});
