"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPost } from "@/models/BlogPost";
import { User } from "@/models/User";
import { blogPostSchema, BlogPostInput } from "@/validations/blog.schema";
import { generateSlug, generateUniqueSlug } from "@/lib/utils/slug";
import { IBlogPost } from "@/types/blog.types";

export interface GetBlogPostsFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getBlogPosts(filters: GetBlogPostsFilters = {}) {
  try {
    await connectToDatabase();
    const { search, category, status, page = 1, limit = 15 } = filters;
    const query: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { tags: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category && category !== "all") query.category = category;
    if (status && status !== "all") query.status = status;

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .populate("author", "name email")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
    ]);

    return {
      posts: JSON.parse(JSON.stringify(posts)) as IBlogPost[],
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  } catch (error) {
    console.error("[getBlogPosts Error]:", error);
    return { posts: [], total: 0, totalPages: 1, page: 1 };
  }
}

export async function getBlogPostById(id: string): Promise<IBlogPost | null> {
  try {
    await connectToDatabase();
    const post = await BlogPost.findById(id).populate("author").lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("[getBlogPostById Error]:", error);
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<IBlogPost | null> {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug }).populate("author").lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error("[getBlogPostBySlug Error]:", error);
    return null;
  }
}

export async function createBlogPost(input: BlogPostInput) {
  try {
    const validated = blogPostSchema.parse(input);
    await connectToDatabase();

    const baseSlug = validated.slug && validated.slug.trim() !== ""
      ? generateSlug(validated.slug)
      : generateSlug(validated.title);

    const existingSlug = await BlogPost.findOne({ slug: baseSlug });
    const finalSlug = existingSlug ? generateUniqueSlug(baseSlug) : baseSlug;

    const post = await BlogPost.create({
      ...validated,
      slug: finalSlug,
      publishedAt: validated.status === "published" ? new Date() : undefined,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");
    return { success: true, post: JSON.parse(JSON.stringify(post)) };
  } catch (error) {
    console.error("[createBlogPost Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create blog post" };
  }
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  try {
    const validated = blogPostSchema.parse(input);
    await connectToDatabase();

    const existing = await BlogPost.findById(id);
    if (!existing) return { success: false, error: "Blog post not found" };

    let slug = existing.slug;
    if (validated.slug && validated.slug.trim() !== "") {
      slug = generateSlug(validated.slug);
    } else if (validated.title !== existing.title) {
      slug = generateSlug(validated.title);
    }

    const updated = await BlogPost.findByIdAndUpdate(
      id,
      {
        ...validated,
        slug,
      },
      { new: true, runValidators: true }
    ).lean();

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return { success: true, post: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("[updateBlogPost Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update blog post" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await connectToDatabase();
    await BlogPost.findByIdAndDelete(id);

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
    await connectToDatabase();
    const update: Record<string, unknown> = { status: newStatus };
    if (newStatus === "published") update.publishedAt = new Date();

    await BlogPost.findByIdAndUpdate(id, update);

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("[toggleBlogPostStatus Error]:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}
