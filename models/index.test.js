import { vi, describe, it, expect } from "vitest";
import { connectToDB, findUser } from ".";

// Create a mock for the connectToDB function
const mockConnectToDB = vi.fn();

// Create a mock for the MongoDB collection
const mockFindOne = vi.fn();
const mockCollection = { findOne: mockFindOne };

// Create a mock for the database instance
const mockDb = { collection: vi.fn(() => mockCollection) };

// Create a mock return value for connectToDB
mockConnectToDB.mockResolvedValue({ db: mockDb });

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
    const mockConnect = vi
      .fn()
      .mockRejectedValue(new Error("Connection failed"));
    const mockClient = {
      connect: mockConnect,
    };
    const MongoClientInstance = vi.fn().mockReturnValue(mockClient);

    // Expect the function to throw
    await expect(connectToDB(MongoClientInstance, "mock-uri")).rejects.toThrow(
      "Connection failed"
    );
  });
});


describe('findUser', () => {
  it('should return a user if found', async () => {
    const username = 'testuser';
    const mockUser = { username: 'testuser', email: 'test@example.com' };
    mockFindOne.mockResolvedValue(mockUser);

    const user = await findUser(username, mockConnectToDB);
    expect(user).toEqual(mockUser);
    expect(mockFindOne).toHaveBeenCalledWith({ username });
  });

  it('should return null if no user is found', async () => {
    const username = 'testuser';
    mockFindOne.mockResolvedValue(null);

    const user = await findUser(username, mockConnectToDB);
    expect(user).toBeNull();
    expect(mockFindOne).toHaveBeenCalledWith({ username });
  });

  it('should handle errors gracefully', async () => {
    const username = 'testuser';
    const error = new Error('Test error');
    mockFindOne.mockRejectedValue(error);

    await expect(findUser(username, mockConnectToDB)).rejects.toThrow(error);
  });
});