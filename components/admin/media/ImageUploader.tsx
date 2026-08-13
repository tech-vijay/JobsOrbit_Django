"use client";

import { useState } from "react";
import { UploadCloud, Check, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImageAction } from "@/actions/upload.actions";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  onUploadSuccess?: (url: string, publicId: string) => void;
  label?: string;
}

export default function ImageUploader({
  onUploadSuccess,
  label = "Upload Image (Cloudinary)",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImageAction(formData);

      if (res.success && res.url && res.publicId) {
        setUploadedUrl(res.url);
        toast.success("Image uploaded successfully!");
        if (onUploadSuccess) onUploadSuccess(res.url, res.publicId);
      } else {
        toast.error(res.error || "Failed to upload image");
      }
    } catch {
      toast.error("Upload error occurred");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async () => {
    if (!uploadedUrl) return;
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-3">
      {label && <label className="label">{label}</label>}

      {uploadedUrl ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-lg border border-neutral-200 bg-white overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedUrl} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-800 truncate">
                {uploadedUrl}
              </p>
              <p className="text-2xs text-success-700 font-medium mt-0.5">
                ✓ Uploaded to Cloudinary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={copyUrl}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy URL"}</span>
            </Button>
            <button
              type="button"
              onClick={() => setUploadedUrl(null)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-600 hover:bg-neutral-200 transition-colors"
              title="Upload another"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-neutral-200 hover:border-primary-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white hover:bg-neutral-50/50 text-center group">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-600 flex items-center justify-center mb-2 transition-colors">
            {uploading ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>
          <span className="text-xs font-semibold text-neutral-800">
            {uploading ? "Uploading to Cloudinary..." : "Click to upload image"}
          </span>
          <span className="text-2xs text-neutral-400 mt-1">
            PNG, JPG, WEBP up to 5MB
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
