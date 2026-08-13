import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  slug: z.string().optional(),
  logo: z.string().optional(),
  logoPublicId: z.string().optional(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional(),
  description: z.string().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;
