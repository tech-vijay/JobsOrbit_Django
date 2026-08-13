import { z } from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  type: z.enum(["job", "internship", "offcampus", "wfh"]),
  company: z.string().min(1, "Company is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "string") return val.split("\n").filter((s) => s.trim() !== "");
      return val || [];
    }),
  requirements: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "string") return val.split("\n").filter((s) => s.trim() !== "");
      return val || [];
    }),
  skills: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter((s) => s !== "");
      return val || [];
    }),
  jobType: z.enum(["full-time", "part-time", "contract", "freelance"]).optional(),
  workMode: z.enum(["remote", "onsite", "hybrid"]).optional(),
  location: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  salaryType: z.enum(["monthly", "yearly", "stipend", "unpaid"]).optional(),
  salaryCurrency: z.string().default("INR"),
  isPaid: z.boolean().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  applicationUrl: z.string().url("Please enter a valid application URL"),
  deadline: z.union([z.string(), z.date()]).optional(),
  status: z.enum(["draft", "published", "expired"]).default("published"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter((s) => s !== "");
      return val || [];
    }),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
