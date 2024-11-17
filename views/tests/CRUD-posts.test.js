import { it, vi } from "vitest";
import { createPost, deletePost, updatePost } from "../libraries/CRUD-posts";
import { describe } from "node:test";

// Mocking `fetch` globally
global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});

describe("createPost", () => {
  fetch.mockImplementation(async (url, options) => {
    return {
      ok: true,
      status: vi.fn(),
      json: async () => ({ message: "Post added successfully" }),
      text: async () => "Mocked fetch response",
    };
  });
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

describe("updatePost", () => {
  fetch.mockImplementation(async (url, options) => {
    return {
      ok: true,
      status: vi.fn(),
      json: async () => ({ message: "Post added successfully" }),
      text: async () => "Mocked fetch response",
    };
  });
  it("should update post", async () => {
    const post = {
      id: 0,
      type: "plantyLife",
      title: "TEST2",
      image: ["1.jpg", "2.jpg"],
      content: "TESTING",
    };
    const result = await updatePost(post);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/update-post", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    expect(result).toEqual({ message: "Post added successfully" });
  });
});

describe("deletePost", () => {
  fetch.mockImplementation(async (url, options) => {
    return {
      ok: true,
      status: vi.fn(),
      json: async () => ({ message: "Post added successfully" }),
      text: async () => "Mocked fetch response",
    };
  });
  it("should delete post", async () => {
    const post = {
      id: 0,
      type: "plantyLife",
      title: "TEST2",
      image: ["1.jpg", "2.jpg"],
      content: "TESTING",
    };
    const result = await deletePost(post);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`/api/delete-post?id=${post.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    expect(result).toEqual({ message: "Post added successfully" });
  });
});

