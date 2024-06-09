// GENERATES AND FILLS DROPDOWN FOR BLOG TITLES
(async ()=>{
    try {
        const response = await fetch("/api/get-post-titles");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
})()