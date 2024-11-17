export async function login(input) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: input.username,
          password: input.password,
        }),
      });

      if (response.status === 401) {
        throw new Error("Login failed");
      } else {
        return response;
      }
    } catch (error) {
      throw error;
    }
  }