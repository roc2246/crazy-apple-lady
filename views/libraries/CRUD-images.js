export function formData(input){
  const file = input.files[0];
  const formData = new FormData();
  formData.append("image", file);
  return formData
}

export async function uploadImages(input) {
  try {
    // INPUT IS DOC.GETELEMENY BY ETC
    const response = await fetch("/api/upload-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData(input),
    });
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: formData(input),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while deleting images:", error);
      throw error;
    }
  }