import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  fileBase64: string,
  folder = "careerhub"
): Promise<{ url: string; publicId: string } | null> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary credentials not configured in environment variables.");
    }

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: "image",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("[uploadToCloudinary Error]:", error);
    return null;
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) return false;
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("[deleteFromCloudinary Error]:", error);
    return false;
  }
}

export default cloudinary;
