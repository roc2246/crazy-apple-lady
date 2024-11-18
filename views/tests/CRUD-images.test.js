import { it, vi } from "vitest";
import { deleteImages, formData, updateImages, uploadImages } from "../libraries/CRUD-images";

// Mocking `fetch` globally
global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});



it("should upload images", async () => {
    fetch.mockImplementation(async (url, options) => {
        return {
          ok: true,
          status: vi.fn(),
          json: async () => ({ message: "Images uploaded successfully" }),
          text: async () => "Mocked fetch response",
        };
      });
  const imgs = { files: [["img.jpp"]] };
 
  const result =  await uploadImages(imgs);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/upload-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: formData(imgs),
    });
    expect(result).toEqual({ message: "Images uploaded successfully" });
});


it("should update images", async () => {
    fetch.mockImplementation(async (url, options) => {
        return {
          ok: true,
          status: vi.fn(),
          json: async () => ({ message: "Images updateed successfully" }),
          text: async () => "Mocked fetch response",
        };
      });
  const imgs = { files: [["img2.jpg"]] };
 
  const result =  await updateImages(imgs);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/update-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: formData(imgs),
    });
    expect(result).toEqual({ message: "Images updateed successfully" });
});

it("should delete images", async () => {
    fetch.mockImplementation(async (url, options) => {
        return {
          ok: true,
          status: vi.fn(),
          json: async () => ({ message: "Images deleted successfully" }),
          text: async () => "Mocked fetch response",
        };
      });
  const imgs = { files: [["img2.jpg"]] };
 
  const result =  await deleteImages(imgs);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/delete-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: formData(imgs),
    });
    expect(result).toEqual({ message: "Images deleted successfully" });
});