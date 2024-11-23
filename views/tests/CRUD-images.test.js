import { it, vi, describe } from "vitest";
import * as control from "../libraries/CRUD-images";

global.fetch = vi.fn();
beforeEach(() => {
  fetch.mockClear();
});
function mockImpl(message){
  const mockParams = {
    ok: true,
    status: vi.fn(),
    json: async () => ({ message }),
    text: async () => "Mocked fetch response",
  };
  fetch.mockImplementation(async (url, options) => mockParams);
}

describe("uploading images", () => {
  it("should upload images", async () => {
    mockImpl("Images uploaded successfully")
    const imgs = { files: [["img.jpg"]] };
    const fetchInput = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: control.formData(imgs),
    };
    const url = "/api/upload-images";
    const result = await control.uploadImages(imgs);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Images uploaded successfully" });
  });
});

describe("update images", () => {
  it("should update images", async () => {
    mockImpl("Images updated successfully")
    const imgs = { files: [["img2.jpg"]] };
    const fetchInput = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: control.formData(imgs),
    };
    const url = "/api/update-images";
    const result = await control.updateImages(imgs);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Images updated successfully" });
  });
});

describe("delete images", () => {
  it("should delete images", async () => {
    mockImpl("Images deleted successfully")
    const imgs = { files: [["img2.jpg"]] };
    const fetchInput = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: control.formData(imgs),
    };
    const url = "/api/delete-images";
    const result = await control.deleteImages(imgs);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, fetchInput);
    expect(result).toEqual({ message: "Images deleted successfully" });
  });
});
