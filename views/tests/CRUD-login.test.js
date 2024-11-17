import { it, vi } from "vitest"
import { newUser } from "../libraries/CRUD-login.js"

// Mocking `fetch` globally
global.fetch = vi.fn();

// Example: Setting up a default mock response
fetch.mockImplementation(async (url, options) => {
  return {
    ok: true,
    status: vi.fn(),
    json: async () => ({ message: "User added successfully" }),
    text: async () => "Mocked fetch response",
  };
});

it("should add new user to database", async()=>{
   const user = {
      username: "TEST12",
      password: "TEST34"
   }
   const result = await newUser(user)
   expect(fetch).toHaveBeenCalledTimes(1); 
   expect(fetch).toHaveBeenCalledWith(
     "/api/new-user", 
     {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(user),
     }
   );
   expect(result).toEqual({ message: "User added successfully" }); 
})
