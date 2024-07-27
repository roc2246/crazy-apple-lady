import { expect, it, test, describe, vi } from "vitest";
import { connectToDB, findUser, generatePostID, postRetrieval } from ".";
import { MongoClient } from "mongodb";

vi.mock("mongodb", () => {
  return {
    MongoClient: {
      mocked: true,
    },
  };
});

it("should mock mongodb", () => {
  expect(MongoClient.mocked).toBe(true);
});

describe("Test Connection", () => {
  it("should return connection data", async () => {
    const connection = await connectToDB(MongoClient);
    expect(connection).toHaveProperty("db");

    expect(connection).toHaveProperty("client");
  });
});

describe("Login", () => {
  it("should find a user", async () => {
    const user = await findUser("Mindy");
    expect(user.username).toBe("Mindy");
  });
});

describe("Post ID Management", () => {
  test("Type of data for ID", async () => {
    const ID = await generatePostID();
    expect(typeof ID).toBe("number");
    expect(Number.isInteger(ID)).toBe(true);
  });
});

describe("Post Retrieval", () => {
  test("Throw Post Retrieval Error", async () => {
    const match = { id: "Invalid ID" };
    const post = postRetrieval(match);
    const errorMssg = "Post not found";
    await expect(post).rejects.toThrowError(errorMssg);
  });
  test("Get Post", async () => {
    const match = { id: 1 };
    const post = await postRetrieval(match);
    expect(post).toBeInstanceOf(Array);
  });
  test("Get Posts", async () => {
    const match = {};
    const post = await postRetrieval(match);
    expect(post).toBeInstanceOf(Array);
  });
  test("Get Post Names", async () => {
    const plantyLifeMatch = { type: "plantyLife" };
    const mushroomBlogsMatch = { type: "mushroomBlog" };
    const project = { _id: 0, id: 1, title: 1 };

    const plantyLifePosts = await postRetrieval(plantyLifeMatch, project);
    const mushroomBlogsPosts = await postRetrieval(mushroomBlogsMatch, project);

    expect(plantyLifePosts).toBeInstanceOf(Array);
    expect(mushroomBlogsPosts).toBeInstanceOf(Array);
  });
});
