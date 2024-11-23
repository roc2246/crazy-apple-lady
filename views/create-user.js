import * as controllers from "/libraries/CRUD-login.js";
import * as DOM from "/libraries/CRUD-DOM.js"


document
  .querySelector(".create-user__submit")
  .addEventListener("click", async (e) => {
    try {
      e.preventDefault();

      const credentials = {
        username: document.getElementById("name").value,
        password: document.getElementById("password").value,
      };
      const results = await controllers.newUser(credentials);
      DOM.createMssg(results.message);
    } catch (error) {
      DOM.createMssg(error);
    }
  });
