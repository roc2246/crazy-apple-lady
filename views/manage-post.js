// GENERATES AND FILLS DROPDOWN FOR BLOG TITLES
function createOption(value){
  const option = document.createElement("option")
  option.value = value
  option.innerText = value
  return option
}

(async ()=>{
    try {
        const response = await fetch("/api/get-posts");
        const data = await response.json();
        for(let x = 0; x < data.length; x++){
          document.querySelector(".manage-post__select").append(createOption(data[x].title))
        }
      } catch (error) {
        console.error('Error:', error);
      }
})()