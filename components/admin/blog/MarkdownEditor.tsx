"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Edit3, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  error?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  label = "Blog Content (Markdown)",
  error,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="label mb-0">{label}</label>
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all",
              activeTab === "write"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all",
              activeTab === "preview"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="# Article Title&#10;&#10;Write your career advice article using Markdown formatting..."
          rows={14}
          className={cn(
            "input font-mono text-xs leading-relaxed resize-y min-h-[300px]",
            error && "input-error"
          )}
        />
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 min-h-[300px] max-h-[500px] overflow-y-auto prose prose-sm max-w-none text-neutral-800 leading-relaxed space-y-3">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-neutral-400 text-xs italic">
              Nothing to preview yet. Switch to &quot;Write&quot; tab to type markdown.
            </p>
          )}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
