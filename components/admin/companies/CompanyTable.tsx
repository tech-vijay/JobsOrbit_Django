"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, ExternalLink, Building2 } from "lucide-react";
import { toast } from "sonner";
import { ICompany } from "@/types/company.types";
import { deleteCompany } from "@/actions/company.actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatDate } from "@/lib/utils/date";

interface CompanyTableProps {
  companies: ICompany[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      const res = await deleteCompany(deletingId);
      if (res.success) {
        toast.success("Company deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete company");
      }
    } catch {
      toast.error("Error deleting company");
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Website</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                      {company.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {company.name}
                      </div>
                      <div className="text-2xs text-neutral-400 font-mono">
                        /{company.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-neutral-400 text-xs">—</span>
                  )}
                </td>
                <td className="text-xs text-neutral-500">
                  {formatDate(company.createdAt)}
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/companies/${company._id}/edit`}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingId(company._id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Company?"
        message="Are you sure you want to delete this company? Opportunities associated with it will remain unaffected."
        loading={loading}
      />
    </>
  );
}
