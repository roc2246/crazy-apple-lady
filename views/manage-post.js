// GENERATES AND FILLS DROPDOWN FOR BLOG TITLES
(async ()=>{
    try {
        const response = await fetch("/api/get-posts");
        const data = await response.json();
        console.log(data[0]);
      } catch (error) {
        console.error('Error:', error);
      }
})()