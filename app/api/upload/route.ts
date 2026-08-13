import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const res = await uploadToCloudinary(base64, "careerhub");

    if (!res) {
      return NextResponse.json(
        { error: "Cloudinary upload failed. Check API credentials." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: res.url,
      publicId: res.publicId,
    });
  } catch (error) {
    console.error("[POST /api/upload Error]:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
