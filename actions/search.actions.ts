"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { Opportunity } from "@/models/Opportunity";
import { Company } from "@/models/Company";
import { Category } from "@/models/Category";
import { BlogPost } from "@/models/BlogPost";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import { IBlogPost } from "@/types/blog.types";

export interface GlobalSearchResults {
  opportunities: IOpportunity[];
  companies: ICompany[];
  categories: ICategory[];
  blogPosts: IBlogPost[];
}

export async function searchAll(query: string): Promise<GlobalSearchResults> {
  if (!query || query.trim().length < 2) {
    return {
      opportunities: [],
      companies: [],
      categories: [],
      blogPosts: [],
    };
  }

  try {
    await connectToDatabase();
    const regex = new RegExp(query.trim(), "i");

    const [opportunities, companies, categories, blogPosts] = await Promise.all([
      Opportunity.find({
        status: "published",
        $or: [
          { title: regex },
          { skills: { $elemMatch: { $regex: regex } } },
          { location: regex },
        ],
      })
        .populate("company", "name logo slug")
        .populate("category", "name slug")
        .limit(6)
        .lean(),

      Company.find({ name: regex }).limit(4).lean(),

      Category.find({ name: regex }).limit(4).lean(),

      BlogPost.find({
        status: "published",
        $or: [{ title: regex }, { category: regex }],
      })
        .limit(4)
        .lean(),
    ]);

    return {
      opportunities: JSON.parse(JSON.stringify(opportunities)),
      companies: JSON.parse(JSON.stringify(companies)),
      categories: JSON.parse(JSON.stringify(categories)),
      blogPosts: JSON.parse(JSON.stringify(blogPosts)),
    };
  } catch (error) {
    console.error("[searchAll Error]:", error);
    return {
      opportunities: [],
      companies: [],
      categories: [],
      blogPosts: [],
    };
  }
}
