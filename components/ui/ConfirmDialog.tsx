"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-slide-up"
      >
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4",
            variant === "danger" ? "bg-danger-100" : "bg-warning-100"
          )}
        >
          {variant === "danger" ? (
            <Trash2 className="w-6 h-6 text-danger-600" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-warning-600" />
          )}
        </div>

        <h2
          id="confirm-title"
          className="text-lg font-display font-semibold text-neutral-900 text-center mb-2"
        >
          {title}
        </h2>
        <p
          id="confirm-message"
          className="text-sm text-neutral-500 text-center leading-relaxed mb-6"
        >
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn btn-secondary btn-md flex-1"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "btn btn-md flex-1",
              variant === "danger" ? "btn-danger" : "btn-accent"
            )}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
