import * as DOM from './CRUD-DOM.js'

export async function createPost(input) {
  try {
    const response = await fetch("/api/new-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: input.id ,
        type: input.type,
        title: input.title,
        image: input.image,
        content: DOM.addPTags(input.content),
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while adding post:", error);
    throw error;
  }
}

export async function retrievePosts() {
    try {
    const response = await fetch("/api/get-posts");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updatePost(input) {
  try {
    const response = await fetch("/api/update-post", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: input.id ,
        type: input.type,
        title: input.title,
        image: input.image,
        content: input.content,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while updating post:", error);
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(`/api/delete-post?id=${id}`, {
      method: "DELETE"
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while updating post:", error);
    throw error;
  }
}