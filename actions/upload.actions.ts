"use server";

import { getDjangoBaseUrl } from "@/lib/api/django-client";
import { cookies } from "next/headers";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("jobsorbit_jwt_token")?.value;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${getDjangoBaseUrl()}/upload/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return {
        success: false,
        error: err.error || err.detail || `Upload failed with status ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      url: data.url,
      publicId: data.publicId || data.public_id,
    };
  } catch (error) {
    console.error("[uploadImageAction Error]:", error);
    return { success: false, error: (error as Error).message || "Upload failed" };
  }
}

export async function deleteImageAction(publicId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jobsorbit_jwt_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${getDjangoBaseUrl()}/upload/`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ publicId }),
    });

    if (!res.ok) return { success: false };
    const data = await res.json();
    return { success: data.success ?? true };
  } catch (error) {
    console.error("[deleteImageAction Error]:", error);
    return { success: false, error: "Failed to delete image" };
  }
}
