import { getOpportunities } from "@/actions/opportunity.actions";
import { getCategories } from "@/actions/category.actions";
import { getBlogPosts } from "@/actions/blog.actions";
import HeroSection from "@/components/public/home/HeroSection";
import LatestOpportunities from "@/components/public/home/LatestOpportunities";
import CategoriesSection from "@/components/public/home/CategoriesSection";
import ClosingSoon from "@/components/public/home/ClosingSoon";
import FeaturedOpportunities from "@/components/public/home/FeaturedOpportunities";
import LatestBlogPosts from "@/components/public/home/LatestBlogPosts";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Find Student Jobs & Internships",
  description: siteConfig.description,
});

export default async function HomePage() {
  const [opportunitiesData, categories, blogData] = await Promise.all([
    getOpportunities({ status: "published", limit: 12 }),
    getCategories(),
    getBlogPosts({ status: "published", limit: 3 }),
  ]);

  const opportunities = opportunitiesData.opportunities;
  const blogPosts = blogData.posts;

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Opportunities (if any) */}
      <FeaturedOpportunities opportunities={opportunities} />

      {/* Latest Opportunities Section */}
      <LatestOpportunities opportunities={opportunities} />

      {/* Categories Grid */}
      <CategoriesSection categories={categories} />

      {/* Closing Soon Section */}
      <ClosingSoon opportunities={opportunities} />

      {/* Latest Blog Posts */}
      <LatestBlogPosts posts={blogPosts} />
    </div>
  );
}
