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
    console.log(response)
    const data = await response.json();
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
