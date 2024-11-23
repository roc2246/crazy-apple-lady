import { it, vi } from "vitest";
import { newUser } from "../libraries/CRUD-login.js";
import { describe } from "node:test";

// Mocking `fetch` globally
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


// Example: Setting up a default mock response
describe("Adding new user", () => {
  it("should add new user to database", async () => {
    mockImpl("User added successfully" )
    const user = {
      username: "TEST12",
      password: "TEST34",
    };
    const fetchInput = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };
    const url = "/api/new-user";
    const result = await newUser(user);
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "User added successfully" });
  });
});
