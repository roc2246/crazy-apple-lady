import * as controllers from "/libraries/CRUD-posts.js";
import * as images from "/libraries/CRUD-images.js";
import * as DOM from "/libraries/CRUD-DOM.js";



document
  .querySelector(".create-post__form")
  .addEventListener("submit", async (e) => {
   
    try {
      e.preventDefault();
      const input = document.querySelector(".create-post__img").files

      console.log(input)
      const newPost = {
        type: document.querySelector(".create-post__type").value,
        title: document.querySelector(".create-post__title").value,
        image: images || null,
        content: document.querySelector(".create-post__content").value,
      };
      const bool = {

      }
      // if(newPost.username.trim().length === 0||newPost.password.trim().length === 0 ){
      //   throw new Error("Please enter a username and password")
      // }
      const imgUpload = await images.uploadImages(input)
      
      // const results = await controllers.createPost(newPost);
      // ADD RESULT FOR UPLOADING IMAGES
      DOM.createMssg(results.message);
    } catch (error) {
      DOM.createMssg(results.error);
    }
  });
