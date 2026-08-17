"use server";

import { revalidatePath } from "next/cache";
import { fetchDjango } from "@/lib/api/django-client";
import { categorySchema, CategoryInput } from "@/validations/category.schema";
import { ICategory } from "@/types/category.types";

interface DjangoCategoryListResponse {
  count?: number;
  results?: ICategory[];
}

export async function seedCategories() {
  try {
    await fetchDjango("/categories/seed/", {
      method: "POST",
    });
  } catch (error) {
    console.error("[seedCategories Error]:", error);
  }
}

export async function getCategories(search?: string): Promise<ICategory[]> {
  try {
    const data = await fetchDjango<ICategory[] | DjangoCategoryListResponse>("/categories/", {
      params: search && search.trim() !== "" ? { search: search.trim() } : undefined,
    });

    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  } catch (error) {
    console.error("[getCategories Error]:", error);
    return [];
  }
}

export async function getCategoriesWithCounts(): Promise<(ICategory & { count: number })[]> {
  try {
    const data = await fetchDjango<(ICategory & { count: number })[]>("/categories/with_counts/");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[getCategoriesWithCounts Error]:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<ICategory | null> {
  try {
    const data = await fetchDjango<ICategory>(`/categories/${id}/`);
    return data || null;
  } catch (error) {
    console.error("[getCategoryById Error]:", error);
    return null;
  }
}

export async function createCategory(input: CategoryInput) {
  try {
    const validated = categorySchema.parse(input);

    const category = await fetchDjango<ICategory>("/categories/", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        seo_title: validated.seoTitle,
        seo_description: validated.seoDescription,
      }),
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("[createCategory Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create category" };
  }
}

export async function updateCategory(id: string, input: CategoryInput) {
  try {
    const validated = categorySchema.parse(input);

    const category = await fetchDjango<ICategory>(`/categories/${id}/`, {
      method: "PUT",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        seo_title: validated.seoTitle,
        seo_description: validated.seoDescription,
      }),
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true, category };
  } catch (error) {
    console.error("[updateCategory Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await fetchDjango(`/categories/${id}/`, {
      method: "DELETE",
      requiresAuth: true,
    });

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("[deleteCategory Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete category" };
  }
}
