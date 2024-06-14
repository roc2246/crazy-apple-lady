// GENERATES AND FILLS DROPDOWN FOR BLOG TITLES
function createOption(value) {
  const option = document.createElement("option");
  option.value = value;
  option.innerText = value;
  return option;
}

function setOptions(data) {
  for (let x = 0; x < data.length; x++) {
    document
      .querySelector(".manage-post__select")
      .append(createOption(data[x].title));
  }
}

function getTextBetweenTags(input) {
  const regex = />(.*?)</g; // Regular expression to match text between > and <
  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]); // Capture group 1 contains the text between > and <
  }

  return matches;
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

document
  .querySelector(".manage-post__select")
  .addEventListener("change", async () => {
    const data = await retrieveData();
    generateFormData(data);
  });

  
  // EVENT LISTENER FOR SUBMIT
    // ASYNC CALLBACK
      // TRY
        // STORE INDEX OF POST IN CONSTANT VARIABLE
        // STORE DATA WITH RETRIEVE DATA FUNCTION
        // USE FETCH TO UPDATE
      // CATCH
        // CONSOLE LOG ERROR
        // THROW ERROR