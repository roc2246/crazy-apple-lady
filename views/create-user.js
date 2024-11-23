import * as controllers from "/libraries/CRUD-login.js";

document
  .querySelector(".create-user__submit")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    const credentials = {
      username: document.getElementById("name").value,
      password: document.getElementById("password").value,
    };
    const results = await controllers.newUser(credentials);
    console.log(results)
  });
