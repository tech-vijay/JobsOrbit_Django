import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Opportunity } from "@/models/Opportunity";
import { Category } from "@/models/Category";
import { Company } from "@/models/Company";
import { BlogPost } from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internships`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    await connectToDatabase();

    const [opportunities, categories, companies, blogPosts] = await Promise.all([
      Opportunity.find({ status: "published" }).select("slug type updatedAt").lean(),
      Category.find({}).select("slug updatedAt").lean(),
      Company.find({}).select("slug updatedAt").lean(),
      BlogPost.find({ status: "published" }).select("slug updatedAt").lean(),
    ]);

    const opportunityRoutes: MetadataRoute.Sitemap = opportunities.map((op) => ({
      url: `${baseUrl}/${op.type === "internship" ? "internships" : "jobs"}/${op.slug}`,
      lastModified: op.updatedAt ? new Date(op.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const companyRoutes: MetadataRoute.Sitemap = companies.map((comp) => ({
      url: `${baseUrl}/companies/${comp.slug}`,
      lastModified: comp.updatedAt ? new Date(comp.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...opportunityRoutes,
      ...categoryRoutes,
      ...companyRoutes,
      ...blogRoutes,
    ];
  } catch (error) {
    console.error("[Sitemap Error]:", error);
    return staticRoutes;
  }
}
