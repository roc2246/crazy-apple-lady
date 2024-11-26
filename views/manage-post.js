import * as controller from './libraries/CRUD-posts.js'
import * as utility from './libraries/utilities.js'

(async () => {
  try {
    const data = await controller.retrievePosts();
    utility.setOptions(data);
    utility.generateFormData(data);
  } catch (error) {
    console.error("Error:", error);
    throw Error;
  }
})();


document.querySelector(".manage-post__select").addEventListener("change", async () => {
    const data = await controller.retrievePosts();
    utility.generateFormData(data);
  });


document.querySelector(".manage-post__update").addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const imgs = storeImgURLS()
      const updatedPost = {
        id: postID,
        type: document.querySelector(".manage-post__type").value,
        title: document.querySelector(".manage-post__title").value,
        image: imgs.length > 0 ? imgs : postImg,
        content: document.querySelector(".manage-post__text").value,
      };

      const response = await fetch("/api/update-post", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.log(error);
      throw Error;
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
