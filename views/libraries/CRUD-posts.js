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
        content: input.content,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while adding post:", error);
    throw error;
  }
}
