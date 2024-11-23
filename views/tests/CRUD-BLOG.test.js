import { it, vi } from "vitest";
import { generateBlogTitles } from "../libraries/CRUD-blog";
import { describe } from "node:test";

// Mocking `fetch` globally
global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});

function mockImpl(message) {
  const mockParams = {
    ok: true,
    status: vi.fn(),
    json: async () => ({ message }),
    text: async () => "Mocked fetch response",
  };
  fetch.mockImplementation(async (url, options) => mockParams);
}

describe("generate blog titles", () => {
  it("should generate mushroom blog titles", async () => {
    mockImpl({});
    const input = "mushroomBlog";
    const url = `/api/get-post-titles?type=${input}`;
    const results = await generateBlogTitles(input);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url);
    expect(results).toEqual({ message: {} });
  });
});
