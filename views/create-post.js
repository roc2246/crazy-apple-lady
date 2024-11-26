import * as controllers from "/libraries/CRUD-posts.js";
import * as images from "/libraries/CRUD-images.js";
import * as DOM from "/libraries/CRUD-DOM.js";



document
  .querySelector(".create-post__form")
  .addEventListener("submit", async (e) => {
   
    try {
      e.preventDefault();
    
      const input = {
        imgs: document.querySelector(".create-post__img").files,
        tag: document.querySelector(".create-post__title").value
      }

      let imgNames = []
      for(const img of input.imgs){
        imgNames.push(`${input.tag}-${img.name}`)
      }

      const newPost = {
        type: document.querySelector(".create-post__type").value,
        title: document.querySelector(".create-post__title").value,
        image: imgNames,
        content: document.querySelector(".create-post__content").value,
      };

      const controller = {
        imgs:await images.uploadImages(input),
        post:await controllers.createPost(newPost),
      }

      DOM.createMssg(controller.imgs.message);
      DOM.createMssg(controller.post.message);
    } catch (error) {
      DOM.createMssg(error);
    }
  });
