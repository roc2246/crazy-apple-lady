import * as controllers from "/libraries/login.js";
import * as DOM from "/libraries/CRUD-DOM.js";

document
  .getElementsByClassName("login")[0]
  .addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      const credentials = {
        username: document.getElementById("name").value,
        password: document.getElementById("password").value,
      };
      if(credentials.username.trim().length === 0||credentials.password.trim().length === 0 ){
        throw new Error("Please enter a username and password")
      }
      const results = await controllers.login(credentials);
      if (results.message === "Login succeeded") {
        window.location.replace("/dashboard");
      }
    } catch (error) {
      DOM.createMssg(error);
    }
  });
