// GENERATES AND FILLS DROPDOWN FOR BLOG TITLES
export function createOption(value) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = value;
    return option;
  }
  
  export function setOptions(data) {
    const dropdown = document.querySelector(".manage-post__select");
    const addOption = (index) => dropdown.append(createOption(data[index].title));
    for (let x = 0; x < data.length; x++) addOption(x);
  }
  
  export function getTextBetweenTags(input) {
    const regex = />(.*?)</g; // Regular expression to match text between > and <
    const matches = [];
    let match;
  
    while ((match = regex.exec(input)) !== null) {
      matches.push(match[1]); // Capture group 1 contains the text between > and <
    }
  
    return matches.join("\n");
  }
  
  export async function generateFormData(data) {
    const index = document.querySelector(".manage-post__select").selectedIndex;
    const formData = {
      title: document.querySelector(".manage-post__title"),
      type: document.querySelector(".manage-post__type"),
      content: document.querySelector(".manage-post__text"),
    };
  
    window.postID = data[index].id;
    window.postImg = data[index].image;
  
    formData.title.value = data[index].title;
    formData.type.value = data[index].type;
    formData.content.value = getTextBetweenTags(data[index].content)
  }
  