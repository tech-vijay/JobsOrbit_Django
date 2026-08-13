"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { Opportunity } from "@/models/Opportunity";
import { Company } from "@/models/Company";
import { Category } from "@/models/Category";
import { BlogPost } from "@/models/BlogPost";
import { IOpportunity } from "@/types/opportunity.types";

export interface AdminStats {
  totalOpportunities: number;
  publishedOpportunities: number;
  draftOpportunities: number;
  totalCompanies: number;
  totalCategories: number;
  totalBlogPosts: number;
  recentOpportunities: IOpportunity[];
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    await connectToDatabase();

    const [
      totalOpportunities,
      publishedOpportunities,
      draftOpportunities,
      totalCompanies,
      totalCategories,
      totalBlogPosts,
      recentOpportunities,
    ] = await Promise.all([
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ status: "published" }),
      Opportunity.countDocuments({ status: { $in: ["draft", "expired"] } }),
      Company.countDocuments(),
      Category.countDocuments(),
      BlogPost.countDocuments(),
      Opportunity.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("company", "name logo")
        .populate("category", "name")
        .lean(),
    ]);

    return {
      totalOpportunities,
      publishedOpportunities,
      draftOpportunities,
      totalCompanies,
      totalCategories,
      totalBlogPosts,
      recentOpportunities: JSON.parse(JSON.stringify(recentOpportunities)),
    };
  } catch (error) {
    console.error("[getAdminStats Error]:", error);
    return {
      totalOpportunities: 0,
      publishedOpportunities: 0,
      draftOpportunities: 0,
      totalCompanies: 0,
      totalCategories: 0,
      totalBlogPosts: 0,
      recentOpportunities: [],
    };
  }
}
