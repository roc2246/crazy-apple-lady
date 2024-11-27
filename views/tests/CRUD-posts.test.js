import { it, vi, describe } from "vitest";
import * as control from "../libraries/CRUD-posts";
import * as DOM from '../libraries/CRUD-DOM.js'

global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});
function mockImpl(message){
  const mockParams = {
    ok: true,
    status: vi.fn(),
    json: async () => ({ message }),
    text: async () => "Mocked fetch response",
  };
  fetch.mockImplementation(async (url, options) => mockParams);
}


describe("createPost", () => {
  it("should create a new post", async () => {
    mockImpl("Post added successfully")
    const post = {
      id: 0,
      type: "plantyLife",
      title: "TEST",
      image: ["1.jpg", "2.jpg"],
      content: DOM.addPTags("TESTING"),
    };
    const fetchInput = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    };
    const url = "/api/new-post";
    const result = await control.createPost(post);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Post added successfully" });
  });
});

describe("updatePost", () => {
  it("should update post", async () => {
    mockImpl("Post updated successfully" )
    const post = {
      id: 0,
      type: "plantyLife",
      title: "TEST2",
      image: ["1.jpg", "2.jpg"],
      content: "TESTING",
    };
    const fetchInput = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    };
    const url = "/api/update-post";
    const result = await control.updatePost(post);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Post updated successfully" });
  });
});

describe("deletePost", () => {
  it("should delete post", async () => {
    mockImpl("Post deleted successfully" )
    const post = {
      id: 0,
      type: "plantyLife",
      title: "TEST2",
      image: ["1.jpg", "2.jpg"],
      content: "TESTING",
    };
    const fetchInput = {
      method: "DELETE",
    };
    const url = `/api/delete-post?id=${post.id}`;
    const result = await control.deletePost(post.id);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Post deleted successfully" });
  });
});
