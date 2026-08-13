"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit2,
  Trash2,
  Copy,
  Star,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import {
  deleteOpportunity,
  toggleOpportunityStatus,
  toggleOpportunityFeatured,
  duplicateOpportunity,
} from "@/actions/opportunity.actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { deadlineLabel } from "@/lib/utils/date";

interface OpportunityTableProps {
  opportunities: IOpportunity[];
}

export default function OpportunityTable({ opportunities }: OpportunityTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [featuredLoadingId, setFeaturedLoadingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      const res = await deleteOpportunity(deletingId);
      if (res.success) {
        toast.success("Opportunity deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete opportunity");
      }
    } catch {
      toast.error("Error deleting opportunity");
    } finally {
      setActionLoading(false);
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await toggleOpportunityStatus(id, nextStatus);
      if (res.success) {
        toast.success(`Status updated to ${nextStatus}`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (id: string) => {
    if (featuredLoadingId) return;
    setFeaturedLoadingId(id);
    try {
      const res = await toggleOpportunityFeatured(id);
      if (res.success) {
        toast.success(res.featured ? "Marked as Featured" : "Removed from Featured");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to toggle featured");
      }
    } finally {
      setFeaturedLoadingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (duplicatingId) return;
    setDuplicatingId(id);
    try {
      const res = await duplicateOpportunity(id);
      if (res.success) {
        toast.success("Opportunity duplicated as draft!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to duplicate");
      }
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title &amp; Company</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Deadline</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((op) => {
              const company = typeof op.company === "object" ? (op.company as ICompany) : null;
              const category = typeof op.category === "object" ? (op.category as ICategory) : null;
              const dl = op.deadline ? deadlineLabel(op.deadline) : null;

              return (
                <tr key={op._id}>
                  {/* Title & Company */}
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                        {company?.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Building2 className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/admin/opportunities/${op._id}`}
                            className="font-semibold text-neutral-900 hover:text-primary-600 no-underline"
                          >
                            {op.title}
                          </Link>
                          {op.featured && (
                            <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-500 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {company?.name || "Unknown Company"} • {op.location || op.workMode}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td>
                    <Badge variant={op.type === "internship" ? "accent" : "primary"}>
                      {op.type.toUpperCase()}
                    </Badge>
                  </td>

                  {/* Category */}
                  <td className="text-xs text-neutral-600">
                    {category?.name || "General"}
                  </td>

                  {/* Status toggle */}
                  <td>
                    <button
                      onClick={() => handleToggleStatus(op._id, op.status)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge
                        variant={
                          op.status === "published"
                            ? "success"
                            : op.status === "expired"
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {op.status}
                      </Badge>
                    </button>
                  </td>

                  {/* Deadline */}
                  <td className="text-xs">
                    {dl ? (
                      <span className={dl.expired ? "text-danger-600 font-medium" : dl.urgent ? "text-accent-600 font-medium" : "text-neutral-500"}>
                        {dl.label}
                      </span>
                    ) : (
                      <span className="text-neutral-400">No deadline</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      {/* Featured toggle */}
                      <button
                        onClick={() => handleToggleFeatured(op._id)}
                        disabled={featuredLoadingId === op._id}
                        className={`p-1.5 rounded-lg transition-colors ${
                          op.featured
                            ? "text-accent-500 bg-accent-50 hover:bg-accent-100"
                            : "text-neutral-400 hover:text-accent-500 hover:bg-neutral-100"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={op.featured ? "Unfeature" : "Mark as Featured"}
                      >
                        <Star className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(op._id)}
                        disabled={duplicatingId === op._id}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Duplicate Post"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <Link
                        href={`/admin/opportunities/${op._id}/edit`}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => setDeletingId(op._id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Opportunity?"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        loading={actionLoading}
      />
    </>
  );
}
