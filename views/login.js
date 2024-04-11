class LoginClient {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async login() {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
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

  error(message) {
    const tag = document.createElement("h1");
    tag.id = "error";
    tag.innerText = message;

    if (!document.getElementById("error")) {
      document.getElementsByClassName("main")[0].append(tag);
    }
  }
}

document
  .getElementsByClassName("login")[0]
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      username: document.getElementById("name").value,
      password: document.getElementById("password").value,
    };

    const loginClient = new LoginClient(
      credentials.username,
      credentials.password
    );

    try {
      await loginClient.login();
      window.location.replace("/dashboard.html");
    } catch (error) {
      loginClient.error(error.message);
    }
  });
