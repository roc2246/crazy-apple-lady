class MessageRenderer {
  static renderMessage(type, message) {
    const tag = document.createElement("h1");
    tag.id = `${type}`;
    tag.innerText = type === "success" ? "Post added" : message;
    return tag;
  }
}

class FormHandler {
  static resetForm() {
    document.querySelector(".create-post__form").reset();
  }
}

class DomManipulation {
  static showMessage(type, message) {
    const messageTag = MessageRenderer.renderMessage(type, message);
    FormHandler.resetForm();
    if (!document.getElementById(`${type}`)) {
      document.querySelector(".create-post").append(messageTag);
    }
  }
}

class ContentFormatter {
  static addPTags(text) {
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
}

class Post {
  constructor(type, title, image, content) {
    this.type = type;
    this.title = title;
    this.image = image;
    this.content = content;
  }

  async add() {
    const response = await fetch("/api/new-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: this.type,
        title: this.title,
        image: this.image,
        content: this.content,
      }),
    });

    if (response.status === 201) {
      return response;
    } else {
      throw new Error(`Failed to create post: ${response}`);
    }
  }
}

document.querySelector(".create-post__form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPost = {
    type: document.querySelector(".create-post__type").value,
    title: document.querySelector(".create-post__title").value,
    image: document.querySelector(".create-post__img").value || null,
    content: document.querySelector(".create-post__content").value,
  };

  if (!newPost.type || !newPost.title || !newPost.content) {
    DomManipulation.showMessage("error", "Please fill in all required fields.");
    return;
  }

  const postReq = new Post(
    newPost.type,
    newPost.title,
    newPost.image,
    ContentFormatter.addPTags(newPost.content),
  );

  try {
    await postReq.add();
    DomManipulation.showMessage("success");
  } catch (error) {
    DomManipulation.showMessage("error", error.message || "An error occurred");
  }
});
