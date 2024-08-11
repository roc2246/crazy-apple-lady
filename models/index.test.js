import { expect, it, test, describe, vi } from "vitest";
import {
  connectToDB,
  findUser,
  generatePostID,
  newPost,
  postRetrieval,
} from ".";

// Mock only specific functions
vi.mock(".", async (importOriginal) => {
  const originalModule =  await importOriginal()
  return {
    ...originalModule,
    connectToDB: vi.fn().mockReturnValue({
      db: {
        collection: vi.fn(),
      },
    })
  };
});

describe("Connectiong to DB", () => {
  it("should return db property", async () => {
    const db = await connectToDB();
    expect(db).toHaveProperty("db");
  });
});


describe("Login", () => {
  it("should find a user", async () => {
    const user = await findUser("Mindy");
    expect(user.username).toBe("Mindy");
  });
  it("should return null", async () => {
    const user = await findUser("Test");
    expect(user).toBeNull()
  });
});

