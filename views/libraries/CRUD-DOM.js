export function createMssg(mssg) {
    const tag = document.createElement("h4");
    tag.classList.add("confirmation__mssg");
    tag.textContent = mssg;
  
    const confirmBox = document.querySelector(".confirmation");
    confirmBox.innerText = " ";
    confirmBox.append(tag);
  }

export function addPTags(text) {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  text = text.replace(/\n\n+/g, '</p><p class="post__paragraph">');
  if (!text.startsWith('<p class="post__paragraph">')) {
    text = '<p class="post__paragraph">' + text;
  }
  if (!text.endsWith("</p>")) {
    text += "</p>";
  }
  return text;
}
