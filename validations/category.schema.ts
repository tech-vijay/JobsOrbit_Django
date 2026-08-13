import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
