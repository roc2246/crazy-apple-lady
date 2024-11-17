import { it, vi, expect } from "vitest";
import { login, logout } from "../libraries/login.js";
import { describe } from "node:test";

global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("login", () => {
  it("should return a response on successful login", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ message: "Login successful" }),
    });

    const input = { username: "testuser", password: "testpassword" };
    const response = await login(input);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual({ message: "Login successful" });
    expect(fetch).toHaveBeenCalledWith("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("should throw an error on failed login", async () => {
    fetch.mockResolvedValueOnce({
      status: 401,
    });

    const input = { username: "wronguser", password: "wrongpassword" };

    await expect(login(input)).rejects.toThrow("Login failed");
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
