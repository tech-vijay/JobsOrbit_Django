"use server";

import { cookies } from "next/headers";
import { fetchDjango } from "@/lib/api/django-client";
import { LoginInput } from "@/validations/auth.schema";

interface DjangoLoginResponse {
  success: boolean;
  token: string;
  access: string;
  refresh: string;
  user: {
    id: string;
    _id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function loginAdminAction(data: LoginInput) {
  try {
    const res = await fetchDjango<DjangoLoginResponse>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.token) {
      const cookieStore = await cookies();
      // Store token in HTTP-only cookie for secure session management
      cookieStore.set("jobsorbit_jwt_token", res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      cookieStore.set("jobsorbit_user_role", res.user.role || "admin", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return { success: true, user: res.user };
    }

    return { success: false, error: "Failed to authenticate" };
  } catch (error) {
    console.error("[loginAdminAction Error]:", error);
    return {
      success: false,
      error: (error as Error).message || "Invalid email or password",
    };
  }
}

export async function logoutAdminAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("jobsorbit_jwt_token");
    cookieStore.delete("jobsorbit_user_role");
    return { success: true };
  } catch (error) {
    console.error("[logoutAdminAction Error]:", error);
    return { success: false };
  }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jobsorbit_jwt_token")?.value;
    if (!token) return null;

    const res = await fetchDjango<{ success: boolean; user: { id: string; email: string; name: string; role: string } }>("/auth/me/", {
      method: "GET",
      requiresAuth: true,
    });

    return res.user || null;
  } catch {
    return null;
  }
}
