import { vi, describe, it, expect } from "vitest";
import { connectToDB } from "."; 


describe("connectToDB", () => {
  it("should return db and client", async () => {
    // Mock the MongoClient and its methods
    const mockConnect = vi.fn().mockResolvedValue({});
    const mockDb = vi.fn().mockReturnThis();
    const mockClient = {
      connect: mockConnect,
      db: mockDb,
    };

    // Mock the MongoClient constructor to return our mocked client
    const MongoClientInstance = vi.fn().mockReturnValue(mockClient);

    // Call the function
    const result = await connectToDB(MongoClientInstance, "mock-uri");

    // Assertions
    expect(MongoClientInstance).toHaveBeenCalledWith("mock-uri");
    expect(mockConnect).toHaveBeenCalled();
    expect(result).toEqual({ db: mockClient, client: mockClient });
  });

  it("should throw an error if connection fails", async () => {
    // Mock the MongoClient and force it to throw an error
    const mockConnect = vi.fn().mockRejectedValue(new Error("Connection failed"));
    const mockClient = {
      connect: mockConnect,
    };
    const MongoClientInstance = vi.fn().mockReturnValue(mockClient);

    // Expect the function to throw
    await expect(connectToDB(MongoClientInstance, "mock-uri")).rejects.toThrow("Connection failed");
  });
});