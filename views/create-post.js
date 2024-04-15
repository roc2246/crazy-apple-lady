class DOMmanipulation {
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

class MessageRenderer extends DOMmanipulation {
  success() {
    const element = this.createElement("h1", "success", "Post Added");
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

  static resetForm() {
    document.querySelector(".create-post__form").reset();
  }

  validate() {
    const isValid = () => this.type && this.title && this.content;
    if (!isValid()) {
      throw new Error("Type, title, and content are required.");
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

document
  .querySelector(".create-post__form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPost = {
      type: document.querySelector(".create-post__type").value,
      title: document.querySelector(".create-post__title").value,
      image: document.querySelector(".create-post__img").value || null,
      content: document.querySelector(".create-post__content").value,
    };

    const postReq = new Post(
      newPost.type,
      newPost.title,
      newPost.image,
      ContentFormatter.addPTags(newPost.content)
    );

    try {
      new FormHandler(
        newPost.type,
        newPost.title,
        newPost.image,
        newPost.content
      ).validate();

      await postReq.add();
      
      new MessageRenderer().success();
    } catch (error) {
      new MessageRenderer().error(error.message);
    }
  });
