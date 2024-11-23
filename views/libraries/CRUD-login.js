export async function newUser(input) {
  try {
    const response = await fetch("/api/new-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: input.username,
        password: input.password,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
