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

async function generateFormData(data) {
  const index = document.querySelector(".manage-post__select").selectedIndex;
  const formData = {
    title: document.querySelector(".manage-post__title"),
    content: document.querySelector(".manage-post__text"),
  };

  formData.title.value = data[index].title;
  formData.content.value = getTextBetweenTags(data[index].content);
}
// test12
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
      const updatedPost = {
        id: document.querySelector(".manage-post__select").selectedIndex + 1,
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
