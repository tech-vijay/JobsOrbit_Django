import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().optional(),
  coverImageId: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).or(z.string()).transform((val) => {
    if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter((s) => s !== "");
    return val;
  }).optional(),
  status: z.enum(["draft", "published"]).default("published"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
