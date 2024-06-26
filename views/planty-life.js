function createLink(id, title) {
  const link = document.createElement("a");

  link.classList.add("planty-life__link")
  link.innerText = title;
  link.href = `/post?id=${id}`;

  const listItem = document.createElement("li")
  link.classList.add("planty-life__list-item")


  listItem.append(link)
  return listItem;
}

function createError(){
  const tag = document.createElement("h1")
  tag.classList.add("planty-life__error")
  tag.innerText = "No blog posts available"
  console.log(tag)
  return tag
}

fetch("/api/get-post-titles?type=plantyLife")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); 
  })
  .then((data) => {
    const links = document.getElementsByClassName("planty-life__links")[0];
    if (data.length > 0) {
      links.innerText = " ";
      for (let x = 0; x < data.length; x++) {
        links.append(createLink(data[x].id, data[x].title));
      }
    } else {
      links.innerText = createError().textContent
    }
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
