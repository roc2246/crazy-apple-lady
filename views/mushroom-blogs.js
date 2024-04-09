function createLink(id, title) {
    const link = document.createElement("a");
    link.innerText = title;
    link.href = `/post?id=${id}`;
    return link;
  }
  
  function createError(){
    const tag = document.createElement("h1")
    tag.classList.add = "mushroom-blogs__error"
    tag.innerText = "No blog posts available"
    return tag
  }
  
  fetch("get-post-titles?type=mushroomBlogs")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      const links = document.getElementsByClassName("mushroom-blogs__links")[0];
      if (data.length > 0) {
        links.innerText = " ";
        for (let x = 0; x < data.length; x++) {
          links.append(createLink(data[x].id, data[x].title));
        }
      } else {
        links.innerText = createError()
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
  