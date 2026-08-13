"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/media/ImageUploader";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface UploadedMediaItem {
  url: string;
  publicId: string;
  createdAt: Date;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleUploadSuccess = (url: string, publicId: string) => {
    setMediaList((prev) => [
      { url, publicId, createdAt: new Date() },
      ...prev,
    ]);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success("Image URL copied!");
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Media Library
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Upload company logos, blog cover images, and graphics to Cloudinary.
        </p>
      </div>

      {/* Session notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-amber-500 text-lg shrink-0">💡</span>
        <div>
          <p className="text-sm font-semibold text-amber-900">Session-only gallery</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Uploaded images are saved permanently to Cloudinary — but the preview list below
            resets when you navigate away. Copy the URL immediately after uploading and paste it
            into the Company Logo or Blog Cover Image fields.
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
        <ImageUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Uploaded items grid */}
      {mediaList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-display font-semibold text-neutral-900">
            Recent Uploads ({mediaList.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaList.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm space-y-2 p-3"
              >
                <div className="w-full h-36 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-2xs font-mono text-neutral-400 truncate max-w-[160px]">
                    {item.publicId}
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(item.url)}
                  >
                    {copiedUrl === item.url ? (
                      <Check className="w-3 h-3 text-success-700" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedUrl === item.url ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
