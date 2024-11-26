import * as controllers from "./libraries/CRUD-posts.js";
import * as image from "/libraries/CRUD-images.js";
import * as DOM from "/libraries/CRUD-DOM.js";
import * as utility from "./libraries/utilities.js";

(async () => {
  try {
    const data = await controllers.retrievePosts();
    utility.setOptions(data);
    utility.generateFormData(data);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
})();

document
  .querySelector(".manage-post__select")
  .addEventListener("change", async () => {
    const data = await controllers.retrievePosts();
    utility.generateFormData(data);
  });

document
  .querySelector(".manage-post__update")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const input = {
        imgs: document.querySelector(".manage-post__img").files,
        tag: document.querySelector(".manage-post__title").value,
      };

      let imgNames = [];
      for (const img of input.imgs) {
        imgNames.push(`${input.tag}-${img.name}`);
      }

      const updatedPost = {
        id: postID,
        type: document.querySelector(".manage-post__type").value,
        title: document.querySelector(".manage-post__title").value,
        content: document.querySelector(".manage-post__text").value,
      };

      if (imgNames.length > 0) updatedPost.image = imgNames;

      const controller = {
        post: await controllers.updatePost(updatedPost),
      };

      if (imgNames.length > 0) {
        (controller.imgs = await image.updateImages(input)),
          DOM.createMssg(controller.imgs.message);
      }

      DOM.createMssg(controller.post.message);
    } catch (error) {
      DOM.createMssg(error);
    }
  });

// (() => {
//   const deleteBtn = document.querySelector(".manage-post__delete");
//   deleteBtn.addEventListener("click", async (e) => {
//     e.preventDefault();
//     try {
//       const id =
//         document.querySelector(".manage-post__select").selectedIndex + 1;

//       const response = await fetch(`/api/delete-post?id=${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("Success:", result);
//     } catch (error) {
//       console.log(error);
//       throw Error;
//     }
//   });
// })();
