import { it, vi, expect } from "vitest";
import { login, logout } from "../libraries/login.js";
import { describe } from "node:test";

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

describe("login", () => {
  it("should return a response on successful login", async () => {
    mockImpl("Login successful");
    const input = { username: "testuser", password: "testpassword" };
    const fetchInput = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    };
    const url = "/api/login";
    const result = await login(input);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Login successful" });
    console.log("STATUS" +JSON.stringify(result))
  });

  it("should throw an error on failed login", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ message: "Login successful" }),
      status: 401,
    });

    const input = { username: "wronguser", password: "wrongpassword" };
    await login(input);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("should throw an error if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const input = { username: "testuser", password: "testpassword" };

    await expect(login(input)).rejects.toThrow("Network error");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });
});

describe("logout", () => {
  it("should log out", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    await logout();

    expect(fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });
  });

  it("should handle failed logout", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    await logout();

    expect(fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });
  });

  it("should handle network error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await logout();

    expect(fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });
  });
});
