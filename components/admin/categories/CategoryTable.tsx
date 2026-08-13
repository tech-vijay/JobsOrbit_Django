"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { ICategory } from "@/types/category.types";
import { deleteCategory } from "@/actions/category.actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import CategoryForm from "./CategoryForm";

interface CategoryTableProps {
  categories: ICategory[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      const res = await deleteCategory(deletingId);
      if (res.success) {
        toast.success("Category deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete category");
      }
    } catch {
      toast.error("Error deleting category");
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
              <th>Category</th>
              <th>Slug</th>
              <th>Description</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>
                  <div className="flex items-center gap-2.5 font-semibold text-neutral-900">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span>{category.name}</span>
                  </div>
                </td>
                <td className="text-xs text-neutral-500 font-mono">
                  /{category.slug}
                </td>
                <td className="text-xs text-neutral-500 max-w-xs truncate">
                  {category.description || "—"}
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(category._id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                      title="Delete Category"
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

      {/* Edit modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={`Edit Category: ${editingCategory?.name}`}
      >
        {editingCategory && (
          <CategoryForm
            initialData={editingCategory}
            onSuccess={() => setEditingCategory(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to delete this category?"
        loading={loading}
      />
    </>
  );
}
