"use server";

import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary/cloudinary";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const res = await uploadToCloudinary(base64, "careerhub");
    if (!res) {
      return { success: false, error: "Cloudinary upload failed. Check environment variables." };
    }

    return {
      success: true,
      url: res.url,
      publicId: res.publicId,
    };
  } catch (error) {
    console.error("[uploadImageAction Error]:", error);
    return { success: false, error: (error as Error).message || "Upload failed" };
  }
}

export async function deleteImageAction(publicId: string) {
  try {
    const deleted = await deleteFromCloudinary(publicId);
    return { success: deleted };
  } catch (error) {
    console.error("[deleteImageAction Error]:", error);
    return { success: false, error: "Failed to delete image" };
  }
}
