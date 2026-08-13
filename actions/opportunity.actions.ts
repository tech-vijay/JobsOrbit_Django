"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Opportunity } from "@/models/Opportunity";
import { Company } from "@/models/Company";
import { Category } from "@/models/Category";
import { opportunitySchema, OpportunityInput } from "@/validations/opportunity.schema";
import { generateSlug, generateUniqueSlug } from "@/lib/utils/slug";
import { IOpportunity } from "@/types/opportunity.types";
import { isExpired } from "@/lib/utils/date";

export interface GetOpportunitiesFilters {
  search?: string;
  type?: string;
  category?: string;
  company?: string;
  status?: string;
  featured?: boolean;
  workMode?: string;
  jobType?: string;
  page?: number;
  limit?: number;
}

export async function getOpportunities(filters: GetOpportunitiesFilters = {}) {
  try {
    await connectToDatabase();
    const {
      search,
      type,
      category,
      company,
      status,
      featured,
      workMode,
      jobType,
      page = 1,
      limit = 20,
    } = filters;

    const query: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { skills: { $regex: search.trim(), $options: "i" } },
        { location: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (type && type !== "all") query.type = type;
    if (category && category !== "all") query.category = category;
    if (company && company !== "all") query.company = company;
    if (status && status !== "all") query.status = status;
    if (featured !== undefined) query.featured = featured;
    if (workMode && workMode !== "all") query.workMode = workMode;
    if (jobType && jobType !== "all") query.jobType = jobType;

    const skip = (page - 1) * limit;

    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .populate("company", "name slug logo")
        .populate("category", "name slug")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Opportunity.countDocuments(query),
    ]);

    // Check deadlines and auto-update status to expired if needed
    const updatedOps = opportunities.map((op) => {
      if (op.deadline && isExpired(op.deadline) && op.status === "published") {
        op.status = "expired";
        // Fire & forget update to MongoDB
        Opportunity.findByIdAndUpdate(op._id, { status: "expired" }).exec();
      }
      return op;
    });

    return {
      opportunities: JSON.parse(JSON.stringify(updatedOps)) as IOpportunity[],
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  } catch (error) {
    console.error("[getOpportunities Error]:", error);
    return { opportunities: [], total: 0, totalPages: 1, page: 1 };
  }
}

export async function getOpportunityById(id: string): Promise<IOpportunity | null> {
  try {
    await connectToDatabase();
    const opportunity = await Opportunity.findById(id)
      .populate("company")
      .populate("category")
      .lean();

    if (!opportunity) return null;
    return JSON.parse(JSON.stringify(opportunity));
  } catch (error) {
    console.error("[getOpportunityById Error]:", error);
    return null;
  }
}

export async function getOpportunityBySlug(slug: string): Promise<IOpportunity | null> {
  try {
    await connectToDatabase();
    const opportunity = await Opportunity.findOne({ slug })
      .populate("company")
      .populate("category")
      .lean();

    if (!opportunity) return null;
    return JSON.parse(JSON.stringify(opportunity));
  } catch (error) {
    console.error("[getOpportunityBySlug Error]:", error);
    return null;
  }
}

export async function createOpportunity(input: OpportunityInput) {
  try {
    const validated = opportunitySchema.parse(input);
    await connectToDatabase();

    // Verify company & category exist
    const [companyExists, categoryExists] = await Promise.all([
      Company.findById(validated.company),
      Category.findById(validated.category),
    ]);

    if (!companyExists) return { success: false, error: "Selected company does not exist" };
    if (!categoryExists) return { success: false, error: "Selected category does not exist" };

    const baseSlug = validated.slug && validated.slug.trim() !== ""
      ? generateSlug(validated.slug)
      : generateSlug(`${validated.title}-at-${companyExists.name}`);

    const existingSlug = await Opportunity.findOne({ slug: baseSlug });
    const finalSlug = existingSlug ? generateUniqueSlug(baseSlug) : baseSlug;

    const opportunity = await Opportunity.create({
      ...validated,
      slug: finalSlug,
      publishedAt: validated.status === "published" ? new Date() : undefined,
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    revalidatePath("/");
    return { success: true, opportunity: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error) {
    console.error("[createOpportunity Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create opportunity" };
  }
}

export async function updateOpportunity(id: string, input: OpportunityInput) {
  try {
    const validated = opportunitySchema.parse(input);
    await connectToDatabase();

    const existing = await Opportunity.findById(id);
    if (!existing) return { success: false, error: "Opportunity not found" };

    let slug = existing.slug;
    if (validated.slug && validated.slug.trim() !== "") {
      slug = generateSlug(validated.slug);
    }

    const updated = await Opportunity.findByIdAndUpdate(
      id,
      {
        ...validated,
        slug,
      },
      { new: true, runValidators: true }
    ).lean();

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    revalidatePath(`/jobs/${slug}`);
    revalidatePath(`/internships/${slug}`);
    return { success: true, opportunity: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("[updateOpportunity Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update opportunity" };
  }
}

export async function deleteOpportunity(id: string) {
  try {
    await connectToDatabase();
    await Opportunity.findByIdAndDelete(id);

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[deleteOpportunity Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete opportunity" };
  }
}

export async function toggleOpportunityStatus(id: string, newStatus: "draft" | "published" | "expired") {
  try {
    await connectToDatabase();
    const update: Record<string, unknown> = { status: newStatus };
    if (newStatus === "published") update.publishedAt = new Date();

    await Opportunity.findByIdAndUpdate(id, update);

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    return { success: true };
  } catch (error) {
    console.error("[toggleOpportunityStatus Error]:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function toggleOpportunityFeatured(id: string) {
  try {
    await connectToDatabase();
    const op = await Opportunity.findById(id);
    if (!op) return { success: false, error: "Opportunity not found" };

    op.featured = !op.featured;
    await op.save();

    revalidatePath("/admin/opportunities");
    revalidatePath("/");
    return { success: true, featured: op.featured };
  } catch (error) {
    console.error("[toggleOpportunityFeatured Error]:", error);
    return { success: false, error: "Failed to toggle featured status" };
  }
}

export async function duplicateOpportunity(id: string) {
  try {
    await connectToDatabase();
    const source = await Opportunity.findById(id).lean();
    if (!source) return { success: false, error: "Source opportunity not found" };

    const newTitle = `${source.title} (Copy)`;
    const newSlug = generateUniqueSlug(generateSlug(newTitle));

    const rest = { ...source } as Record<string, unknown>;
    delete rest._id;
    delete rest.createdAt;
    delete rest.updatedAt;

    const copy = await Opportunity.create({
      ...rest,
      title: newTitle,
      slug: newSlug,
      status: "draft",
      featured: false,
    });

    revalidatePath("/admin/opportunities");
    return { success: true, opportunity: JSON.parse(JSON.stringify(copy)) };
  } catch (error) {
    console.error("[duplicateOpportunity Error]:", error);
    return { success: false, error: "Failed to duplicate opportunity" };
  }
}
