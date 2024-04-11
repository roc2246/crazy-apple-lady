function createError(message) {
  const tag = document.createElement("h1");
  tag.id = "error";
  tag.innerText = message;
  return tag;
}

async function login(username, password) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
  } catch (error) {
    if (!document.getElementById("error")) {
      document
        .getElementsByClassName("main")[0]
        .append(createError(error.message));
    }
  }
}

document.getElementsByClassName("login")[0].addEventListener("submit", (e) => {
  const username = document.getElementById("name");
  const password = document.getElementById("password");

  e.preventDefault();
  login(username, password);
});
