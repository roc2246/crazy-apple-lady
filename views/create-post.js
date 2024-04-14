class ContentFormatter {
  static addPTags(text) {
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
    this.content = ContentFormatter.addPTags(content);
  }

  async add() {
    try {
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
        throw new Error("Failed to create post");
      }
    } catch (error) {
      throw error;
    }
  }
}

class DomManipulation {
  static success() {
    const tag = document.createElement("h1");
    tag.id = "success";
    tag.innerText = "Post successfully added";
    document.querySelector(".create-post__form").reset();

    if (!document.getElementById("success")) {
      document.querySelector(".create-post").append(tag);
    }
  }

  static error(message) {
    const tag = document.createElement("h1");
    tag.id = "error";
    tag.innerText = message;

    if (!document.getElementById("error")) {
      document.querySelector(".create-post").append(tag);
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
      newPost.content
    );

    try {
      await postReq.add();
      DomManipulation.success();
    } catch (error) {
      DomManipulation.error(error.message);
    }
  });
