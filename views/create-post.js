class Post {
  constructor(type, title, image, content) {
    this.type = type;
    this.title = title;
    this.image = image;
    this.content = content;
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

      if (response.status === 401) {
        throw new Error("Failed to create post");
      } else {
        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  success() {
    const tag = document.createElement("h1");
    tag.id = "success";
    tag.innerText = "Post successfully added";

    if (document.getElementById("error")) {
      document.getElementsByClassName("create-post")[0].append(tag);
    }

    if (!document.getElementById("success")) {
      document.getElementsByClassName("create-post")[0].append(tag);
    }
  }

  error(message) {
    const tag = document.createElement("h1");
    tag.id = "error";
    tag.innerText = message;

    if (document.getElementById("success")) {
      document.getElementsByClassName("create-post")[0].append(tag);
    }

    if (!document.getElementById("error")) {
      document.getElementsByClassName("create-post")[0].append(tag);
    }
  }
}

function addPTags(text) {
  text = text.replace(/\n\n+/g, '</p><p class="post__paragraph">');
  if (text.startsWith('<p class="post__paragraph">') === false) {
      text = '<p class="post__paragraph">' + text;
  }
  if (text.endsWith('</p>') === false) {
      text += '</p>';
  }

  return text;
}

document
  .getElementsByClassName("create-post__form")[0]
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPost = {
      type: document.getElementsByClassName("create-post__type")[0].value,
      title: document.getElementsByClassName("create-post__title")[0].value,
      image:
        document.getElementsByClassName("create-post__img")[0].value || null,
      content: document.getElementsByClassName("create-post__content")[0].value,
    };

    const postReq = new Post(
      newPost.type,
      newPost.title,
      newPost.image,
      addPTags(newPost.content)
    );

    try {
      const sendPost = await postReq.add();

      sendPost.status === 201 ? postReq.success() : Error;
    } catch (error) {
      postReq.error(error.message);
    }
  });
