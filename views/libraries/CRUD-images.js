export function formData(input) {
  const formData = new FormData();
  if (input.imgs) {
    for (const file of input.imgs) {
      formData.append("image", file);
    }
  }

  formData.append("tag", input.tag);
  return formData;
}
export async function uploadImages(input) {
  try {
    // INPUT IS DOC.GETELEMENY BY ETC
    const response = await fetch("/api/upload-images", {
      method: "POST",
      body: formData(input),
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
  
    const responseText = await response.text(); // Use `text()` instead of `json()` to inspect raw response
    console.log("Response body:", responseText);
  
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
  
    const data = JSON.parse(responseText); // Parse JSON manually if the response is valid
    return data;
  } catch (error) {
    console.error("Error while uploading images:", error);
    throw error;
  }
}

export async function updateImages(input) {
  try {
    // INPUT IS DOC.GETELEMENY BY ETC
    const response = await fetch("/api/update-images", {
      method: "PUT",
      body: formData(input),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while updating images:", error);
    throw error;
  }
}

export async function deleteImages(input) {
  try {
    // INPUT IS DOC.GETELEMENY BY ETC
    const response = await fetch("/api/delete-images", {
      method: "DELETE",
      body: formData(input),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while deleting images:", error);
    throw error;
  }
}
