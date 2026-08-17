"use server";

import { revalidatePath } from "next/cache";
import { fetchDjango } from "@/lib/api/django-client";
import { blogPostSchema, BlogPostInput } from "@/validations/blog.schema";
import { IBlogPost } from "@/types/blog.types";

export interface GetBlogPostsFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface DjangoPaginatedBlogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IBlogPost[];
}

export async function getBlogPosts(filters: GetBlogPostsFilters = {}) {
  try {
    const { search, category, status, page = 1, limit = 15 } = filters;

    const queryParams: Record<string, string | number | boolean | undefined> = {
      page,
      page_size: limit,
    };

    if (search && search.trim() !== "") queryParams.search = search.trim();
    if (category && category !== "all") queryParams.category = category;
    if (status && status !== "all") queryParams.status = status;

    const data = await fetchDjango<DjangoPaginatedBlogResponse | IBlogPost[]>("/blog/", {
      params: queryParams,
    });

    if (Array.isArray(data)) {
      return {
        posts: data,
        total: data.length,
        totalPages: 1,
        page: 1,
      };
    }

    const total = data.count || 0;
    return {
      posts: data.results || [],
      total,
      totalPages: Math.ceil(total / limit) || 1,
      page,
    };
  } catch (error) {
    console.error("[getBlogPosts Error]:", error);
    return { posts: [], total: 0, totalPages: 1, page: 1 };
  }
}

export async function getBlogPostById(id: string): Promise<IBlogPost | null> {
  try {
    const data = await fetchDjango<IBlogPost>(`/blog/${id}/`);
    return data || null;
  } catch (error) {
    console.error("[getBlogPostById Error]:", error);
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<IBlogPost | null> {
  try {
    const data = await fetchDjango<IBlogPost>(`/blog/${slug}/`);
    return data || null;
  } catch (error) {
    console.error("[getBlogPostBySlug Error]:", error);
    return null;
  }
}

export async function createBlogPost(input: BlogPostInput) {
  try {
    const validated = blogPostSchema.parse(input);

    const post = await fetchDjango<IBlogPost>("/blog/", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        cover_image: validated.coverImage,
        cover_image_id: validated.coverImageId,
        seo_title: validated.seoTitle,
        seo_description: validated.seoDescription,
      }),
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("[createBlogPost Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create blog post" };
  }
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  try {
    const validated = blogPostSchema.parse(input);

    const post = await fetchDjango<IBlogPost>(`/blog/${id}/`, {
      method: "PUT",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        cover_image: validated.coverImage,
        cover_image_id: validated.coverImageId,
        seo_title: validated.seoTitle,
        seo_description: validated.seoDescription,
      }),
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    if (post.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }
    return { success: true, post };
  } catch (error) {
    console.error("[updateBlogPost Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update blog post" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await fetchDjango(`/blog/${id}/`, {
      method: "DELETE",
      requiresAuth: true,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[deleteBlogPost Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete blog post" };
  }
}

export async function toggleBlogPostStatus(id: string, newStatus: "draft" | "published") {
  try {
    const res = await fetchDjango<{ success: boolean; post?: IBlogPost }>(`/blog/${id}/toggle_status/`, {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify({ status: newStatus }),
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: res.success ?? true };
  } catch (error) {
    console.error("[toggleBlogPostStatus Error]:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}
