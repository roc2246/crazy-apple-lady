class DOM {
  createElement(type, eleName, content) {
    const element = document.createElement(`${type}`);
    element.classList.add(`create-post__${eleName}`);
    element.innerText = content;
    return element;
  }

  checkElement(eleName, element) {
    if (!document.querySelector(`.create-post__${eleName}`)) {
      document.querySelector(".create-post").append(element);
    }
  }
}

class MessageRenderer extends DOM {
  success() {
    const element = this.createElement(
      "h1",
      "success",
      "Post Added"
    );
    this.checkElement("success", element);
  }

  error(errorMsg) {
    const element = this.createElement("h1", "error", errorMsg);
    this.checkElement("error", element);
  }
}

class FormHandler {
  constructor(type, title, image, content) {
    if (!type || !title || !content) {
      throw new Error("Type, title, and content are required.");
    }
    this.type = type;
    this.title = title;
    this.image = image;
    this.content = content;
  }

  resetForm() {
    document.querySelector(".create-post__form").reset();
  }

  validate() {
    const isValid = this.type && this.title && this.content;
    if (!isValid) {
      throw new Error("Type, title, and content are required.");
    }
  }

  static async upload(){
      const formData = new FormData();
      formData.append('image', document.querySelector(".create-post__img").files[0]);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw Error;
      }
      return formData
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
      throw new Error(`${response.status} error`);
    }
  }
}

document
  .querySelector(".create-post__form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPost = {
      type: document.querySelector(".create-post__type").value,
      title: document.querySelector(".create-post__title").value,
      image: handler.upload() || null,
      content: document.querySelector(".create-post__content").value,
    };

    const postReq = new Post(
      newPost.type,
      newPost.title,
      newPost.image,
      ContentFormatter.addPTags(newPost.content)
    );

    const handler = new FormHandler(
      newPost.type,
      newPost.title,
      newPost.image,
      newPost.content
    );

    const messageRenderer = new MessageRenderer();
    try {

      handler.validate();
      await postReq.add();
      handler.resetForm();
      messageRenderer.success();
    } catch (error) {
      messageRenderer.error(error.message);
    }
  });
