import { Briefcase, Building2, Tag, FileText, CheckCircle2, Clock } from "lucide-react";
import { getAdminStats } from "@/actions/stats.actions";
import StatCard from "@/components/admin/dashboard/StatCard";
import RecentActivityTable from "@/components/admin/dashboard/RecentActivityTable";
import QuickActionsCard from "@/components/admin/dashboard/QuickActionsCard";
import { siteConfig } from "@/config/site";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Dashboard Overview
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Welcome back! Here is a summary of {siteConfig.name} platform activity.
        </p>
      </div>

      {/* Quick Actions Bar */}
      <QuickActionsCard />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Opportunities"
          value={stats.totalOpportunities}
          description="Jobs, Internships & Off-campus"
          icon={Briefcase}
          href="/admin/opportunities"
          variant="primary"
        />

        <StatCard
          title="Published Opportunities"
          value={stats.publishedOpportunities}
          description="Live on public portal"
          icon={CheckCircle2}
          href="/admin/opportunities?status=published"
          variant="success"
        />

        <StatCard
          title="Draft / Expired"
          value={stats.draftOpportunities}
          description="Pending review or updated"
          icon={Clock}
          href="/admin/opportunities?status=draft"
          variant="warning"
        />

        <StatCard
          title="Partner Companies"
          value={stats.totalCompanies}
          description="Registered hiring employers"
          icon={Building2}
          href="/admin/companies"
          variant="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Recent Opportunities Table (2 columns) */}
        <div className="lg:col-span-2">
          <RecentActivityTable opportunities={stats.recentOpportunities} />
        </div>

        {/* Secondary Stats (1 column) */}
        <div className="space-y-4">
          <StatCard
            title="Technical Categories"
            value={stats.totalCategories}
            description="Domain classifications"
            icon={Tag}
            href="/admin/categories"
            variant="primary"
          />

          <StatCard
            title="Published Blog Posts"
            value={stats.totalBlogPosts}
            description="Career guides & tips"
            icon={FileText}
            href="/admin/blog"
            variant="accent"
          />
        </div>
      </div>
    </div>
  );
}
