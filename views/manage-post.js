// GENERATES AND FILLS DROPDOWN FOR BLOG TITLES
function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.innerText = value;
  return option;
}

function setOptions(data) {
  const dropdown = document.querySelector(".manage-post__select");
  const addOption = (index) => dropdown.append(createOption(data[index].title));
  for (let x = 0; x < data.length; x++) addOption(x);
}

function getTextBetweenTags(input) {
  const regex = />(.*?)</g; // Regular expression to match text between > and <
  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]); // Capture group 1 contains the text between > and <
  }

  return matches.join("\n");
}

async function retrieveData() {
  try {
    const response = await fetch("/api/get-posts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw Error;
  }
}

function imgInQue(img) {
  const url = document.createElement("h4");
  url.innerText = img;
  url.classList.add("manage-post__qued-img");
  return url;
}

function deleteBtn() {
  const btn = document.createElement("button");
  btn.innerText = "X";
  btn.classList.add("manage-post__delete-img-url");

  return btn;
}

function loadImgURLS(data, index) {
  const pulledImgs = document.querySelector(".manage-post__images");
  const images = data[index].image;

  pulledImgs.innerHTML = " ";
  for (let x = 0; x < images.length; x++) {
    const quedImg = imgInQue(images[x]);
    const deleteTag = deleteBtn(quedImg);

    pulledImgs.append(quedImg);
    pulledImgs.append(deleteTag);
    deleteTag.addEventListener("click", (e) => {
      e.preventDefault();
      quedImg.remove();
      deleteTag.remove();
    });

    const br = document.createElement("br");
    pulledImgs.append(br);
    pulledImgs.append(br);
  }
}

function storeImgURLS() {
  const images = document.getElementsByClassName("manage-post__qued-img");
  let imgs = [];
  for (let x = 0; x < images.length; x++) {
    imgs.push(images[x].innerText);
  }
  return imgs;
}

async function generateFormData(data) {
  const index = document.querySelector(".manage-post__select").selectedIndex;
  const formData = {
    title: document.querySelector(".manage-post__title"),
    type: document.querySelector(".manage-post__type"),
    content: document.querySelector(".manage-post__text"),
  };

  window.postID = data[index].id;
  window.postImg = data[index].image;

  loadImgURLS(data, index);

  formData.title.value = data[index].title;
  formData.type.value = data[index].type;
  formData.content.value = getTextBetweenTags(data[index].content);
}

(async () => {
  try {
    const data = await retrieveData();
    setOptions(data);
    generateFormData(data);
  } catch (error) {
    console.error("Error:", error);
    throw Error;
  }
})();

(() => {
  const dropdown = document.querySelector(".manage-post__select");
  dropdown.addEventListener("change", async () => {
    const data = await retrieveData();
    generateFormData(data);
  });
})();

(() => {
  const updateBtn = document.querySelector(".manage-post__update");
  updateBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const imgs = storeImgURLS()
      console.log(imgs)
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
})();

(() => {
  const deleteBtn = document.querySelector(".manage-post__delete");
  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const id =
        document.querySelector(".manage-post__select").selectedIndex + 1;

      const response = await fetch(`/api/delete-post?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
})();
