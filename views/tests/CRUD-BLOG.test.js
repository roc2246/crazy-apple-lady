import { it, vi } from "vitest";
import { generateBlogTitles } from "../libraries/CRUD-blog";

// Mocking `fetch` globally
global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});

it("should generate mushroom blog titles", async () => {
  fetch.mockImplementation(async (url, options) => {
    return {
      ok: true,
      status: vi.fn(),
      json: async () => [{}],
      text: async () => "Mocked fetch response",
    };
  });
  const input = "mushroomBlog";
  const results = await generateBlogTitles(input);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(`/api/get-post-titles?type=${input}`);
  expect(results).toEqual([{}]);
});
