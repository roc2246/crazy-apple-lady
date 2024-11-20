export async function generateBlogTitles(input) {
  try {
    if(typeof input !=='string')throw Error("Input must be string");
    const response = await fetch(`/api/get-post-titles?type=${input}`);
    if (!response.ok) throw new Error("Network response was not ok");

    const titles = await response.json();
    if (titles.length === 0) throw Error("No posts available");
    return titles;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
