import { expect, test } from "vitest";
import { connectToDB, findUser, generatePostID, getData } from ".";
import { describe } from "node:test";

describe("Test Connection", () => {
  test("No Error", async () => {
    const connection = await connectToDB();
    expect(connection).toHaveProperty("db");
    expect(connection).toHaveProperty("client");
  });
});

describe("Login", () => {
  test("Find user", async () => {
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
  //   test("Retrieve Post", async () => {
  //     const post = await getPost(0);
  //     expect(post).toMatchObject(post);
  //   });
  test("Throw Post Retrieval Error", async () => {
    const match = { id: "Invalid ID" };
    const post = getData(match);
    const errorMssg = "Post not found";
    await expect(post).rejects.toThrowError(errorMssg);
  });
});
