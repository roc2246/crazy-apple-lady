// NOTE: IF means interface

class ContentFormatterIF {
  addPTags(text) {
    if (typeof text !== "string") {
      throw new Error("Text must be a string");
    }
  }
}

class ConfirmationIF {
  success(tag) {
    if (document.getElementById("error")) {
      document.querySelector(".create-post").remove(tag);
    }

    if (!document.getElementById("success")) {
      document.querySelector(".create-post").append(tag);
    }
  }

  error(tag) {
    if (document.getElementById("success")) {
      document.querySelector(".create-post").append(tag);
    }

    if (!document.getElementById("error")) {
      document.querySelector(".create-post").append(tag);
    }
  }
}

class ContentFormatter extends ContentFormatterIF {
  addPTags(text) {
    try {
      super.addPTags(text);

      text = text.replace(/\n\n+/g, '</p><p class="post__paragraph">');
      if (!text.startsWith('<p class="post__paragraph">')) {
        text = '<p class="post__paragraph">' + text;
      }
      if (!text.endsWith("</p>")) {
        text += "</p>";
      }
      return text;
    } catch (error) {
      throw new Error(error.message);
    }
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

class Confirmation extends ConfirmationIF {
  success() {
    const tag = document.createElement("h1");
    tag.id = "success";
    tag.innerText = "Post successfully added";
    document.querySelector(".create-post__form").reset();
    super.success(tag);
  }

  error(message) {
    const tag = document.createElement("h1");
    tag.id = "error";
    tag.innerText = message;
    super.error(tag);
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

    const formatter = new ContentFormatter

    const postReq = new Post(
      newPost.type,
      newPost.title,
      newPost.image,
      formatter.addPTags(newPost.content)
    );

    const confirmation = new Confirmation();

    try {
      await postReq.add();
      confirmation.success();
    } catch (error) {
      confirmation.error(error.message);
    }
  });
